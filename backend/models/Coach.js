const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String },
  specialties: [{ type: String }],
  certifications: [{ type: String }],
  yearsOfExperience: { type: Number },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model('Coach', CoachSchema);