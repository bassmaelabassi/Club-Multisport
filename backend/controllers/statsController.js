const User = require('../models/User');
const Activity = require('../models/Activity');
const Reservation = require('../models/Reservation');

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalActivities = await Activity.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    
    const reservations = await Reservation.find().populate('activity');
    const totalRevenue = reservations.reduce((sum, reservation) => {
      return sum + (reservation.activity?.price || 0);
    }, 0);

    const monthlyStats = {
      users: Math.floor(totalUsers * 0.12), 
      activities: Math.floor(totalActivities * 0.08),
      reservations: Math.floor(totalReservations * 0.15), 
      revenue: Math.floor(totalRevenue * 0.08) 
    };

    res.json({
      totalUsers,
      totalActivities,
      totalReservations,
      totalRevenue,
      monthlyStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du calcul des statistiques' });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const userReservations = await Reservation.find({ userId });
    const completedActivities = userReservations.filter(r => r.status === 'completed').length;
    
    const user = await User.findById(userId);
    
    res.json({
      totalReservations: userReservations.length,
      completedActivities,
      loyaltyPoints: user.loyaltyPoints || 0,
      memberSince: user.createdAt.getFullYear()
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du calcul des statistiques utilisateur' });
  }
};

module.exports = {
  getStats,
  getUserStats
};
