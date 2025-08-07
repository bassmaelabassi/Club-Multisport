const express = require('express');
const router = express.Router();
const { 
  getCoaches, 
  getCoachById, 
  updateCoachProfile,
  getCoachActivities,
  addCoachReview
} = require('../controllers/coachController');
const { protect, coachOrAdmin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getCoaches);

router.route('/:id')
  .get(getCoachById)
  .put(protect, coachOrAdmin, updateCoachProfile);

router.route('/:id/activities')
  .get(getCoachActivities);

router.route('/:id/reviews')
  .post(protect, addCoachReview);

module.exports = router;