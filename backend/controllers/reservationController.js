const Reservation = require('../models/Reservation');
const Activity = require('../models/Activity');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendReservationConfirmation } = require('../utils/mailUtils');

const createReservation = async (req, res, next) => {
  try {
    const { activityId, schedule } = req.body;
   
    const activity = await Activity.findById(activityId);
    if (!activity || !activity.isActive) {
      return res.status(404).json({ message: 'Activity not found or not available' });
    }
    
    const validSchedule = activity.schedule.find(s => 
      s.day === schedule.day && 
      s.startTime === schedule.startTime && 
      s.endTime === schedule.endTime
    );
    
    if (!validSchedule) {
      return res.status(400).json({ message: 'Invalid schedule for this activity' });
    }
    const existingReservation = await Reservation.findOne({
      user: req.user._id,
      'schedule.day': schedule.day,
      'schedule.startTime': schedule.startTime,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingReservation) {
      return res.status(400).json({ message: 'You already have a reservation for this time slot' });
    }
    
    const reservationsCount = await Reservation.countDocuments({
      activity: activityId,
      'schedule.day': schedule.day,
      'schedule.startTime': schedule.startTime,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (reservationsCount >= validSchedule.maxParticipants) {
      return res.status(400).json({ message: 'No available spots for this time slot' });
    }
    
    const reservation = await Reservation.create({
      user: req.user._id,
      activity: activityId,
      schedule: {
        day: schedule.day,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      },
    });
    
    const user = await User.findById(req.user._id);
    user.loyaltyPoints += 10;
    await user.save();
    
    await Notification.create({
      user: req.user._id,
      title: 'Réservation en attente',
      message: `Votre réservation pour "${activity.name}" est en attente de confirmation.`,
      type: 'reservation',
      relatedEntity: {
        type: 'reservation',
        id: reservation._id,
      },
    });
    
    await sendReservationConfirmation(
      user.email,
      `${user.firstName} ${user.lastName}`,
      activity.name,
      schedule.date,
      schedule.startTime
    );
    
    res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
};

const getUserReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('activity', 'name category')
      .sort({ 'schedule.date': 1, 'schedule.startTime': 1 });
      
    res.json(reservations);
  } catch (err) {
    next(err);
  }
};

const getReservations = async (req, res, next) => {
  try {
    const { status, activityId } = req.query;
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (activityId) {
      filter.activity = activityId;
    }
    
    const reservations = await Reservation.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('activity', 'name')
      .sort({ createdAt: -1 });
      
    res.json(reservations);
  } catch (err) {
    next(err);
  }
};

const updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('activity', 'name');
      
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    if (reservation.status !== 'pending') {
      return res.status(400).json({ message: 'Reservation status cannot be changed' });
    }
    
    reservation.status = status;
    await reservation.save();

    await Notification.create({
      user: reservation.user._id,
      title: `Réservation ${status === 'confirmed' ? 'confirmée' : 'annulée'}`,
      message: `Votre réservation pour "${reservation.activity.name}" a été ${status === 'confirmed' ? 'confirmée' : 'annulée'}.`,
      type: 'reservation',
      relatedEntity: {
        type: 'reservation',
        id: reservation._id,
      },
    });
    
    res.json(reservation);
  } catch (err) {
    next(err);
  }
};

const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('activity', 'name');
      
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    if (reservation.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }
    
    if (reservation.status !== 'pending' && reservation.status !== 'confirmed') {
      return res.status(400).json({ message: 'Reservation cannot be cancelled' });
    }
    
    reservation.status = 'cancelled';
    await reservation.save();

    await Notification.create({
      user: reservation.user._id,
      title: 'Réservation annulée',
      message: `Votre réservation pour "${reservation.activity.name}" a été annulée.`,
      type: 'reservation',
      relatedEntity: {
        type: 'reservation',
        id: reservation._id,
      },
    });
    
    res.json(reservation);
  } catch (err) {
    next(err);
  }
};

const getReservationsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const reservations = await Reservation.find({ user: userId })
      .populate('activity', 'name category')
      .sort({ 'schedule.date': 1, 'schedule.startTime': 1 });
    res.json(reservations);
  } catch (err) {
    next(err);
  }
};
const updateReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    if (reservation.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this reservation' });
    }
    if (reservation.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending reservations can be updated' });
    }
    if (req.body.schedule) {
      reservation.schedule = req.body.schedule;
    }
    await reservation.save();
    res.json(reservation);
  } catch (err) {
    next(err);
  }
};

const deleteReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    if (reservation.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this reservation' });
    }
    await reservation.deleteOne();
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    next(err);
  }
};

const getReservationsByActivityId = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    if (req.user.role !== 'admin') {
      const activity = await Activity.findById(activityId);
      if (!activity || activity.coach.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }
    const reservations = await Reservation.find({ activity: activityId })
      .populate('user', 'firstName lastName email')
      .sort({ 'schedule.date': 1, 'schedule.startTime': 1 });
    res.json(reservations);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReservation,
  getUserReservations,
  getReservations,
  updateReservationStatus,
  cancelReservation,
  getReservationsByUserId,
  updateReservation,
  deleteReservation,
  getReservationsByActivityId,
};