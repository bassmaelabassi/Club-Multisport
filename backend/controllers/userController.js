const User = require('../models/User');
const Coach = require('../models/Coach');
const { userValidationSchema, userUpdateValidationSchema } = require('../utils/validate');

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        next(err);
    }
};

const getCoaches = async (req, res, next) => {
    try {
        const coaches = await User.find({ role: 'coach' }).select('-password');
        res.json(coaches);
    } catch (err) {
        next(err);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { error } = userUpdateValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this user' });
        }

        if (req.body.firstName !== undefined) user.firstName = req.body.firstName;
        if (req.body.lastName !== undefined) user.lastName = req.body.lastName;
        if (req.body.email !== undefined) user.email = req.body.email;
        if (req.body.birthDate !== undefined) user.birthDate = req.body.birthDate;
        if (req.body.phone !== undefined) user.phone = req.body.phone;
        if (req.body.password) {
            user.password = req.body.password;
        }

        if (user.role === 'coach') {
            try {
                const coach = await Coach.findOne({ user: user._id });
                if (coach) {
                    if (req.body.speciality !== undefined) coach.speciality = req.body.speciality;
                    if (req.body.experience !== undefined) coach.yearsOfExperience = req.body.experience;
                    if (req.body.rating !== undefined) coach.rating = req.body.rating;
                    if (req.body.bio !== undefined) coach.bio = req.body.bio;
                    await coach.save();
                }
            } catch (coachError) {
                console.error('Erreur lors de la mise à jour du profil coach:', coachError);
            }
        }

        const updatedUser = await user.save();

        let responseData = {
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role
        };

        if (updatedUser.role === 'coach') {
            try {
                const coach = await Coach.findOne({ user: updatedUser._id });
                if (coach) {
                    responseData = {
                        ...responseData,
                        speciality: coach.speciality,
                        experience: coach.yearsOfExperience,
                        rating: coach.rating,
                        bio: coach.bio
                    };
                }
            } catch (coachError) {
                console.error('Erreur lors de la récupération du profil coach:', coachError);
            }
        }

        res.json(responseData);
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }
        await User.deleteOne({ _id: req.params.id });
        res.json({ message: 'User removed' });
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

const createCoach = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, speciality, experience, rating, bio, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }
    
    const finalPassword = password || Math.random().toString(36).slice(-8);
        const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: finalPassword,
      role: 'coach'
    });
    
    const coach = await Coach.create({
      user: user._id,
      speciality: speciality || '',
      yearsOfExperience: experience || 0,
      rating: rating || 0,
      bio: bio || ''
    });
    
    res.status(201).json({
      message: 'Coach créé avec succès',
      coach: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        speciality: coach.speciality,
        experience: coach.yearsOfExperience,
        rating: coach.rating,
        bio: coach.bio,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    if (!role || !['user', 'coach', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be user, coach, or admin' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can change user roles' });
    }
    
    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ message: 'Cannot demote yourself from admin role' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ 
      message: 'User role updated successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getCoaches,
  getUserById,
  updateUser,
  deleteUser,
  promoteToCoach,
  updateUserRole,
  createCoach,
};