const express = require('express');
const router = express.Router();
const { 
  getActivities, 
  getActivityById, 
  createActivity, 
  updateActivity, 
  deleteActivity,
  getActivitiesByCoach,
  getAvailableSlots
} = require('../controllers/activityController');
const { protect, admin, coachOrAdmin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getActivities)
  .post(protect, coachOrAdmin, createActivity);

router.route('/:id')
  .get(getActivityById)
  .put(protect, coachOrAdmin, updateActivity)
  .delete(protect, coachOrAdmin, deleteActivity);

router.route('/:id/available-slots')
  .get(getAvailableSlots);

router.route('/coach/:coachId')
  .get(protect, coachOrAdmin, getActivitiesByCoach);

module.exports = router;