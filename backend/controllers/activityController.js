const Activity = require('../models/Activity');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const { activityValidationSchema, validateObjectId } = require('../utils/validate');

const getActivities = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    const activities = await Activity.find(filter)
      .populate('coach', 'firstName lastName email')
      .sort({ createdAt: -1 });
      
    res.json(activities);
  } catch (err) {
    next(err);
  }
};

const getActivityById = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid activity ID format' });
    }

    const activity = await Activity.findById(req.params.id)
      .populate('coach', 'firstName lastName email bio');
      
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.json(activity);
  } catch (err) {
    next(err);
  }
};

const createActivity = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'coach') {
      req.body.coach = req.user._id?.toString();
    }

    const { error } = activityValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    if (!validateObjectId(req.body.coach)) {
      return res.status(400).json({ message: 'Invalid coach ID format' });
    }
    
    const coach = await User.findById(req.body.coach);
    if (!coach || coach.role !== 'coach') {
      return res.status(400).json({ message: 'Invalid coach specified' });
    }
    
    const activity = await Activity.create(req.body);
    const populatedActivity = await activity.populate('coach', 'firstName lastName email');
    
    res.status(201).json(populatedActivity);
  } catch (err) {
    next(err);
  }
};

const updateActivity = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid activity ID format' });
    }
    if (req.user && req.user.role === 'coach' && !req.body.coach) {
      req.body.coach = req.user._id?.toString();
    }

    const { error } = activityValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (req.user && req.user.role === 'coach' && activity.coach.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this activity' });
    }
    if (req.user && req.user.role === 'coach' && req.body.coach && req.body.coach.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Coaches cannot reassign activities to another coach' });
    }

    if (req.body.coach) {
      if (!validateObjectId(req.body.coach)) {
        return res.status(400).json({ message: 'Invalid coach ID format' });
      }
      
      const coach = await User.findById(req.body.coach);
      if (!coach || coach.role !== 'coach') {
        return res.status(400).json({ message: 'Invalid coach specified' });
      }
    }
    
    Object.assign(activity, req.body);
    const updatedActivity = await activity.save();
    const populatedActivity = await updatedActivity.populate('coach', 'firstName lastName email');
    
    res.json(populatedActivity);
  } catch (err) {
    next(err);
  }
};

const deleteActivity = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid activity ID format' });
    }

    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

   
    if (req.user && req.user.role === 'coach' && activity.coach.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this activity' });
    }
    
    activity.isActive = false;
    await activity.save();
    
    res.json({ message: 'Activity deactivated' });
  } catch (err) {
    next(err);
  }
};

const getAvailableSlots = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid activity ID format' });
    }

    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const activity = await Activity.findById(id);
    if (!activity || !activity.isActive) {
      return res.status(404).json({ message: 'Activity not found or not active' });
    }

    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const dayOfWeek = days[new Date(date).getDay()];
    const scheduledSlots = activity.schedule.filter(slot => slot.day === dayOfWeek);

    if (scheduledSlots.length === 0) {
      return res.json({ availableSlots: [] });
    }
    const existingReservations = await Reservation.find({
      activity: id,
      'schedule.date': {
        $gte: new Date(date),
        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
      },
      status: { $in: ['pending', 'confirmed'] }
    });
    const availableSlots = scheduledSlots.map(slot => {
      const reservationsForSlot = existingReservations.filter(reservation => 
        reservation.schedule.startTime === slot.startTime && 
        reservation.schedule.endTime === slot.endTime
      );

      const availableSpots = slot.maxParticipants - reservationsForSlot.length;
      
      return {
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxParticipants: slot.maxParticipants,
        availableSpots: Math.max(0, availableSpots),
        isAvailable: availableSpots > 0
      };
    }).filter(slot => slot.isAvailable);

    res.json({ availableSlots });
  } catch (err) {
    next(err);
  }
};

const getActivitiesByCoach = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.coachId)) {
      return res.status(400).json({ message: 'Invalid coach ID format' });
    }

    if (req.params.coachId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these activities' });
    }
    
    const activities = await Activity.find({ coach: req.params.coachId, isActive: true })
      .populate('coach', 'firstName lastName email')
      .sort({ createdAt: -1 });
      
    res.json(activities);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivitiesByCoach,
  getAvailableSlots,
};