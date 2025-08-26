const express = require('express');
const router = express.Router();
const { 
  createContact, 
  getAllContacts, 
  getContactById, 
  markAsRead, 
  replyToContact, 
  deleteContact, 
  getContactStats, 
  getMyContacts
} = require('../controllers/contactController');
const { protect, admin, coachOrAdmin, optionalAuth } = require('../middlewares/authMiddleware');
router.route('/')
  .post(optionalAuth, createContact);

router.route('/me')
  .get(protect, getMyContacts);

router.route('/admin')
  .get(protect, coachOrAdmin, getAllContacts);

router.route('/admin/stats')
  .get(protect, admin, getContactStats);

router.route('/admin/:id')
  .get(protect, admin, getContactById)
  .delete(protect, admin, deleteContact);

router.route('/admin/:id/read')
  .put(protect, admin, markAsRead);

router.route('/admin/:id/reply')
  .put(protect, coachOrAdmin, replyToContact);

module.exports = router;
