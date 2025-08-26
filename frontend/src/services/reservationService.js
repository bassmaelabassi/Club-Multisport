import api from './api';

export const create = async (reservationData) => {
  console.log('Création de réservation avec données:', reservationData);
  console.log('URL API:', api.defaults.baseURL);
  
  try {
    if (!reservationData.activityId) {
      throw new Error('ID de l\'activité manquant');
    }
    
    if (!reservationData.schedule || !reservationData.schedule.date) {
      throw new Error('Informations de planning manquantes');
    }
    
    if (!(reservationData.schedule.date instanceof Date)) {
      throw new Error('Format de date invalide');
    }
    
    const response = await api.post('/reservations', reservationData);
    console.log('Réponse création réservation:', response.data);
    
    try {
      const notificationData = {
        _id: response.data._id,
        activityId: reservationData.activityId,
        userId: response.data.user || 'current_user',
        activityName: reservationData.activityName || 'Activité'
      };
      
      const { notificationService } = await import('./notificationService');
      await notificationService.createReservationNotification(notificationData);
      console.log('Notification de réservation créée avec succès');
    } catch (notificationError) {
      console.warn('Erreur lors de la création de la notification:', notificationError);
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de réservation:', error);
    
    if (error.response?.data) {
      console.error('Réponse du serveur:', error.response.data);
      console.error('Status:', error.response.status);
    }
    
    if (error.response?.status === 400) {
      console.error('Erreur 400 - Données invalides:', error.response.data);
    }
    
    throw error;
  }
};

export const getUserReservations = async () => {
  const response = await api.get('/reservations/user');
  return response.data;
};

export const getAll = async () => {
  const response = await api.get('/reservations');
  return response.data;
};

export const getByActivity = async (activityId) => {
  const response = await api.get(`/reservations/activity/${activityId}`);
  return response.data;
};

export const updateStatus = async (id, status) => {
  const response = await api.put(`/reservations/${id}/status`, { status });
  return response.data;
};

export const complete = async (id) => {
  const response = await api.put(`/reservations/${id}/status`, { status: 'completed' });
  return response.data;
};

export const cancel = async (id) => {
  const response = await api.put(`/reservations/${id}/cancel`);
  return response.data;
};

export const cancelReservation = async (id) => {
  return cancel(id);
};

export const deleteReservation = async (id) => {
  const response = await api.delete(`/reservations/${id}`);
  return response.data;
};

// Export par défaut pour la compatibilité
const reservationService = {
  create,
  getUserReservations,
  getAll,
  getByActivity,
  updateStatus,
  complete,
  cancel,
  cancelReservation,
  delete: deleteReservation
};

export { reservationService };
