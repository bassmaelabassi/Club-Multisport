const Coach = require('../models/Coach');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Review = require('../models/Review');

const getCoaches = async (req, res, next) => {
  try {
    const coaches = await Coach.find({})
      .populate('user', 'firstName lastName email')
      .sort({ rating: -1 });
      
    res.json(coaches);
  } catch (err) {
    next(err);
  }
};

const getCoachById = async (req, res, next) => {
  try {
    const coach = await Coach.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate({
        path: 'activities',
        select: 'name category schedule',
        match: { isActive: true }
      });
      
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    const reviews = await Review.find({ coach: coach.user._id })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      ...coach.toObject(),
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

const updateCoachProfile = async (req, res, next) => {
  try {
    const coach = await Coach.findById(req.params.id);
    
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    
    if (coach.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this coach profile' });
    }
    
    coach.bio = req.body.bio || coach.bio;
    coach.specialties = req.body.specialties || coach.specialties;
    coach.certifications = req.body.certifications || coach.certifications;
    coach.yearsOfExperience = req.body.yearsOfExperience || coach.yearsOfExperience;
    coach.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : coach.isAvailable;
    
    const updatedCoach = await coach.save();
    
    res.json(updatedCoach);
  } catch (err) {
    next(err);
  }
};

const getCoachActivities = async (req, res, next) => {
  try {
    let coach = await Coach.findById(req.params.id);
    
    if (!coach) {
      coach = await Coach.findOne({ user: req.params.id });
    }

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    
    const activities = await Activity.find({ 
      coach: coach.user,
      isActive: true 
    }).sort({ name: 1 });
    
    res.json(activities);
  } catch (err) {
    next(err);
  }
};

const addCoachReview = async (req, res, next) => {
  try {
    const coach = await Coach.findById(req.params.id);
    
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    
    const { rating, comment, activityId } = req.body;
    const hasReservation = await Reservation.findOne({
      user: req.user._id,
      activity: activityId,
      status: 'completed'
    });
    
    if (!hasReservation) {
      return res.status(403).json({ message: 'You must complete a session before reviewing' });
    }
    
    const existingReview = await Review.findOne({
      user: req.user._id,
      coach: coach.user,
      activity: activityId
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this coach for this activity' });
    }
    
    const review = await Review.create({
      user: req.user._id,
      coach: coach.user,
      activity: activityId,
      rating,
      comment
    });

    const reviews = await Review.find({ coach: coach.user });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    coach.rating = totalRating / reviews.length;
    coach.reviewsCount = reviews.length;
    await coach.save();
    
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCoaches,
  getCoachById,
  updateCoachProfile,
  getCoachActivities,
  addCoachReview,
};