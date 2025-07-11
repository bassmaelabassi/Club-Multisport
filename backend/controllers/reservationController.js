const getUserReservation = async (req, res, next) => {
    try {
      const reservations = await Reservation.find({ user: req.user._id })
       .populate('activity', 'name category')
       .sort({ 'schedule.date': 1, 'schedule.starTime': 1});
    
    res.json(reservations);     
    } catch (err) {
        next(err);
    }
};