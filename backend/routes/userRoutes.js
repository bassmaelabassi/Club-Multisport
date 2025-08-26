const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    promoteToCoach,
    getCoaches,
    updateUserRole
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, admin, getUsers);

router.route('/coaches')
    .get(protect, getCoaches);

router.route('/:id/promote-to-coach')
    .post(protect, admin, promoteToCoach);

router.route('/:id/role')
    .put(protect, admin, updateUserRole);

router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;