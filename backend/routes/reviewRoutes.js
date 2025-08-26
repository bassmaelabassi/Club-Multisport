const express = require('express');
const router = express.Router();
const { 
  createReview, 
  getActivityReviews, 
  updateReview, 
  deleteReview 
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createReview);

router.route('/activity/:activityId')
  .get(getActivityReviews);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
