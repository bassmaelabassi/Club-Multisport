const express = require('express');
const router = express.Router();
const { getStats, getUserStats } = require('../controllers/statsController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, admin, getStats);

router.route('/user')
  .get(protect, getUserStats);

module.exports = router;
