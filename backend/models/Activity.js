const { required } = require('joi');
const mongoose = require('mongoose');

const isActiveSchema = new mongoose.Schema({
  name: { type: String, required: true};
  category: { type: String, required: true, enum: ['danse', 'musique', 'natation', 'equitation', 'fitness','autre']
  },
  description: { type: String, required: true},
  coach: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  schedule: [
    {
      day: { type: String, enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']}
      startTime: { type: String},
      endTime: { type: String},
      maxParticipants: { type: Number},
    }
  ],
  price: { type: Number, required: true},
  duration: { type: Number, required: true },
  location: { type: String, required: true },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.export = mongoose.model('Activity', isActiveSchema);