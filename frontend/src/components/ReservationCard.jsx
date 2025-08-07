
const ReservationCard = ({ reservation, onCancel }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusText = (status) => {
    const texts = {
      pending: "En attente",
      confirmed: "Confirmée",
      cancelled: "Annulée",
      completed: "Terminée",
    }
    return texts[status] || status
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{reservation.activity?.title}</h3>
          <p className="text-gray-600">{reservation.activity?.category}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
          {getStatusText(reservation.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">📅</span>
          <span>{new Date(reservation.date).toLocaleDateString("fr-FR")}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">⏰</span>
          <span>{reservation.time}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">👨‍🏫</span>
          <span>
            {reservation.activity?.coach?.firstName} {reservation.activity?.coach?.lastName}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">💰</span>
          <span>{reservation.activity?.price}€</span>
        </div>
      </div>

      {reservation.status === "pending" && (
        <div className="flex space-x-2">
          <button
            onClick={() => onCancel(reservation._id)}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
          >
            Annuler
          </button>
        </div>
      )}

      {reservation.status === "completed" && !reservation.reviewed && (
        <button className="w-full bg-amber-400 text-white py-2 px-4 rounded-md hover:bg-amber-500 transition-colors">
          Laisser un avis
        </button>
      )}
    </div>
  )
}

export default ReservationCard
