const express = require('express');
const router = express.Router();
const { 
  testBackend,
  createReservation, 
  getUserReservations, 
  getReservations, 
  updateReservationStatus,
  cancelReservation,
  getReservationsByUserId,
  updateReservation,
  deleteReservation,
  getReservationsByActivityId,
  completeReservation
} = require('../controllers/reservationController');
const { protect, admin, coachOrAdmin } = require('../middlewares/authMiddleware');

router.get('/test', testBackend);

router.route('/')
  .post(protect, createReservation)
  .get(protect, admin, getReservations);

router.route('/user')
  .get(protect, getUserReservations);

router.route('/:userId')
  .get(protect, getReservationsByUserId)
  .put(protect, updateReservation)
  .delete(protect, deleteReservation);

router.route('/activity/:activityId')
  .get(protect, getReservationsByActivityId);

router.route('/:id/status')
  .put(protect, coachOrAdmin, updateReservationStatus);

router.route('/:id/cancel')
  .put(protect, cancelReservation);

router.route('/:id/complete')
  .put(protect, coachOrAdmin, completeReservation);

module.exports = router;