import { useState, useEffect } from "react"
import ReservationCard from "../components/ReservationCard"
import { reservationService } from "../services/reservationService"
import { useNotification } from "../context/NotificationContext"

const Reservations = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const { showSuccess, showError } = useNotification()

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async () => {
    try {
      const data = await reservationService.getUserReservations()
      setReservations(data)
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error)
      showError("Erreur lors du chargement des réservations")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      return
    }

    try {
      await reservationService.cancel(reservationId)
      showSuccess("Réservation annulée avec succès")
      loadReservations()
    } catch (error) {
      showError(error.message || "Erreur lors de l'annulation")
    }
  }

  const filteredReservations = reservations.filter((reservation) => {
    if (filter === "all") return true
    return reservation.status === filter
  })

  const getFilterCount = (status) => {
    if (status === "all") return reservations.length
    return reservations.filter((r) => r.status === status).length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Mes Réservations</h1>
          <p className="text-gray-600">Gérez vos réservations d'activités et consultez leur statut</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "all" ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Toutes ({getFilterCount("all")})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              En attente ({getFilterCount("pending")})
            </button>
            <button
              onClick={() => setFilter("confirmed")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "confirmed" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Confirmées ({getFilterCount("confirmed")})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Terminées ({getFilterCount("completed")})
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "cancelled" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Annulées ({getFilterCount("cancelled")})
            </button>
          </div>
        </div>

        {filteredReservations.length > 0 ? (
          <div className="space-y-6">
            {filteredReservations.map((reservation) => (
              <ReservationCard key={reservation._id} reservation={reservation} onCancel={handleCancelReservation} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {filter === "all"
                ? "Aucune réservation"
                : `Aucune réservation ${filter === "pending" ? "en attente" : filter === "confirmed" ? "confirmée" : filter === "completed" ? "terminée" : "annulée"}`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "Vous n'avez pas encore effectué de réservation"
                : "Aucune réservation ne correspond à ce filtre"}
            </p>
            <button
              onClick={() => (window.location.href = "/activities")}
              className="bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 transition-colors"
            >
              Découvrir les activités
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reservations
