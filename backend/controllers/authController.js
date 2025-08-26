const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { userValidationSchema } = require('../utils/validate');
const { sendWelcomeEmail } = require('../utils/mailUtils');

const registerUser = async (req, res, next) => {
  try {
    console.log('Registration request body:', req.body);
    
    const safeTrim = (value) => {
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') return value.trim();
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'boolean') return value.toString();
      return '';
    };
    
    const userData = {
      firstName: safeTrim(req.body.firstName),
      lastName: safeTrim(req.body.lastName),
      email: safeTrim(req.body.email),
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      phone: safeTrim(req.body.phone) || undefined,
      birthDate: req.body.birthDate || undefined,
    };


    if (req.body.address && typeof req.body.address === 'object' && req.body.address !== null) {
      const address = req.body.address;
      if (address.street || address.city || address.zipCode || address.country) {
        userData.address = {
          street: safeTrim(address.street) || '',
          city: safeTrim(address.city) || '',
          zipCode: safeTrim(address.zipCode) || '',
          country: safeTrim(address.country) || ''
        };
      }
    }

    console.log('Données nettoyées:', userData);
    
    const { error } = userValidationSchema.validate(userData);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { firstName, lastName, email, password, confirmPassword, phone, birthDate } = userData;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone: phone || undefined,
      birthDate: birthDate || undefined,
      address: userData.address || undefined,
    });
    
    await sendWelcomeEmail(user.email, `${user.firstName} ${user.lastName}`);

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err);
    next(err);
  }
};
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};