const express = require('express');
const router = express.Router();
const { 
  getCoaches, 
  getCoachById, 
  updateCoachProfile,
  getCoachActivities,
  addCoachReview
} = require('../controllers/coachController');
const { createCoach } = require('../controllers/userController');
const { protect, coachOrAdmin, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getCoaches)
  .post(protect, admin, createCoach);

router.route('/:id')
  .get(getCoachById)
  .put(protect, coachOrAdmin, updateCoachProfile);

router.route('/:id/activities')
  .get(getCoachActivities);

router.route('/me/activities')
  .get(protect, (req, res, next) => {
    req.params.id = req.user._id.toString();
    return getCoachActivities(req, res, next);
  });

router.route('/:id/reviews')
  .post(protect, addCoachReview);

module.exports = router;