const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    promoteToCoach
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, admin, getUsers);

    router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, updateUser)
    .delete(protect, admin, deleteUser);

router.route('/:id/promote-to-coach')
    .post(protect, admin, promoteToCoach);

module.exports = router;