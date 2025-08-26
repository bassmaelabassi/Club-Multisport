import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useReservations } from "../hooks/useReservations";
import { Clock, Users, CheckCircle, XCircle, Calendar, Star, MapPin, Award, Activity, User, Timer, Target, Heart, Sparkles, Waves } from "lucide-react";
import { API_URLS } from "../services/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ReservationNew = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const activityId = query.get("activityId");
  const activityName = query.get("activityName");
  
  const { createReservation, checkForConflicts, error: reservationError, clearError } = useReservations();
  
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [existingReservations, setExistingReservations] = useState([]);
  const [showExistingReservations, setShowExistingReservations] = useState(false);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("Utilisateur non authentifié, redirection vers la connexion");
      navigate("/login", { state: { from: `/reservation/new?activityId=${activityId}` } });
      return;
    }
    
    console.log("Utilisateur authentifié:", user);
  }, [isAuthenticated, navigate, activityId, user]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    console.log('useEffect - Chargement activité:', { activityId, isAuthenticated });
    
    if (activityId) {
      console.log('Démarrage du chargement de l\'activité:', activityId);
      loadActivityFromId(activityId);
    } else {
      console.log('Aucun ID d\'activité fourni, arrêt du chargement');
      setLoading(false);
    }
  }, [isAuthenticated, activityId]);

  const loadActivityFromId = async (id) => {
    if (!id) {
      setLoadError("ID d'activité manquant");
      setLoading(false);
      return;
    }

    setLoadError(null);
    setLoading(true);
    
    const timeoutId = setTimeout(() => {
      setLoadError("Délai d'attente dépassé. Veuillez réessayer.");
      setLoading(false);
    }, 10000); 
    
    try {
      const response = await fetch(`${API_URLS.ACTIVITIES}/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setLoadError("Activité non trouvée");
        } else {
          setLoadError(`Erreur serveur: ${response.status}`);
        }
        return;
      }
      
      const activityData = await response.json();
      
      if (!activityData._id) {
        setLoadError("Données d'activité invalides");
        return;
      }
      
      setActivity(activityData);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayName = tomorrow.toLocaleDateString('fr-FR', { weekday: 'long' });
      
      if (activityData.schedule && activityData.schedule.length > 0) {
        const firstSlot = activityData.schedule[0];
        setSelectedSlot({
          ...firstSlot,
          day: dayName,
          startTime: firstSlot.startTime || "12:00",
          endTime: firstSlot.endTime || "19:00",
          maxParticipants: firstSlot.maxParticipants || 10
        });
      } else {
        setSelectedSlot({
          day: dayName,
          startTime: "12:00",
          endTime: "19:00",
          maxParticipants: 10
        });
      }
            setDate(tomorrow.toISOString().split("T")[0]);
      
    } catch (error) {
      console.error('Erreur lors du chargement de l\'activité:', error);
      setLoadError("Erreur lors du chargement de l'activité");
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleActivitySelect = (selectedActivity) => {
    console.log('Activité sélectionnée:', selectedActivity);
    setActivity(selectedActivity);
    
    if (selectedActivity.schedule && selectedActivity.schedule.length > 0) {
      setSelectedSlot(selectedActivity.schedule[0]);
    } else {
      setSelectedSlot({
        day: "mercredi",
        startTime: "08:00",
        endTime: "10:00",
        maxParticipants: 10
      });
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
        if (newDate) {
      const selectedDate = new Date(newDate);
      const dayName = selectedDate.toLocaleDateString('fr-FR', { weekday: 'long' });
            if (selectedSlot) {
        setSelectedSlot({
          ...selectedSlot,
          day: dayName,
          startTime: selectedSlot.startTime || "12:00",
          endTime: selectedSlot.endTime || "19:00",
          maxParticipants: selectedSlot.maxParticipants || 10
        });
      } else {
        setSelectedSlot({
          day: dayName,
          startTime: "12:00",
          endTime: "19:00",
          maxParticipants: 10
        });
      }
    }
  };

  const loadExistingReservations = async () => {
    console.log('loadExistingReservations appelée avec:', { 
      activityId: activity?._id, 
      date, 
      selectedSlot,
      userId: user?._id 
    });
    
    try {
      if (!activity?._id || !date || !selectedSlot) {
        console.log('Données manquantes pour la vérification des conflits');
        alert("Veuillez d'abord sélectionner une activité, une date et un créneau");
        return false;
      }

      console.log('Appel de checkForConflicts...');
      const conflicts = await checkForConflicts(activity._id, {
        date: date,
        startTime: selectedSlot.startTime || "12:00",
        endTime: selectedSlot.endTime || "19:00"
      }, user?._id);
      
      console.log('Résultat de checkForConflicts:', conflicts);
      
      if (conflicts.hasConflict) {
        console.log('Conflits détectés:', conflicts.conflicts);
        setExistingReservations(conflicts.conflicts);
        setShowExistingReservations(true);
        return true;
      } else {
        console.log('Aucun conflit détecté');
        alert("Aucun conflit détecté ! Vous pouvez procéder à la réservation.");
        return false; 
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des conflits:', error);
      alert(`Erreur lors de la vérification des conflits: ${error.message}`);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!activity || !activity._id) {
      alert("Veuillez sélectionner une activité valide");
      return;
    }

    if (!date) {
      alert("Veuillez sélectionner une date");
      return;
    }

    if (!selectedSlot) {
      alert("Veuillez sélectionner un créneau");
      return;
    }

    const selectedDate = new Date(date);
    const expectedDay = selectedDate.toLocaleDateString('fr-FR', { weekday: 'long' });
    
    if (selectedSlot.day !== expectedDay) {
      alert(`Incohérence détectée : la date sélectionnée correspond au ${expectedDay} mais le créneau indique ${selectedSlot.day}. Veuillez sélectionner une date valide.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const hasConflicts = await loadExistingReservations();
      
      if (hasConflicts) {
        alert("Vous avez déjà une réservation pour ce créneau à cette date. Veuillez choisir un autre créneau ou une autre date.");
        setIsSubmitting(false);
        return;
      }
      const dayOfWeek = selectedDate.toLocaleDateString('fr-FR', { weekday: 'long' });
      
      const reservationData = {
        activityId: activity._id,
        schedule: {
          day: dayOfWeek,
          date: selectedDate.toISOString(),
          startTime: selectedSlot.startTime || "12:00",
          endTime: selectedSlot.endTime || "19:00"
        },
        status: "pending"
      };

      console.log('Création de la réservation:', reservationData);
      
      if (!reservationData.activityId) {
        throw new Error("ID d'activité invalide");
      }

      await createReservation(reservationData);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate("/reservations?success=1");
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      alert(`Erreur lors de la réservation: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#003c3c] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-[#22b455] mx-auto mb-4"></div>
          <p className="text-lg text-white font-medium">Chargement de l'activité...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#003c3c] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-6">⚠️</div>
          <h3 className="text-2xl font-bold text-white mb-4">Erreur de chargement</h3>
          <p className="text-white/80 mb-6">{loadError}</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setLoadError(null);
                if (activityId) {
                  loadActivityFromId(activityId);
                }
              }}
              className="bg-[#22b455] text-white px-8 py-3 rounded-2xl font-semibold hover:bg-[#a0f000] transition-all duration-300"
            >
              Réessayer
            </button>
            <button
              onClick={() => navigate("/activities")}
              className="bg-black text-white px-8 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 ml-3"
            >
              Retour aux activités
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003c3c] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#22b455] to-[#92e5a1] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#92e5a1] to-[#22b455] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-br from-[#22b455] to-[#003c3c] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold mb-4">
            <span className="text-white/80">Réservez votre</span>
            <br />
            <span className="text-[#92e5a1]">Activité Préférée</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Choisissez une activité et réservez votre créneau en quelques clics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#92e5a1]/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#22b455]">
            <div className="mb-8">
              <div className="bg-white/20 rounded-2xl p-4 text-center border border-[#22b455]/30">
                <p className="text-white/70 text-sm">Sélecteur d'activité temporairement désactivé</p>
              </div>
            </div>

            {activity ? (
              <div className="bg-white/20 rounded-2xl p-6 border border-[#22b455]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <Waves className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{activity.name || "Activité"}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#22b455]" />
                    <span className="text-white text-sm">
                      {activity.coach?.firstName && activity.coach?.lastName 
                        ? `${activity.coach.firstName} ${activity.coach.lastName}`
                        : "Coach assigné"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#22b455]" />
                    <span className="text-white text-sm">{activity.location || "RABAT"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#22b455]" />
                    <span className="text-white text-sm">{activity.duration || 44} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#22b455]" />
                    <span className="text-white text-sm">{activity.price || 300} DH</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Description</h4>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-white text-sm">
                      {activity.description || "natation test test"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/20 rounded-2xl p-6 border border-[#22b455]/30 text-center">
                <p className="text-white/70">Aucune activité sélectionnée</p>
              </div>
            )}
          </div>

          <div className="bg-[#92e5a1]/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#22b455]">
            <h2 className="text-3xl font-bold text-white mb-6">
              Réservez Maintenant
              <div className="w-16 h-1 bg-[#22b455] mt-2"></div>
            </h2>

            {activity ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Choisissez votre date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-[#22b455] rounded-2xl text-white placeholder:text-white/60 focus:ring-2 focus:ring-[#22b455] focus:border-[#22b455] transition-all duration-300"
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Choisissez votre créneau
                  </label>
                  <p className="text-white/70 text-sm mb-4">
                    Créneaux disponibles pour le {date ? new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'jour sélectionné'}
                  </p>
                  
                  {selectedSlot && (
                    <div className="space-y-3">
                      <button
                        type="button"
                        className="w-full bg-[#22b455] text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:bg-[#a0f000] transition-all duration-300 transform hover:scale-105"
                      >
                        {selectedSlot.startTime} - {selectedSlot.endTime}
                      </button>
                      <div className="text-center space-y-1">
                        <p className="text-white/80 text-sm">
                          Jour: {selectedSlot.day}
                        </p>
                        {date && (
                          <p className="text-white/60 text-xs">
                            Date: {new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        )}
                        {selectedSlot.maxParticipants && (
                          <p className="text-white/60 text-xs">
                            Max: {selectedSlot.maxParticipants} participants
                          </p>
                        )}
                        {date && selectedSlot.day && (
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            selectedSlot.day === new Date(date).toLocaleDateString('fr-FR', { weekday: 'long' })
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {selectedSlot.day === new Date(date).toLocaleDateString('fr-FR', { weekday: 'long' })
                              ? '✓ Date et jour cohérents'
                              : '⚠ Date et jour incohérents'
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedSlot}
                    className="w-full bg-black text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Réservation en cours..." : "Confirmer la réservation"}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Bouton cliqué !');
                      console.log('checkForConflicts disponible:', typeof checkForConflicts);
                      loadExistingReservations();
                    }}
                    disabled={!selectedSlot || !date}
                    className="w-full bg-[#22b455]/20 text-[#22b455] py-3 px-6 rounded-2xl font-medium border border-[#22b455] hover:bg-[#22b455]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Vérifier les conflits
                  </button>
                  
                  <div className="text-center text-xs text-white/60 space-y-1">
                    <p>État des données :</p>
                    <p>Activité: {activity?._id ? '✅' : '❌'}</p>
                    <p>Date: {date ? '✅' : '❌'}</p>
                    <p>Créneau: {selectedSlot ? '✅' : '❌'}</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      alert('Bouton de test fonctionne !');
                      console.log('Test réussi');
                    }}
                    className="w-full bg-blue-500/20 text-blue-500 py-2 px-6 rounded-xl font-medium border border-blue-500 hover:bg-blue-500/30 transition-all duration-300"
                  >
                    Test Bouton
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/70">Veuillez d'abord sélectionner une activité</p>
              </div>
            )}

            {showSuccess && (
              <div className="mt-6 bg-[#22b455]/20 border border-[#22b455] rounded-2xl p-4 text-center">
                <CheckCircle className="w-8 h-8 text-[#22b455] mx-auto mb-2" />
                <p className="text-white font-semibold">Réservation créée avec succès !</p>
                <p className="text-white/70 text-sm">Redirection en cours...</p>
              </div>
            )}

            {reservationError && (
              <div className="mt-6 bg-red-500/20 border border-red-500 rounded-2xl p-4 text-center">
                <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-white font-semibold">Erreur lors de la réservation</p>
                <p className="text-white/70 text-sm">{reservationError}</p>
              </div>
            )}

            {showExistingReservations && existingReservations.length > 0 && (
              <div className="mt-6 bg-yellow-500/20 border border-yellow-500 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-yellow-300 font-semibold">Réservations existantes</h4>
                  <button
                    onClick={() => setShowExistingReservations(false)}
                    className="text-yellow-300 hover:text-yellow-100"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-yellow-200 text-sm mb-3">
                  Vous avez déjà des réservations qui pourraient entrer en conflit :
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {existingReservations.map((reservation, index) => (
                    <div key={index} className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-yellow-200 font-medium text-sm">
                            {reservation.activity?.name || 'Activité'}
                          </p>
                          <p className="text-yellow-300 text-xs">
                            {new Date(reservation.schedule?.date).toLocaleDateString('fr-FR')} - {reservation.schedule?.startTime} à {reservation.schedule?.endTime}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          reservation.status === 'pending' ? 'bg-yellow-500/30 text-yellow-200' :
                          reservation.status === 'confirmed' ? 'bg-green-500/30 text-green-200' :
                          'bg-gray-500/30 text-gray-200'
                        }`}>
                          {reservation.status === 'pending' ? 'En attente' :
                           reservation.status === 'confirmed' ? 'Confirmée' :
                           reservation.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => navigate("/reservations")}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors"
                  >
                    Voir mes réservations
                  </button>
                  <button
                    onClick={() => setShowExistingReservations(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default ReservationNew; 