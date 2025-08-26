import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { reservationService } from "../services/reservationService";
import ReservationCard from "../components/ReservationCard";
import { API_URLS } from "../services/api";
import { Calendar, Info, Users, Clock, CheckCircle, PlayCircle, XCircle } from "lucide-react";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useNotification();
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isCoach } = useAuth();

  const filters = [
    { 
      value: "all", 
      label: "Toutes", 
      icon: <Users className="w-5 h-5" />,
      activeClasses: "bg-gradient-to-r from-[#22b455] to-[#a0f000] text-white shadow-lg"
    },
    { 
      value: "pending", 
      label: "En attente", 
      icon: <Clock className="w-5 h-5" />,
      activeClasses: "bg-gradient-to-r from-[#22b455] to-[#a0f000] text-white shadow-lg"
    },
    { 
      value: "confirmed", 
      label: "Acceptées", 
      icon: <CheckCircle className="w-5 h-5" />,
      activeClasses: "bg-gradient-to-r from-[#22b455] to-[#a0f000] text-white shadow-lg"
    },
    { 
      value: "cancelled", 
      label: "Refusées", 
      icon: <XCircle className="w-5 h-5" />,
      activeClasses: "bg-gradient-to-r from-[#22b455] to-[#a0f000] text-white shadow-lg"
    },
    { 
      value: "completed", 
      label: "Terminées", 
      icon: <PlayCircle className="w-5 h-5" />,
      activeClasses: "bg-gradient-to-r from-[#22b455] to-[#a0f000] text-white shadow-lg"
    }
  ];

  const checkReservation = location.search.includes('check') || location.search.includes('success');

  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    if (checkReservation) {
      console.log("Rechargement des réservations après création...");
      loadReservations();
    }
  }, [checkReservation]);

  const loadReservations = async () => {
    try {
      setError(null);
      setLoading(true);
      
      console.log("Chargement des réservations...");
      console.log("Token d'authentification:", localStorage.getItem('token') ? 'Présent' : 'Absent');
      
      const data = await reservationService.getUserReservations();
      console.log("Réservations reçues:", data);
      console.log("Nombre de réservations:", data.length);
      
      setReservations(data);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
      
      if (error.response?.status === 429) {
        setError("Trop de requêtes. Veuillez patienter un moment avant de réessayer.");
        showError("Trop de requêtes. Veuillez patienter un moment avant de réessayer.");
        
        setTimeout(() => {
          console.log("Tentative de reconnexion...");
          loadReservations();
        }, 5000);
      } else {
        setError("Erreur lors du chargement des réservations");
        showError("Erreur lors du chargement des réservations");
        
        if (reservations.length === 0) {
          setReservations([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const approveReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showError("Token d'authentification manquant");
        return;
      }

      const response = await fetch(`${API_URLS.RESERVATIONS}/${reservationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'confirmed' }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'approbation');
      }

      showSuccess("Réservation approuvée avec succès !");
      loadReservations();
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      showError("Erreur lors de l'approbation de la réservation");
    }
  };

  const rejectReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showError("Token d'authentification manquant");
        return;
      }

      const response = await fetch(`${API_URLS.RESERVATIONS}/${reservationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du refus');
      }

      showSuccess("Réservation refusée");
      loadReservations();
    } catch (error) {
      console.error('Erreur lors du refus:', error);
      showError("Erreur lors du refus de la réservation");
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      setLoading(true);
      await reservationService.cancelReservation(reservationId);
      showSuccess("Réservation annulée avec succès !");
      
      setReservations(prevReservations => 
        prevReservations.map(reservation => 
          reservation._id === reservationId 
            ? { ...reservation, status: 'cancelled' }
            : reservation
        )
      );
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      showError("Erreur lors de l'annulation de la réservation");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterValue) => {
    setActiveFilter(filterValue);
  };

  const getFilteredReservations = () => {
    if (activeFilter === "all") {
      return reservations;
    }
    return reservations.filter(reservation => reservation.status === activeFilter);
  };

  const filteredReservations = getFilteredReservations();

  if (loading && reservations.length === 0) {
    return (
      <div className="min-h-screen bg-[#003c3c] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-[#22b455] to-[#a0f000] mx-auto mb-8">
            <div className="absolute inset-2 bg-gradient-to-br from-[#22b455] via-[#a0f000] to-[#003c3c] rounded-full"></div>
          </div>
          <p className="text-white text-2xl font-bold">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003c3c]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Mes Réservations
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Gérez vos réservations d'activités et suivez leur statut
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeFilter === filter.value
                  ? filter.activeClasses
                  : "bg-[#a0f000]/20 text-white hover:bg-[#a0f000]/40 border border-[#22b455]"
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-[#a0f000]/20 backdrop-blur-xl rounded-2xl p-4 border border-[#22b455] text-center">
            <div className="text-2xl font-bold text-white">{reservations.length}</div>
            <div className="text-white/80 text-sm">Total</div>
          </div>
          <div className="bg-[#a0f000]/20 backdrop-blur-xl rounded-2xl p-4 border border-[#22b455] text-center">
            <div className="text-2xl font-bold text-white">
              {reservations.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-white/80 text-sm">En attente</div>
          </div>
          <div className="bg-[#a0f000]/20 backdrop-blur-xl rounded-2xl p-4 border border-[#22b455] text-center">
            <div className="text-2xl font-bold text-white">
              {reservations.filter(r => r.status === 'confirmed').length}
            </div>
            <div className="text-white/80 text-sm">Acceptées</div>
          </div>
          <div className="bg-[#a0f000]/20 backdrop-blur-xl rounded-2xl p-4 border border-[#22b455] text-center">
            <div className="text-2xl font-bold text-white">
              {reservations.filter(r => r.status === 'cancelled').length}
            </div>
            <div className="text-white/80 text-sm">Refusées</div>
          </div>
          <div className="bg-[#a0f000]/20 backdrop-blur-xl rounded-2xl p-4 border border-[#22b455] text-center">
            <div className="text-2xl font-bold text-white">
              {reservations.filter(r => r.status === 'completed').length}
            </div>
            <div className="text-white/80 text-sm">Terminées</div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-500/20 border-2 border-red-500/30 text-red-200 p-6 rounded-2xl text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-2">Erreur de chargement</h3>
            <p className="mb-4">{error}</p>
            <button
              onClick={loadReservations}
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="bg-[#a0f000]/20 backdrop-blur-xl rounded-2xl p-12 text-center border border-[#22b455]">
            <div className="text-white text-6xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {activeFilter === "all" ? "Aucune réservation trouvée" : `Aucune réservation ${filters.find(f => f.value === activeFilter)?.label.toLowerCase()}`}
            </h3>
            <p className="text-white/80 mb-6">
              {activeFilter === "all" 
                ? "Vous n'avez pas encore de réservations. Commencez par explorer nos activités !"
                : `Vous n'avez pas de réservations ${filters.find(f => f.value === activeFilter)?.label.toLowerCase()}.`
              }
            </p>
            <button
              onClick={() => navigate('/activities')}
              className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              Découvrir les activités
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReservations.map((reservation) => (
              <ReservationCard
                key={reservation._id || reservation.id}
                reservation={reservation}
                onCancel={handleCancelReservation}
                onApprove={approveReservation}
                onReject={rejectReservation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;