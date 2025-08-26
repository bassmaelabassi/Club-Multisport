import api from './api';

export const getUserNotifications = async () => {
  try {
    const response = await api.get('/notifications/user');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    throw error;
  }
};

export const getAdminNotifications = async () => {
  try {
    const response = await api.get('/notifications/admin');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications admin:', error);
    throw error;
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error);
    throw error;
  }
};

export const createReservationNotification = async (reservationData) => {
  try {
    const response = await api.post('/notifications/reservation', {
      type: 'new_reservation',
      reservationId: reservationData._id,
      activityId: reservationData.activityId,
      userId: reservationData.userId,
      message: `Nouvelle réservation pour ${reservationData.activityName}`,
      priority: 'high'
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    throw error;
  }
};

// Export par défaut pour la compatibilité
const notificationService = {
  getUserNotifications,
  getAdminNotifications,
  markAsRead,
  createReservationNotification,
  deleteNotification
};

export { notificationService };
