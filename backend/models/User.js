const mongoose = require ('mongoose');
const bcrypt = require('brcyptjs');
const { required } = require('joi');

const UserSchema = new mongoose.Schema({
  Name: { type: String, required: true},
  lastName: { type: String, required: true},
  email: { type: String, required: true},
  password: {type: String, required: true},
  role: {type: String, enum: ['user','coach', 'admin'], default: 'user'},
  phone: { type: String},
  address: { street: String, city: String, zipCode: String, country: String},
  loyaltyPoint: { type: Number, default: 0},
    rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);