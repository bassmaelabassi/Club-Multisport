const Review = require('../models/Review');
const Activity = require('../models/Activity');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');

const createReview = async (req, res) => {
  try {
    const { activityId, rating, comment } = req.body;
    const userId = req.user._id;

    const hasCompletedReservation = await Reservation.findOne({
      user: userId,
      activity: activityId,
      status: 'completed'
    });
    if (!hasCompletedReservation) {
      return res.status(403).json({ message: 'Vous devez terminer cette activité avant de laisser un avis' });
    }
    const existingReview = await Review.findOne({ userId, activityId });
    if (existingReview) {
      return res.status(400).json({ message: 'Vous avez déjà laissé un avis pour cette activité' });
    }

    const review = await Review.create({
      userId,
      activityId,
      rating,
      comment
    });

    const activity = await Activity.findById(activityId);
    const reviews = await Review.find({ activityId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Activity.findByIdAndUpdate(activityId, {
      rating: avgRating,
      reviewsCount: reviews.length
    });
    await Reservation.updateMany(
      { user: userId, activity: activityId, status: 'completed' },
      { $set: { reviewed: true } }
    );

    try {
      const populatedActivity = await Activity.findById(activityId).populate('coach', 'firstName lastName');
      if (populatedActivity && populatedActivity.coach) {
        await Notification.create({
          user: populatedActivity.coach._id,
          title: 'Nouvel avis reçu',
          message: `Un membre a laissé un avis (${rating}/5) sur "${populatedActivity.name}"`,
          type: 'review',
          relatedEntity: { type: 'review', id: review._id }
        });
      }

      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        await Notification.create({
          user: admin._id,
          title: 'Nouvel avis reçu',
          message: `Nouvel avis (${rating}/5) sur "${activity.name}"`,
          type: 'review',
          relatedEntity: { type: 'review', id: review._id }
        });
      }
    } catch (notificationErr) {
      console.error('Erreur notification avis:', notificationErr);
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'avis' });
  }
};

const getActivityReviews = async (req, res) => {
  try {
    const { activityId } = req.params;
    const reviews = await Review.find({ activityId })
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des avis' });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findOne({ _id: id, userId });
    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'avis' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findOneAndDelete({ _id: id, userId });
    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    res.json({ message: 'Avis supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'avis' });
  }
};

module.exports = {
  createReview,
  getActivityReviews,
  updateReview,
  deleteReview
};
