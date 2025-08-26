const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['danse', 'musique', 'natation', 'équitation', 'fitness', 'yoga', 'autre'] 
  },
  description: { type: String, required: true },
  coach: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schedule: [
    {
      day: { type: String, enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] },
      startTime: { type: String },
      endTime: { type: String },
      maxParticipants: { type: Number },
    }
  ],
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  location: { type: String, required: true },
  image: { type: String },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', ActivitySchema);