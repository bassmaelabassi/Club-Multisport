import { useState } from "react"
import { Calendar, Clock, User, DollarSign, Star, X, Check, Edit, Settings, Users, Target } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { reservationService } from "../services/reservationService"

const ReservationCard = ({ reservation, onCancel, onApprove, onReject }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showActivityDetails, setShowActivityDetails] = useState(false)
  const { user, isAdmin, isCoach } = useAuth()
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: "bg-gradient-to-br from-[#a0f000]/20 via-[#22b455]/20 to-[#003c3c]/20",
        badge: "bg-gradient-to-r from-[#22b455] to-[#a0f000]",
        text: "En attente",
        icon: "⏳",
        border: "border-[#22b455]/50",
        accent: "from-[#22b455] to-[#a0f000]",
        shadow: "shadow-[#22b455]/20",
        statusText: "Réservation en attente",
        description: "En attente de validation par le coach"
      },
      confirmed: {
        bg: "bg-gradient-to-br from-[#a0f000]/20 via-[#22b455]/20 to-[#003c3c]/20",
        badge: "bg-gradient-to-r from-[#22b455] to-[#a0f000]",
        text: "Acceptée",
        icon: "✅",
        border: "border-[#22b455]/50",
        accent: "from-[#22b455] to-[#a0f000]",
        shadow: "shadow-[#22b455]/20",
        statusText: "Réservation acceptée",
        description: "Le coach a validé votre réservation"
      },
      cancelled: {
        bg: "bg-gradient-to-br from-[#a0f000]/20 via-[#22b455]/20 to-[#003c3c]/20",
        badge: "bg-gradient-to-r from-[#22b455] to-[#a0f000]",
        text: "Refusée",
        icon: "❌",
        border: "border-[#22b455]/50",
        accent: "from-[#22b455] to-[#a0f000]",
        shadow: "shadow-[#22b455]/20",
        statusText: "Réservation refusée",
        description: "Le coach a refusé cette demande"
      },
      completed: {
        bg: "bg-gradient-to-br from-[#a0f000]/20 via-[#22b455]/20 to-[#003c3c]/20",
        badge: "bg-gradient-to-r from-[#22b455] to-[#a0f000]",
        text: "Terminée",
        icon: "🎉",
        border: "border-[#22b455]/50",
        accent: "from-[#22b455] to-[#a0f000]",
        shadow: "shadow-[#22b455]/20",
        statusText: "Session terminée",
        description: "Activité terminée avec succès"
      },
    }
    return (
      configs[status] || {
        bg: "bg-gradient-to-br from-[#a0f000]/20 via-[#22b455]/20 to-[#003c3c]/20",
        badge: "bg-gradient-to-r from-[#22b455] to-[#a0f000]",
        text: status,
        icon: "📋",
        border: "border-[#22b455]/50",
        accent: "from-[#22b455] to-[#a0f000]",
        shadow: "shadow-[#22b455]/20",
        statusText: status,
        description: "Statut non défini"
      }
    )
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Date invalide"
      }
      return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "Date invalide"
    }
  }

  const formatTime = (startTime, endTime) => {
    if (startTime && endTime) {
      return `${startTime} - ${endTime}`
    }
    return "Heure non définie"
  }

  const handleEditActivity = () => {
    console.log("Edit activity:", reservation.activity?.name)
    alert(`Édition de l'activité: ${reservation.activity?.name}`)
  }

  const handleUpdateStatus = async (reservationId, newStatus) => {
    try {
      console.log(`Mise à jour du statut de la réservation ${reservationId} vers ${newStatus}`)

      await reservationService.updateStatus(reservationId, newStatus)

      if (newStatus === "confirmed") {
        alert("Réservation acceptée avec succès !")
      } else if (newStatus === "cancelled") {
        alert("Réservation refusée avec succès !")
      }

      window.location.reload()
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
      alert("Erreur lors de la mise à jour du statut")
    }
  }

  const handleComplete = async (reservationId) => {
    try {
      await reservationService.complete(reservationId)
      window.location.reload()
    } catch (error) {
      console.error("Erreur lors de la complétion:", error)
      alert("Erreur lors de la complétion de la réservation")
    }
  }

  const handleSubmitReview = async () => {
    try {
      const response = await (await import('../services/api')).default.post('/reviews', {
        activityId: reservation.activity?._id || reservation.activity,
        rating: reviewRating,
        comment: reviewComment
      })
      if (response.status === 201) {
        alert('Merci pour votre avis !')
        setShowReviewModal(false)
        window.location.reload()
      }
    } catch (error) {
      console.error('Erreur création avis:', error)
      alert(error?.response?.data?.message || "Impossible d'enregistrer votre avis")
    }
  }

  const handleContactCoach = () => {
    const coachId = reservation.activity?.coach?._id || reservation.activity?.coach
    const activityId = reservation.activity?._id || reservation.activity
    if (activityId && coachId) {
      window.location.href = `/contact?activityId=${activityId}&coachId=${coachId}`
    } else if (activityId) {
      window.location.href = `/contact?activityId=${activityId}`
    } else {
      window.location.href = `/contact`
    }
  }

  const statusConfig = getStatusConfig(reservation.status)

  return (
    <div
      className={`relative group overflow-hidden transition-all duration-500 ease-out transform ${
        isHovered ? "scale-[1.02] -translate-y-2" : "scale-100 translate-y-0"
      } ${statusConfig.bg} ${statusConfig.border} ${statusConfig.shadow} rounded-3xl border-2 backdrop-blur-sm`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered
          ? `0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3)`
          : `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)`,
      }}
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br ${statusConfig.accent}`}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-br ${statusConfig.accent} opacity-5 group-hover:opacity-10 transition-opacity duration-1000 group-hover:animate-pulse`}
        />
        <div
          className={`absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full bg-gradient-to-tr ${statusConfig.accent} opacity-5 group-hover:opacity-10 transition-opacity duration-1000 group-hover:animate-pulse delay-500`}
        />
      </div>

      <div className="absolute top-6 right-6 z-20">
        <div
          className={`${statusConfig.badge} text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2 transform transition-all duration-300 ${
            isHovered ? "scale-110 rotate-1" : "scale-100 rotate-0"
          }`}
        >
          <span className="text-lg animate-bounce">{statusConfig.icon}</span>
          <span className="tracking-wide">{statusConfig.text}</span>
        </div>
      </div>

      {user?.role === "admin" && (
        <div className="absolute top-6 left-6 z-20">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#22b455] via-[#a0f000] to-[#003c3c] text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2 transform transition-all duration-300 hover:scale-110">
            <Settings className="w-4 h-4 animate-spin-slow" />
            <span className="tracking-wide">Admin</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
          </div>
        </div>
      )}
      <div className="relative z-10 p-8">
  
        <div className="mb-6 pt-4">
          <h3 className="text-2xl font-black text-black mb-3 leading-tight tracking-tight group-hover:text-[#22b455] transition-colors duration-300">
            {reservation.activity?.name || "Activité inconnue"}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-black bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#22b455] shadow-sm">
              {reservation.activity?.category || "Catégorie non définie"}
            </span>
            <div className="flex items-center gap-1 text-sm text-black bg-white/50 backdrop-blur-sm px-3 py-1 rounded-lg">
              <Users className="w-4 h-4" />
              <span>1 place</span>
            </div>
          </div>
        </div>

  
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="flex items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#22b455] shadow-sm group-hover:bg-white/80 transition-all duration-300">
            <div className="p-3 bg-gradient-to-r from-[#22b455] to-[#a0f000] rounded-xl mr-4 shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-black/70 uppercase tracking-wider mb-1">Date</p>
              <p className="font-bold text-black text-lg">{formatDate(reservation.schedule?.date)}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#22b455] shadow-sm group-hover:bg-white/80 transition-all duration-300">
            <div className="p-3 bg-gradient-to-r from-[#22b455] to-[#a0f000] rounded-xl mr-4 shadow-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-black/70 uppercase tracking-wider mb-1">Horaire</p>
              <p className="font-bold text-black text-lg">
                {formatTime(reservation.schedule?.startTime, reservation.schedule?.endTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#22b455] shadow-sm group-hover:bg-white/80 transition-all duration-300">
            <div className="p-3 bg-gradient-to-r from-[#22b455] to-[#a0f000] rounded-xl mr-4 shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-black/70 uppercase tracking-wider mb-1">Coach</p>
              <p className="font-bold text-black text-lg">
                {reservation.activity?.coach?.firstName && reservation.activity?.coach?.lastName
                  ? `${reservation.activity.coach.firstName} ${reservation.activity.coach.lastName}`
                  : reservation.activity?.coach
                    ? "Coach assigné"
                    : "Non assigné"}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#22b455] shadow-sm group-hover:bg-white/80 transition-all duration-300">
            <div className="p-3 bg-gradient-to-r from-[#22b455] to-[#a0f000] rounded-xl mr-4 shadow-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-black/70 uppercase tracking-wider mb-1">Prix</p>
              <p className="font-bold text-black text-xl">
                {reservation.activity?.price ? `${reservation.activity.price} DH` : "Prix à définir"}
              </p>
            </div>
          </div>
        </div>

        {(isAdmin || isCoach) && (
          <div className="mb-6">
            <button
              onClick={() => setShowActivityDetails(!showActivityDetails)}
              className="w-full bg-black text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              {showActivityDetails ? "Masquer les détails" : "Voir les détails de l'activité"}
            </button>
          </div>
        )}
        <div className="space-y-4">
          {(user?.role === "admin" || user?.role === "coach") && reservation.status === "pending" && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-[#a0f000]/20 to-[#22b455]/20 border-2 border-[#22b455] rounded-2xl p-4 text-center backdrop-blur-sm mb-4">
                <p className="text-black font-semibold text-sm">Nouvelle demande de réservation</p>
                <p className="text-black/70 text-xs mt-1">Accepter ou refuser cette demande</p>
              </div>

              <button
                onClick={() => handleUpdateStatus(reservation._id, "confirmed")}
                className="group/btn w-full relative overflow-hidden bg-gradient-to-r from-[#22b455] to-[#a0f000] text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-3 relative z-10">
                  <Check className="w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-300" />
                  <span>Accepter la réservation</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#a0f000] to-[#22b455] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              </button>

              <button
                onClick={() => handleUpdateStatus(reservation._id, "cancelled")}
                className="group/btn w-full relative overflow-hidden bg-black text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-3 relative z-10">
                  <X className="w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-300" />
                  <span>Refuser la réservation</span>
                </div>
                <div className="absolute inset-0 bg-gray-800 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          )}
          {user?.role === "admin" && (
            <button
              onClick={handleEditActivity}
              className="group/btn w-full relative overflow-hidden bg-gradient-to-r from-[#22b455] to-[#a0f000] text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="flex items-center justify-center gap-3 relative z-10">
                <Edit className="w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-300" />
                <span>Modifier l'activité</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover/btn:translate-x-[-200%] transition-transform duration-700" />
            </button>
          )}

          {user?.role !== "admin" && user?.role !== "coach" && (
            <>
              {reservation.status === "pending" && (
                <>
                  <div className="bg-gradient-to-r from-[#a0f000]/20 to-[#22b455]/20 border-2 border-[#22b455] rounded-2xl p-6 text-center backdrop-blur-sm mb-4">
                    <div className="p-4 bg-gradient-to-r from-[#22b455] to-[#a0f000] rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <span className="text-2xl animate-pulse">⏳</span>
                    </div>
                    <p className="text-black font-bold text-lg">Réservation en attente</p>
                    <p className="text-black/70 text-sm mt-2">Votre demande attend la validation de l'entraîneur</p>
                  </div>
                  <button
                    onClick={() => onCancel(reservation._id)}
                    className="group/btn w-full relative overflow-hidden bg-black text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      <X className="w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-300" />
                      <span>Annuler ma réservation</span>
                    </div>
                    <div className="absolute inset-0 bg-gray-800 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  </button>
                  {(isAdmin || isCoach) && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => onApprove && onApprove(reservation._id)}
                        className="flex-1 bg-gradient-to-r from-[#22b455] to-[#a0f000] text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#22b455]/25 transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Check className="w-5 h-5" />
                          <span>Approuver</span>
                        </div>
                      </button>
                      <button
                        onClick={() => onReject && onReject(reservation._id)}
                        className="flex-1 bg-black text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <X className="w-5 h-5" />
                          <span>Refuser</span>
                        </div>
                      </button>
                    </div>
                  )}
                </>
              )}

              {reservation.status === "confirmed" && (
                <div className="bg-gradient-to-r from-[#a0f000]/20 to-[#22b455]/20 border-2 border-[#22b455] rounded-2xl p-6 text-center backdrop-blur-sm">
                  <div className="p-4 bg-gradient-to-r from-[#22b455] to-[#a0f000] rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Check className="w-8 h-8 text-white animate-bounce" />
                  </div>
                  <p className="text-black font-bold text-lg">Réservation acceptée</p>
                  <p className="text-black/70 text-sm mt-2">L'entraîneur a validé votre réservation</p>
                  <div className="mt-4 p-3 bg-white/50 rounded-xl">
                    <p className="text-black text-sm font-medium">
                      Catégorie: <span className="font-bold">{reservation.activity?.category || "Non définie"}</span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <button onClick={handleContactCoach} className="w-full bg-black text-white py-3 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      Contacter le coach
                    </button>
                  </div>
                </div>
              )}

              {reservation.status === "cancelled" && (
                <div className="bg-gradient-to-r from-[#a0f000]/20 to-[#22b455]/20 border-2 border-[#22b455] rounded-2xl p-6 text-center backdrop-blur-sm">
                  <div className="p-4 bg-gradient-to-r from-[#22b455] to-[#a0f000] rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <X className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-black font-bold text-lg">Réservation refusée</p>
                  <p className="text-black/70 text-sm mt-2">L'entraîneur a refusé cette demande de réservation</p>
                  <div className="mt-4 p-3 bg-white/50 rounded-xl">
                    <p className="text-black text-sm font-medium">
                      Catégorie: <span className="font-bold">{reservation.activity?.category || "Non définie"}</span>
                    </p>
                  </div>
                </div>
              )}

              {reservation.status === "completed" && !reservation.reviewed && (
                <>
                  <div className="bg-gradient-to-r from-[#a0f000]/20 to-[#22b455]/20 border-2 border-[#22b455] rounded-2xl p-6 text-center backdrop-blur-sm mb-4">
                    <div className="p-4 bg-gradient-to-r from-[#22b455] to-[#a0f000] rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-black font-bold text-lg">Session terminée</p>
                    <p className="text-black/70 text-sm mt-2">Comment s'est passée votre séance ?</p>
                    <div className="mt-4 p-3 bg-white/50 rounded-xl">
                      <p className="text-black text-sm font-medium">
                        Catégorie: <span className="font-bold">{reservation.activity?.category || "Non définie"}</span>
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowReviewModal(true)} className="group/btn w-full relative overflow-hidden bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      <Star className="w-6 h-6 group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-transform duration-300" />
                      <span>Laisser un avis</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover/btn:translate-x-[-200%] transition-transform duration-700" />
                  </button>
                </>
              )}
              {(isAdmin || isCoach) && reservation.status === "confirmed" && (
                <button onClick={() => handleComplete(reservation._id)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Marquer comme terminée
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {showActivityDetails && reservation.activity && (
        <div className="mt-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200 shadow-lg">
          <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Détails de l'activité
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h5 className="font-semibold text-slate-700 mb-2">Description</h5>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {reservation.activity.description || "Aucune description disponible"}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h5 className="font-semibold text-slate-700 mb-2">Niveau requis</h5>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">
                    {reservation.activity.level || "Tous niveaux"}
                  </span>
                  {reservation.activity.level && (
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < (reservation.activity.level === 'débutant' ? 1 : 
                                 reservation.activity.level === 'intermédiaire' ? 3 : 5)
                              ? 'bg-yellow-400'
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h5 className="font-semibold text-slate-700 mb-2">Durée de session</h5>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-600">
                    {reservation.activity.duration || 60} minutes
                  </span>
                </div>
              </div>
              
              {reservation.activity.schedule && reservation.activity.schedule.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <h5 className="font-semibold text-slate-700 mb-2">Horaires disponibles</h5>
                  <div className="space-y-2">
                    {reservation.activity.schedule.map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-600 font-medium">
                          {session.day}
                        </span>
                        <span className="text-sm text-blue-600">
                          {session.startTime} - {session.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {reservation.activity.coach && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h5 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Coach assigné
              </h5>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {reservation.activity.coach.firstName?.[0] || 'C'}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {reservation.activity.coach.firstName && reservation.activity.coach.lastName
                      ? `${reservation.activity.coach.firstName} ${reservation.activity.coach.lastName}`
                      : "Coach assigné"}
                  </p>
                  {reservation.activity.coach.specialization && (
                    <p className="text-sm text-slate-600">
                      Spécialisation: {reservation.activity.coach.specialization}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1500" />
      </div>
      <div
        className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${statusConfig.accent} p-[2px]`}
      >
        <div className={`w-full h-full rounded-3xl ${statusConfig.bg}`} />
      </div>
    {showReviewModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Donner votre avis</h3>
          <div className="flex gap-2 mb-4" role="radiogroup" aria-label="Note en étoiles">
            {[1,2,3,4,5].map((n) => (
              <button key={n} onClick={() => setReviewRating(n)} aria-checked={reviewRating===n} role="radio" className={`${reviewRating >= n ? 'text-amber-500' : 'text-gray-300'}`}>
                ★
              </button>
            ))}
          </div>
          <textarea value={reviewComment} onChange={(e)=>setReviewComment(e.target.value)} placeholder="Votre commentaire" className="w-full border rounded-xl p-3 mb-4" rows={4} />
          <div className="flex justify-end gap-2">
            <button onClick={()=>setShowReviewModal(false)} className="px-4 py-2 rounded-xl bg-gray-200">Annuler</button>
            <button onClick={handleSubmitReview} className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold">Envoyer</button>
          </div>
        </div>
      </div>
    )}
    </div>
  )
}

export default ReservationCard