const Reservation = require('../models/Reservation');
const Activity = require('../models/Activity');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendReservationConfirmation } = require('../utils/mailUtils');

const testBackend = async (req, res) => {
  try {
    console.log('=== TEST BACKEND ENDPOINT ===');
    console.log('Headers reçus:', req.headers);
    console.log('Body reçu:', req.body);
    console.log('User:', req.user);
    
    const activities = await Activity.find({}).populate('coach', 'firstName lastName').limit(5);
    
    res.json({
      success: true,
      message: 'Backend fonctionne correctement',
      timestamp: new Date().toISOString(),
      user: req.user ? {
        id: req.user._id,
        role: req.user.role
      } : 'Non authentifié',
      activities: activities.map(activity => ({
        id: activity._id,
        name: activity.name,
        category: activity.category,
        price: activity.price,
        location: activity.location,
        coach: activity.coach ? {
          id: activity.coach._id,
          firstName: activity.coach.firstName,
          lastName: activity.coach.lastName
        } : null
      }))
    });
  } catch (error) {
    console.error('Erreur test backend:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur test backend',
      error: error.message
    });
  }
};

const createReservation = async (req, res, next) => {
  try {
    const { activityId, schedule } = req.body;
   
    const activity = await Activity.findById(activityId).populate('coach', 'firstName lastName');
    if (!activity || !activity.isActive) {
      return res.status(404).json({ message: 'Activity not found or not available' });
    }
    
    if (!activity.coach || !activity.price || !activity.location) {
      return res.status(400).json({ 
        success: false,
        statusCode: 400,
        message: 'L\'activité n\'a pas toutes les informations requises (coach, prix, lieu)',
        details: {
          hasCoach: !!activity.coach,
          hasPrice: !!activity.price,
          hasLocation: !!activity.location
        }
      });
    }
    
    const defaultSlots = [
      { day: 'lundi', startTime: '09:00', endTime: '10:00', maxParticipants: 10 },
      { day: 'lundi', startTime: '14:00', endTime: '15:00', maxParticipants: 10 },
      { day: 'lundi', startTime: '16:00', endTime: '17:00', maxParticipants: 10 },
      { day: 'mardi', startTime: '09:00', endTime: '10:00', maxParticipants: 10 },
      { day: 'mardi', startTime: '14:00', endTime: '15:00', maxParticipants: 10 },
      { day: 'mardi', startTime: '16:00', endTime: '17:00', maxParticipants: 10 },
      { day: 'mercredi', startTime: '09:00', endTime: '10:00', maxParticipants: 10 },
      { day: 'mercredi', startTime: '14:00', endTime: '15:00', maxParticipants: 10 },
      { day: 'mercredi', startTime: '16:00', endTime: '17:00', maxParticipants: 10 },
      { day: 'jeudi', startTime: '09:00', endTime: '10:00', maxParticipants: 10 },
      { day: 'jeudi', startTime: '14:00', endTime: '15:00', maxParticipants: 10 },
      { day: 'jeudi', startTime: '16:00', endTime: '17:00', maxParticipants: 10 },
      { day: 'vendredi', startTime: '09:00', endTime: '10:00', maxParticipants: 10 },
      { day: 'vendredi', startTime: '14:00', endTime: '15:00', maxParticipants: 10 },
      { day: 'vendredi', startTime: '16:00', endTime: '17:00', maxParticipants: 10 },
      { day: 'samedi', startTime: '09:00', endTime: '10:00', maxParticipants: 10 },
      { day: 'samedi', startTime: '14:00', endTime: '15:00', maxParticipants: 10 },
      { day: 'samedi', startTime: '16:00', endTime: '17:00', maxParticipants: 10 },
      { day: 'dimanche', startTime: '09:00', endTime: '10:00', maxParticipants: 10 },
      { day: 'dimanche', startTime: '14:00', endTime: '15:00', maxParticipants: 10 },
      { day: 'dimanche', startTime: '16:00', endTime: '17:00', maxParticipants: 10 }
    ];

    console.log('=== DEBUG RESERVATION ===');
    console.log('Données reçues:', { activityId, schedule });
    console.log('Activité trouvée:', { 
      id: activity._id, 
      name: activity.name, 
      schedule: activity.schedule,
      coach: activity.coach,
      price: activity.price,
      location: activity.location
    });
    console.log('Créneaux par défaut:', defaultSlots);

    let validSchedule = activity.schedule.find(s => 
      s.day === schedule.day && 
      s.startTime === schedule.startTime && 
      s.endTime === schedule.endTime
    );

    console.log('Créneau trouvé dans activité:', validSchedule);

    if (!validSchedule) {
      validSchedule = defaultSlots.find(s => 
        s.day === schedule.day && 
        s.startTime === schedule.startTime && 
        s.endTime === schedule.endTime
      );
      console.log('Créneau trouvé dans créneaux par défaut:', validSchedule);
    }
    
    if (!validSchedule) {
      console.log('Aucun créneau valide trouvé');
      console.log('=== FIN DEBUG ===');
      return res.status(400).json({ 
        success: false,
        statusCode: 400,
        message: 'Ce créneau n\'est pas disponible pour cette activité. Veuillez choisir un créneau valide.',
        details: {
          availableSlots: [
            ...(activity.schedule || []),
            ...defaultSlots
          ].map(s => ({
            day: s.day,
            startTime: s.startTime,
            endTime: s.endTime,
            maxParticipants: s.maxParticipants
          }))
        }
      });
    }

    console.log('Créneau validé:', validSchedule);
    console.log('=== FIN DEBUG ===');
    
    const existingReservation = await Reservation.findOne({
      user: req.user._id,
      activity: activityId,
      'schedule.date': schedule.date,
      status: { $in: ['pending', 'confirmed', 'completed'] }
    });
    
    if (existingReservation) {
      return res.status(400).json({ 
        success: false,
        statusCode: 400,
        message: 'Vous avez déjà réservé cette activité pour ce jour. Veuillez choisir un autre jour.' 
      });
    }
    
    const reservationsCount = await Reservation.countDocuments({
      activity: activityId,
      'schedule.date': schedule.date,
      'schedule.startTime': schedule.startTime,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (reservationsCount >= validSchedule.maxParticipants) {
      return res.status(400).json({ 
        success: false,
        statusCode: 400,
        message: 'Ce créneau est complet pour cette date' 
      });
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
      status: 'pending', 
    });
    
    const user = await User.findById(req.user._id);
    user.loyaltyPoints += 10;
    await user.save();
    
    await Notification.create({
      user: req.user._id,
      title: 'Réservation en attente',
      message: `Votre réservation pour "${activity.name}" a été créée et est en attente de validation par le coach.`,
      type: 'reservation',
      relatedEntity: {
        type: 'reservation',
        id: reservation._id,
      },
    });

    if (activity.coach) {
      await Notification.create({
        user: activity.coach._id,
        title: 'Nouvelle réservation en attente',
        message: `Nouvelle réservation pour "${activity.name}" - ${req.user.firstName} ${req.user.lastName} - ${schedule.date} ${schedule.startTime}-${schedule.endTime}`,
        type: 'new_reservation',
        relatedEntity: {
          type: 'reservation',
          id: reservation._id,
        },
        priority: 'high'
      });
    }

    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: 'Nouvelle réservation en attente',
        message: `Nouvelle réservation pour "${activity.name}" - ${req.user.firstName} ${req.user.lastName} - ${schedule.date} ${schedule.startTime}-${schedule.endTime}`,
        type: 'new_reservation',
        relatedEntity: {
          type: 'reservation',
          id: reservation._id,
        },
        priority: 'high'
      });
    }

    // SMS supprimés: plus d'envoi de SMS de réservation
    
    try {
      await sendReservationConfirmation(
        user.email,
        `${user.firstName} ${user.lastName}`,
        activity.name,
        schedule.date,
        schedule.startTime,
        'pending' 
      );
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de réservation en attente:', emailError);
    }
    
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('activity', 'name category price location coach schedule')
      .populate('activity.coach', 'firstName lastName');
    
    res.status(201).json(populatedReservation);
  } catch (err) {
    console.error('Erreur lors de la création de la réservation:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        statusCode: 400,
        message: 'Données de réservation invalides',
        details: err.message 
      });
    }
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        statusCode: 400,
        message: 'ID d\'activité invalide',
        details: err.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      statusCode: 500,
      message: 'Erreur interne du serveur lors de la création de la réservation',
      details: err.message 
    });
  }
};

const getUserReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('activity', 'name category price location coach schedule')
      .populate('activity.coach', 'firstName lastName')
      .sort({ 'schedule.date': 1, 'schedule.startTime': 1 });
      
    res.json(reservations);
  } catch (err) {
    console.error('Erreur lors de la récupération des réservations utilisateur:', err);
    res.status(500).json({ 
      success: false,
      statusCode: 500,
      message: 'Erreur lors de la récupération des réservations',
      details: err.message 
    });
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
    console.error('Erreur lors de la récupération des réservations:', err);
    res.status(500).json({ 
      success: false,
      statusCode: 500,
      message: 'Erreur lors de la récupération des réservations',
      details: err.message 
    });
  }
};

const updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('activity', 'name coach');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (status === 'completed') {
      if (req.user.role !== 'admin') {
        const activity = await Activity.findById(reservation.activity._id || reservation.activity);
        if (!activity || activity.coach.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to complete this reservation' });
        }
      }

      if (!['confirmed', 'pending'].includes(reservation.status)) {
        return res.status(400).json({ message: 'Only pending or confirmed reservations can be completed' });
      }

      reservation.status = 'completed';
      await reservation.save();

      await Notification.create({
        user: reservation.user._id,
        title: 'Session terminée',
        message: `Votre session "${reservation.activity.name}" est terminée. N\'oubliez pas de laisser votre avis !`,
        type: 'review',
        relatedEntity: { type: 'reservation', id: reservation._id },
      });

      return res.json(reservation);
    }
    if (reservation.status !== 'pending') {
      return res.status(400).json({ message: 'Reservation status cannot be changed' });
    }

    if (req.user.role !== 'admin') {
      const activity = await Activity.findById(reservation.activity._id || reservation.activity);
      if (!activity || activity.coach.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update status for this reservation' });
      }
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
    console.error('Erreur lors de la mise à jour du statut de réservation:', err);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Erreur lors de la mise à jour du statut de réservation',
      details: err.message
    });
  }
};

const completeReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('activity', 'name coach');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (req.user.role !== 'admin') {
      const activity = await Activity.findById(reservation.activity._id || reservation.activity);
      if (!activity || activity.coach.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to complete this reservation' });
      }
    }

    if (reservation.status !== 'confirmed') {
      return res.status(400).json({ message: 'Only confirmed reservations can be completed' });
    }

    reservation.status = 'completed';
    await reservation.save();
    await Notification.create({
      user: reservation.user._id,
      title: 'Session terminée',
      message: `Votre session "${reservation.activity.name}" est terminée. N'oubliez pas de laisser votre avis !`,
      type: 'review',
      relatedEntity: { type: 'reservation', id: reservation._id },
    });

    res.json(reservation);
  } catch (err) {
    console.error('Erreur lors de la complétion de la réservation:', err);
    res.status(500).json({ 
      success: false,
      statusCode: 500,
      message: 'Erreur lors de la complétion de la réservation',
      details: err.message 
    });
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
    console.error('Erreur lors de l\'annulation de la réservation:', err);
    res.status(500).json({ 
      success: false,
      statusCode: 500,
      message: 'Erreur lors de l\'annulation de la réservation',
      details: err.message 
    });
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
    console.error('Erreur lors de la récupération des réservations par utilisateur:', err);
    res.status(500).json({ 
      success: false,
      statusCode: 500,
      message: 'Erreur lors de la récupération des réservations',
      details: err.message 
    });
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
    console.error('Erreur lors de la mise à jour de la réservation:', err);
    res.status(500).json({ 
      success: false,
      statusCode: 500,
      message: 'Erreur lors de la mise à jour de la réservation',
      details: err.message 
    });
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
    res.json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    console.error('Erreur lors de la suppression de la réservation:', err);
    res.status(500).json({ 
      success: false,
      statusCode: 500,
      message: 'Erreur lors de la suppression de la réservation',
      details: err.message 
    });
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
    console.error('Erreur lors de la récupération des réservations par activité:', err);
    res.status(500).json({ 
      success: false,
      statusCode: 500,
      message: 'Erreur lors de la récupération des réservations',
      details: err.message 
    });
  }
};

module.exports = {
  testBackend,
  createReservation,
  getUserReservations,
  getReservations,
  updateReservationStatus,
  completeReservation,
  cancelReservation,
  getReservationsByUserId,
  updateReservation,
  deleteReservation,
  getReservationsByActivityId,
};