const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  type: { 
    type: String, 
    enum: ['reservation', 'system', 'promotion', 'contact', 'review', 'new_reservation'], 
    required: true 
  },
  relatedEntity: {
    type: { type: String },
    id: { type: mongoose.Schema.Types.ObjectId },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', NotificationSchema);