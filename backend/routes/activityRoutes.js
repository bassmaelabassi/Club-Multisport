const express = require('express');
const router = express.Router();
const { 
  getActivities, 
  getActivityById, 
  createActivity, 
  updateActivity, 
  deleteActivity,
  getActivitiesByCoach
} = require('../controllers/activityController');
const { protect, admin, coachOrAdmin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getActivities)
  .post(protect, admin, createActivity);

router.route('/:id')
  .get(getActivityById)
  .put(protect, admin, updateActivity)
  .delete(protect, admin, deleteActivity);

router.route('/coach/:coachId')
  .get(protect, coachOrAdmin, getActivitiesByCoach);

module.exports = router;