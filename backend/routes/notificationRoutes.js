const express = require('express');
const router = express.Router();
const { 
  getUserNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  getNotificationsByUserId
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getUserNotifications);

router.route('/read-all')
  .put(protect, markAllAsRead);

router.route('/:id/read')
  .put(protect, markAsRead);

router.route('/:id')
  .delete(protect, deleteNotification);

router.route('/:userId')
  .get(protect, getNotificationsByUserId);

module.exports = router;