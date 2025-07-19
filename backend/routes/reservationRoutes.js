const express = require('express');
const router = express.Router();
const { 
  createReservation, 
  getUserReservations, 
  getReservations, 
  updateReservationStatus,
  cancelReservation,
  getReservationsByUserId,
  updateReservation,
  deleteReservation,
  getReservationsByActivityId
} = require('../controllers/reservationController');
const { protect, admin } = require('../middlewares/authMiddleware');

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
  .put(protect, admin, updateReservationStatus);

router.route('/:id/cancel')
  .put(protect, cancelReservation);

module.exports = router;