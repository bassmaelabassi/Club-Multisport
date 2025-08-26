import { useState, useCallback } from 'react';
import { API_URLS } from '../services/api';

export const useReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = useCallback(async (reservationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }
      const reservationWithStatus = {
        ...reservationData,
        status: reservationData.status || "pending"
      };

      const response = await fetch(API_URLS.RESERVATIONS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reservationWithStatus),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Réservation en attente créée:', data);
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      const errorMessage = error.message || 'Erreur lors de la création de la réservation';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(API_URLS.RESERVATIONS, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setReservations(data);
      return data;
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
      const errorMessage = error.message || 'Erreur lors du chargement des réservations';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadReservationById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${API_URLS.RESERVATIONS}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Réservation chargée:', data);
      return data;
    } catch (error) {
      console.error('Erreur lors du chargement de la réservation:', error);
      const errorMessage = error.message || 'Erreur lors du chargement de la réservation';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReservation = useCallback(async (reservationId, reservationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${API_URLS.RESERVATIONS}/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Réservation mise à jour:', data);
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation:', error);
      const errorMessage = error.message || 'Erreur lors de la mise à jour de la réservation';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReservation = useCallback(async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${API_URLS.RESERVATIONS}/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      // Mettre à jour l'état local
      setReservations(prev => prev.filter(reservation => reservation._id !== reservationId));

      console.log('Réservation supprimée:', reservationId);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      throw error;
    }
  }, []);

  const loadUserReservations = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }
      const endpoint = userId ? `${API_URLS.RESERVATIONS}/${userId}` : `${API_URLS.RESERVATIONS}/user`;
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setReservations(data);
      return data;
    } catch (error) {
      console.error('Erreur lors du chargement des réservations utilisateur:', error);
      const errorMessage = error.message || 'Erreur lors du chargement des réservations utilisateur';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearReservations = useCallback(() => {
    setReservations([]);
  }, []);
  const checkForConflicts = useCallback(async (activityId, schedule, userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }
      const endpoint = userId ? `${API_URLS.RESERVATIONS}/${userId}` : `${API_URLS.RESERVATIONS}/user`;
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const existingReservations = await response.json();
      const conflicts = existingReservations.filter(reservation => {
        if (!reservation.schedule || !reservation.activity) return false;
 
        if (reservation.activity._id === activityId) return true;
 
        const reservationDate = new Date(reservation.schedule.date);
        const newDate = new Date(schedule.date);
        
        const sameDay = reservationDate.toDateString() === newDate.toDateString();
        const timeOverlap = checkTimeOverlap(
          reservation.schedule.startTime,
          reservation.schedule.endTime,
          schedule.startTime,
          schedule.endTime
        );
        
        return sameDay && timeOverlap;
      });

      return {
        hasConflict: conflicts.length > 0,
        conflicts: conflicts
      };
    } catch (error) {
      console.error('Erreur lors de la vérification des conflits:', error);
      return { hasConflict: false, conflicts: [] };
    }
  }, []);
  const checkTimeOverlap = (start1, end1, start2, end2) => {
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);

    return (s1 < e2 && s2 < e1);
  };

  return {
    reservations,
    loading,
    error,
    createReservation,
    loadReservations,
    loadReservationById,
    updateReservation,
    deleteReservation,
    loadUserReservations,
    checkForConflicts,
    clearError,
    clearReservations
  };
};
