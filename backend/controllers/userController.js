const User = require('../models/User');
const Coach = require('../models/Coach');
const { userValidationSchema } = require('../utils/vamidate');
const { useReducer } = require('react');

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(user);
    } catch (err) {
        next(err);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not fount'});
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { error } = userValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message});
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }

        if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin'){
            return res.status(403).json({ message: 'Not authorized to update this user'});
        }

        user.firtName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email ||user.email;
        user.birthDate = req.body.birthDate || user.birthDate;
        user.phone = req.body.phone || user.phone;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updateUser = await user.save();

        res.json({
            _id: updateUser._id,
            firstName: updateUser.firstName,
            lastName: updateUser.lastName,
            emai: updateUser.email,
        });
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({ message: 'User not found'});
        }

        if (user._id.toString() === req.user._id.toString()){
            return res.status(400).json({ message: 'Cannot delete yourself'});
        }
        await user.remove();
        res.json({ message: 'User removed'});
    } catch (err) {
        next(err);
    }
};

const promoteToCoach = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === 'coach') {
      return res.status(400).json({ message: 'User is already a coach' });
    }
    
    user.role = 'coach';
    await user.save();
    
    const coach = await Coach.create({
      user: user._id,
      specialties: req.body.specialties || [],
      certifications: req.body.certifications || [],
      yearsOfExperience: req.body.yearsOfExperience || 0,
    });
    
    res.json({ 
      message: 'User promoted to coach',
      coach: {
        ...coach.toObject(),
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  promoteToCoach,
};