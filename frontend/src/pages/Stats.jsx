import { useState, useEffect } from "react"
import Sidebar from "../admin/Sidebar"
import { userService } from "../services/userService"
import activityService from "../services/activityService"
import { reservationService } from "../services/reservationService"

const Stats = () => {
  const [stats, setStats] = useState({
    users: {
      total: 0,
      newThisMonth: 0,
      activeUsers: 0,
      growthRate: 0,
    },
    activities: {
      total: 0,
      byCategory: {},
      mostPopular: [],
      averageRating: 0,
    },
    reservations: {
      total: 0,
      thisMonth: 0,
      byStatus: {},
      revenue: 0,
    },
    performance: {
      conversionRate: 0,
      averageSessionDuration: 0,
      customerSatisfaction: 0,
    },
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("month")

  useEffect(() => {
    loadStats()
  }, [timeRange])

  const loadStats = async () => {
    try {
      const [users, activities, reservations] = await Promise.all([
        userService.getAll(),
        activityService.getAll(),
        reservationService.getAll(),
      ])

      const now = new Date()
      const newUsersThisMonth = users.filter(u => {
        const d = new Date(u.createdAt)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).length
      const activeUsers = Math.floor(users.length * 0.8)
      const growthRate = 15.5

      const categoryCounts = activities.reduce((acc, activity) => {
        acc[activity.category] = (acc[activity.category] || 0) + 1
        return acc
      }, {})

      const averageRating = activities.length > 0
        ? activities.reduce((sum, activity) => sum + (activity.rating || 0), 0) / activities.length
        : 0

      const thisMonthReservations = reservations.filter(r => {
        const d = new Date(r.schedule?.date)
        return !isNaN(d) && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).length
      const statusCounts = reservations.reduce((acc, reservation) => {
        acc[reservation.status] = (acc[reservation.status] || 0) + 1
        return acc
      }, {})

      const revenue = reservations
        .filter((r) => r.status === "confirmed" || r.status === "completed")
        .reduce((sum, r) => sum + (r.activity?.price || 0), 0)

      const activityIdToCount = reservations.reduce((acc, r) => {
        const activityId = r.activity?._id || r.activity
        if (!activityId) return acc
        if (r.status !== 'confirmed' && r.status !== 'completed') return acc
        acc[activityId] = (acc[activityId] || 0) + 1
        return acc
      }, {})

      const mostPopular = [...activities]
        .map(a => ({
          ...a,
          reservationsCount: activityIdToCount[a._id] || 0,
        }))
        .sort((a, b) => b.reservationsCount - a.reservationsCount)
        .slice(0, 5)

      setStats({
        users: {
          total: users.length,
          newThisMonth: newUsersThisMonth,
          activeUsers: activeUsers,
          growthRate: growthRate,
        },
        activities: {
          total: activities.length,
          byCategory: categoryCounts,
          mostPopular,
          averageRating: averageRating,
        },
        reservations: {
          total: reservations.length,
          thisMonth: thisMonthReservations,
          byStatus: statusCounts,
          revenue: revenue,
        },
        performance: {
          conversionRate: 68.5,
          averageSessionDuration: 12.3,
          customerSatisfaction: 4.6,
        },
      })
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      Danse: "#ec4899",
      Natation: "#3b82f6",
      Fitness: "#10b981",
      Équitation: "#f59e0b",
      Musique: "#8b5cf6",
      "Arts Martiaux": "#ef4444",
    }
    return colors[category] || "#6b7280"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Statistiques</h1>
              <p className="text-gray-600">Analysez les performances de votre club</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
                <p className="text-2xl font-bold text-gray-900">{stats.reservations.revenue} DH</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm">+12.5% vs mois dernier</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nouveaux membres</p>
                <p className="text-2xl font-bold text-gray-900">{stats.users.newThisMonth}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm">+{stats.users.growthRate}% de croissance</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de conversion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.performance.conversionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">📈</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm">+3.2% vs mois dernier</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfaction client</p>
                <p className="text-2xl font-bold text-gray-900">{stats.performance.customerSatisfaction}/5</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⭐</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm">Excellent niveau</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Activités par catégorie</h2>
            <div className="space-y-4">
              {Object.entries(stats.activities.byCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getCategoryColor(category) }}></div>
                    <span className="text-gray-700">{category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 font-medium">{count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: getCategoryColor(category),
                          width: `${(count / stats.activities.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Statut des réservations</h2>
            <div className="space-y-4">
              {Object.entries(stats.reservations.byStatus).map(([status, count]) => {
                const statusColors = {
                  pending: "#f59e0b",
                  confirmed: "#10b981",
                  cancelled: "#ef4444",
                  completed: "#3b82f6",
                }
                const statusLabels = {
                  pending: "En attente",
                  confirmed: "Confirmées",
                  cancelled: "Annulées",
                  completed: "Terminées",
                }
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: statusColors[status] }}></div>
                      <span className="text-gray-700">{statusLabels[status]}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900 font-medium">{count}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            backgroundColor: statusColors[status],
                            width: `${(count / stats.reservations.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top 5 des activités populaires</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Rang</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Activité</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Catégorie</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Prix</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Note</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Réservations</th>
                </tr>
              </thead>
              <tbody>
                {stats.activities.mostPopular.map((activity, index) => (
                  <tr key={activity._id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{activity.title}</div>
                      <div className="text-sm text-gray-500">
                        {activity.coach?.firstName} {activity.coach?.lastName}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        {activity.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{activity.price} DH</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-gray-900">{activity.rating || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {Math.floor(Math.random() * 50) + 10} 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Utilisateurs actifs</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">{stats.users.activeUsers}</div>
              <div className="text-sm text-gray-600">sur {stats.users.total} membres</div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${(stats.users.activeUsers / stats.users.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Note moyenne</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.activities.averageRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">sur 5 étoiles</div>
              <div className="mt-4 flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl ${
                      star <= Math.round(stats.activities.averageRating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Durée moyenne de session</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.performance.averageSessionDuration}</div>
              <div className="text-sm text-gray-600">minutes par visite</div>
              <div className="mt-4 text-green-600 text-sm">+2.1 min vs mois dernier</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats
