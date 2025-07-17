const Activity = require('../models/Activity');
const User = require('../models/User');
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
    const { error } = activityValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const coach = await User.findById(req.body.coach);
    if (!coach || coach.role !== 'coach') {
      return res.status(400).json({ message: 'Invalid coach specified' });
    }
    
    const activity = await Activity.create(req.body);
    
    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
};

const updateActivity = async (req, res, next) => {
  try {
    const { error } = activityValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    if (req.body.coach) {
      const coach = await User.findById(req.body.coach);
      if (!coach || coach.role !== 'coach') {
        return res.status(400).json({ message: 'Invalid coach specified' });
      }
    }
    
    Object.assign(activity, req.body);
    const updatedActivity = await activity.save();
    
    res.json(updatedActivity);
  } catch (err) {
    next(err);
  }
};
const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    activity.isActive = false;
    await activity.save();
    
    res.json({ message: 'Activity deactivated' });
  } catch (err) {
    next(err);
  }
};

const getActivitiesByCoach = async (req, res, next) => {
  try {
    if (req.params.coachId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these activities' });
    }
    
    const activities = await Activity.find({ coach: req.params.coachId, isActive: true })
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
};