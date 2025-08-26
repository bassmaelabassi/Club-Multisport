import React, { useState, useEffect } from "react";
import { reservationService } from "../services/reservationService";
import activityService from "../services/activityService";
import { useAuth } from "../context/AuthContext";

const CoachReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("all");

  useEffect(() => {
    loadData();
  }, [user?._id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const coachActivities = await activityService.getByCoach(user?._id);
      setActivities(coachActivities);
      if (coachActivities.length > 0) {
        const res = await reservationService.getByActivity(coachActivities[0]._id);
        setReservations(res);
        setSelectedActivity(coachActivities[0]._id);
      } else {
        setReservations([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
        setLoading(false);
    }
  };

  const reloadReservations = async (activityId) => {
    try {
      setLoading(true);
      const res = await reservationService.getByActivity(activityId);
      setReservations(res);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdating(id);
      const mappedStatus = newStatus === 'accepted' ? 'confirmed' : (newStatus === 'rejected' ? 'cancelled' : newStatus);
      await reservationService.updateStatus(id, mappedStatus);
      await reloadReservations(selectedActivity);
      alert(`Réservation ${newStatus === 'accepted' ? 'acceptée' : newStatus === 'rejected' ? 'refusée' : 'annulée'} avec succès !`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdating(null);
    }
  };

  const handleCancelReservation = async (id) => {
      try {
        setUpdating(id);
      await reservationService.updateStatus(id, 'cancelled');
      await reloadReservations(selectedActivity);
      alert('Réservation annulée avec succès !');
      } catch (error) {
        console.error("Erreur lors de l'annulation:", error);
        alert("Erreur lors de l'annulation de la réservation");
      } finally {
        setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        text: "En attente", 
        class: "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200 shadow-sm",
        icon: "⏳"
      },
      accepted: { 
        text: "Acceptée", 
        class: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200 shadow-sm",
        icon: "✅"
      },
      rejected: { 
        text: "Refusée", 
        class: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200 shadow-sm",
        icon: "❌"
      },
      cancelled: { 
        text: "Annulée", 
        class: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200 shadow-sm",
        icon: "🚫"
      },
      confirmed: {
        text: "Acceptée",
        class: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200 shadow-sm",
        icon: "✅"
      },
      completed: {
        text: "Terminée",
        class: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 shadow-sm",
        icon: "🎉"
      },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 hover:scale-105 ${config.class}`}>
        <span className="text-xs">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === "all") return true;
    const target = filter === 'accepted' ? 'confirmed' : (filter === 'rejected' ? 'cancelled' : filter);
    return reservation.status === target;
  });

  const getStats = () => {
    return {
      total: reservations.length,
      pending: reservations.filter(r => r.status === "pending").length,
      accepted: reservations.filter(r => r.status === "confirmed").length,
      rejected: reservations.filter(r => r.status === "cancelled").length,
      cancelled: reservations.filter(r => r.status === "cancelled").length,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003c3c] via-[#143c3c] to-[#003c3c] flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-purple-200"></div>
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-t-purple-600 absolute top-0 left-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-purple-600 font-semibold animate-pulse">Chargement...</div>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003c3c] via-[#143c3c] to-[#003c3c]">
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Gestion des Réservations
            </h1>
            <p className="text-gray-600 text-lg">Tableau de bord coach</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="p-6 text-center relative z-10">
                <div className="text-3xl font-bold text-blue-600 mb-1 transition-transform duration-300 group-hover:scale-110">{stats.total}</div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total</div>
                <div className="absolute top-2 right-2 text-blue-500 opacity-20 text-2xl">📊</div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="p-6 text-center relative z-10">
                <div className="text-3xl font-bold text-amber-600 mb-1 transition-transform duration-300 group-hover:scale-110">{stats.pending}</div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">En attente</div>
                <div className="absolute top-2 right-2 text-amber-500 opacity-20 text-2xl">⏳</div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="p-6 text-center relative z-10">
                <div className="text-3xl font-bold text-emerald-600 mb-1 transition-transform duration-300 group-hover:scale-110">{stats.accepted}</div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Acceptées</div>
                <div className="absolute top-2 right-2 text-emerald-500 opacity-20 text-2xl">✅</div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-rose-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="p-6 text-center relative z-10">
                <div className="text-3xl font-bold text-red-600 mb-1 transition-transform duration-300 group-hover:scale-110">{stats.rejected}</div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Refusées</div>
                <div className="absolute top-2 right-2 text-red-500 opacity-20 text-2xl">❌</div>
              </div>
          </div>
        </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
            <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter("all")}
                className={`group relative overflow-hidden px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                filter === "all" 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              }`}
            >
                <span className="relative z-10">Toutes ({stats.total})</span>
                {filter === "all" && (
                  <div className="absolute inset-0 bg-white opacity-20 rounded-xl animate-pulse"></div>
                )}
            </button>
              
            <button
              onClick={() => setFilter("pending")}
                className={`group relative overflow-hidden px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                filter === "pending" 
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              }`}
            >
                <span className="relative z-10">⏳ En attente ({stats.pending})</span>
                {filter === "pending" && (
                  <div className="absolute inset-0 bg-white opacity-20 rounded-xl animate-pulse"></div>
                )}
            </button>
              
            <button
              onClick={() => setFilter("accepted")}
                className={`group relative overflow-hidden px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                filter === "accepted" 
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              }`}
            >
                <span className="relative z-10">✅ Acceptées ({stats.accepted})</span>
                {filter === "accepted" && (
                  <div className="absolute inset-0 bg-white opacity-20 rounded-xl animate-pulse"></div>
                )}
            </button>
              
            <button
              onClick={() => setFilter("rejected")}
                className={`group relative overflow-hidden px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                filter === "rejected" 
                    ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              }`}
            >
                <span className="relative z-10">❌ Refusées ({stats.rejected})</span>
                {filter === "rejected" && (
                  <div className="absolute inset-0 bg-white opacity-20 rounded-xl animate-pulse"></div>
                )}
            </button>
          </div>
        </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-2xl">📋</span>
                Liste des Réservations
              </h2>
              <p className="text-purple-100 mt-2">Gérez les réservations pour vos activités en temps réel.</p>
          </div>
          
          <div className="overflow-x-auto">
            {filteredReservations.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4 animate-bounce">📝</div>
                  <p className="text-gray-500 text-lg">Aucune réservation à afficher.</p>
                  <p className="text-gray-400 text-sm mt-2">Les nouvelles réservations apparaîtront ici</p>
              </div>
            ) : (
              <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                        👤 Utilisateur
                    </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                        🎯 Activité
                    </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                        📅 Date & Heure
                    </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                        📊 Statut
                    </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                        ⚡ Actions
                    </th>
                  </tr>
                </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredReservations.map((reservation, index) => (
                      <tr 
                        key={reservation._id || reservation.id || index}
                        className="group hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
                        style={{
                          animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
                        }}
                      >
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm transition-transform duration-300 group-hover:scale-110">
                              {reservation.userName?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                        <div>
                              <div className="text-sm font-medium text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                                {reservation.userName}
                              </div>
                          <div className="text-sm text-gray-500">{reservation.userEmail}</div>
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                            {reservation.activity?.name || 'Activité'}
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                            <span className="text-purple-500">📅</span>
                            {reservation.schedule?.date ? new Date(reservation.schedule.date).toLocaleDateString('fr-FR') : '—'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <span className="text-blue-500">🕐</span>
                            {reservation.schedule?.startTime && reservation.schedule?.endTime ? `${reservation.schedule.startTime} - ${reservation.schedule.endTime}` : '—'}
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(reservation.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {reservation.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(reservation._id || reservation.id, "accepted")}
                                disabled={updating === (reservation._id || reservation.id)}
                                  className="group relative overflow-hidden inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                              >
                                {updating === (reservation._id || reservation.id) ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-2"></div>
                                ) : (
                                    <svg className="h-3 w-3 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                                Accepter
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(reservation._id || reservation.id, "rejected")}
                                disabled={updating === (reservation._id || reservation.id)}
                                  className="group relative overflow-hidden inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-xl text-white bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                              >
                                {updating === (reservation._id || reservation.id) ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-2"></div>
                                ) : (
                                    <svg className="h-3 w-3 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                )}
                                Refuser
                              </button>
                            </>
                          )}
                          {reservation.status === "accepted" && (
                            <button
                              onClick={() => handleCancelReservation(reservation._id || reservation.id)}
                              disabled={updating === (reservation._id || reservation.id)}
                                className="group relative overflow-hidden inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-xl text-white bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                              {updating === (reservation._id || reservation.id) ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-2"></div>
                              ) : (
                                  <svg className="h-3 w-3 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              )}
                              Annuler
                            </button>
                          )}
                          {reservation.status === "confirmed" && (
                            <button
                              onClick={() => reservationService.complete(reservation._id || reservation.id).then(()=>reloadReservations(selectedActivity))}
                              disabled={updating === (reservation._id || reservation.id)}
                              className="group relative overflow-hidden inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                              Marquer terminée
                            </button>
                          )}
                          {(reservation.status === "rejected" || reservation.status === "cancelled") && (
                              <span className="text-gray-500 text-sm bg-gray-100 px-3 py-2 rounded-lg">
                                🔒 Statut finalisé
                              </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      </div>
      
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CoachReservations;