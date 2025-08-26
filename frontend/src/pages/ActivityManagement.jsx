import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../context/AuthContext"
import { useNotification } from "../context/NotificationContext"
import { useNavigate } from "react-router-dom"
import ActivityForm from "../components/ActivityForm"
import activityService from "../services/activityService"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  DollarSign,
  MapPin,
  Activity,
  Clock,
  Grid3X3,
  List,
  Sparkles,
  Zap,
  Calendar,
} from "lucide-react"

const ActivityManagement = () => {
  const { isAuthenticated, isAdmin, isCoach, user } = useAuth()
  const { showSuccess, showError } = useNotification()
  const navigate = useNavigate()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadActivities = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await activityService.getAll()
      setActivities(data)
    } catch (err) {
      if (err.message.includes('Non autorisé') || err.message.includes('token')) {
        setError("Session expirée, veuillez vous reconnecter")
        navigate('/login')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const createActivity = useCallback(async (activityData) => {
    try {
      const newActivity = await activityService.create(activityData)
      setActivities(prev => [...prev, newActivity])
      return newActivity
    } catch (error) {
      console.error("Erreur création activité:", error)
      throw error
    }
  }, [])

  const updateActivity = useCallback(async (id, activityData) => {
    try {
      const updatedActivity = await activityService.update(id, activityData)
      setActivities(prev => prev.map(activity => 
        activity._id === id ? updatedActivity : activity
      ))
      return updatedActivity
    } catch (error) {
      console.error("Erreur mise à jour activité:", error)
      throw error
    }
  }, [])

  const deleteActivity = useCallback(async (id) => {
    try {
      await activityService.delete(id)
      setActivities(prev => prev.filter(activity => activity._id !== id))
      return true
    } catch (error) {
      console.error("Erreur suppression activité:", error)
      throw error
    }
  }, [])

  const [showForm, setShowForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCoach, setSelectedCoach] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [viewMode, setViewMode] = useState("grid") 

  const formatDay = (day) => {
    const daysMap = {
      'lundi': 'Lundi',
      'mardi': 'Mardi', 
      'mercredi': 'Mercredi',
      'jeudi': 'Jeudi',
      'vendredi': 'Vendredi',
      'samedi': 'Samedi',
      'dimanche': 'Dimanche'
    }
    return daysMap[day] || day
  }

  const formatTime = (time) => {
    if (!time) return 'N/A'
    return time
  }

  const filteredActivities = activities
    .filter((activity) => {
      const matchesSearch =
        activity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || activity.category === selectedCategory
      const matchesCoach = !selectedCoach || activity.coach === selectedCoach

      if (isCoach && !isAdmin) {
        const currentUserName = `${user?.firstName} ${user?.lastName}`
        return matchesSearch && matchesCategory && activity.coach === currentUserName
      }

      return matchesSearch && matchesCategory && matchesCoach
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "price" || sortBy === "duration") {
        aValue = Number.parseFloat(aValue) || 0
        bValue = Number.parseFloat(bValue) || 0
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token')
      if (!token) {
        setError("Token d'authentification manquant, veuillez vous reconnecter")
        navigate('/login')
        return
      }
      loadActivities()
    } else {
      navigate('/login')
    }
  }, [isAuthenticated, loadActivities, navigate])

  const handleCreateActivity = async (activityData) => {
    try {
      setLoading(true)
      await createActivity(activityData)
      showSuccess("Activité créée avec succès !")
      setShowForm(false)
      await loadActivities()
    } catch (error) {
      if (error.message.includes('Non autorisé') || error.message.includes('token')) {
        showError("Session expirée, veuillez vous reconnecter")
        navigate('/login')
      } else {
        showError(`Erreur lors de la création de l'activité: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateActivity = async (activityData) => {
    try {
      setLoading(true)
      await updateActivity(editingActivity._id, activityData)
      showSuccess("Activité mise à jour avec succès !")
      setEditingActivity(null)
      setShowForm(false)
      await loadActivities()
    } catch (error) {
      if (error.message.includes('Non autorisé') || error.message.includes('token')) {
        showError("Session expirée, veuillez vous reconnecter")
        navigate('/login')
      } else {
        showError(`Erreur lors de la mise à jour de l'activité: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      try {
        setLoading(true)
        await deleteActivity(activityId)
        showSuccess("Activité supprimée avec succès !")
      } catch (error) {
        if (error.message.includes('Non autorisé') || error.message.includes('token')) {
          showError("Session expirée, veuillez vous reconnecter")
          navigate('/login')
        } else {
          showError(`Erreur lors de la suppression de l'activité: ${error.message}`)
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEditActivity = (activity) => {
    setEditingActivity(activity)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingActivity(null)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedCoach("")
    setSortBy("name")
    setSortOrder("asc")
  }

  const uniqueCategories = [...new Set(activities.map((a) => a.category))].filter(Boolean)

  const uniqueCoaches = isAdmin
    ? [
        ...new Set(
          activities.map((a) => {
            if (typeof a.coach === "object" && a.coach !== null) {
              return a.coach._id || `${a.coach.firstName || ""} ${a.coach.lastName || ""}`.trim() || "Coach inconnu"
            }
            return a.coach || "Coach inconnu"
          }),
        ),
      ].filter(Boolean)
    : []

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Accès non autorisé
          </h1>
          <p className="text-gray-600">Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-in fade-in-50 slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75 animate-pulse"></div>
              <Activity className="relative w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {isCoach && !isAdmin ? "Mes Activités" : "Gestion des Activités"}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {isCoach && !isAdmin
              ? "Gérez vos activités et créneaux horaires en toute simplicité"
              : "Administrez toutes les activités de votre centre sportif"}
          </p>
          
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isAuthenticated ? 'Connecté' : 'Non connecté'}
            </span>
            {isAuthenticated && (
              <span className="text-xs text-gray-500">
                ({isAdmin ? 'Admin' : isCoach ? 'Coach' : 'Utilisateur'})
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-in fade-in-50 slide-in-from-left-4 duration-500 delay-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="group relative bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 shadow-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="relative w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative">Nouvelle Activité</span>
              <Sparkles className="relative w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />
            </button>

            <button
              onClick={loadActivities}
              disabled={loading}
              className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 shadow-lg overflow-hidden disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className={`relative w-5 h-5 ${loading ? 'animate-spin' : ''}`}>
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
              </div>
              <span className="relative">{loading ? 'Chargement...' : 'Rafraîchir'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="text-sm font-medium">Grille</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">Liste</span>
            </button>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-8 shadow-xl mb-8 animate-in fade-in-50 slide-in-from-right-4 duration-500 delay-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Rechercher une activité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/90 focus:bg-white"
              />
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/90 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="">Toutes les catégories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category} className="capitalize">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {isAdmin && (
              <div className="relative">
                <select
                  value={selectedCoach}
                  onChange={(e) => setSelectedCoach(e.target.value)}
                  className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/90 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Tous les coachs</option>
                  {uniqueCoaches.map((coach) => (
                    <option key={coach} value={coach}>
                      {typeof coach === "object" && coach !== null
                        ? `${coach.firstName || ""} ${coach.lastName || ""}`.trim() || "Coach inconnu"
                        : coach || "Coach inconnu"}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/90 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="name">Nom</option>
                <option value="category">Catégorie</option>
                <option value="price">Prix</option>
                <option value="duration">Durée</option>
                <option value="coach">Coach</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-4 py-4 bg-white/70 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105 font-bold text-lg"
                title={`Trier par ordre ${sortOrder === "asc" ? "décroissant" : "croissant"}`}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                <span className="font-bold text-gray-900 text-lg">{filteredActivities.length}</span> activité
                {filteredActivities.length !== 1 ? "s" : ""} trouvée{filteredActivities.length !== 1 ? "s" : ""}
              </span>
              {(searchTerm || selectedCategory || selectedCoach) && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Filtres actifs:</span>
                  {searchTerm && (
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs rounded-full border border-blue-200">
                      "{searchTerm}"
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs rounded-full border border-green-200">
                      {selectedCategory}
                    </span>
                  )}
                  {selectedCoach && (
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 text-xs rounded-full border border-orange-200">
                      {selectedCoach}
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={resetFilters}
              className="group text-blue-600 hover:text-purple-600 text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105"
            >
              <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
              Réinitialiser les filtres
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <ActivityForm
              onSubmit={editingActivity ? handleUpdateActivity : handleCreateActivity}
              onCancel={handleCancelForm}
              activity={editingActivity}
              mode={editingActivity ? "edit" : "create"}
              userRole={isCoach && !isAdmin ? "coach" : "admin"}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 animate-in fade-in-50 duration-500">
            <div className="relative mx-auto mb-6 w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 text-lg">Chargement des activités...</p>
          </div>
        ) : error ? (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-8 py-6 rounded-2xl mb-6 animate-in fade-in-50 slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="font-medium text-lg">Erreur lors du chargement des activités</p>
            </div>
            <p className="mb-4">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={loadActivities}
                disabled={loading}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {loading ? 'Chargement...' : 'Réessayer'}
              </button>
              {error.includes('Non autorisé') || error.includes('token') ? (
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Se reconnecter
                </button>
              ) : null}
            </div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-16 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
            <div className="relative p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-fit mx-auto mb-8">
              <Activity className="w-16 h-16 text-gray-400" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"></div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              Aucune activité trouvée
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              {searchTerm || selectedCategory || selectedCoach
                ? "Essayez de modifier vos critères de recherche"
                : "Commencez par créer votre première activité"}
            </p>
            {!searchTerm && !selectedCategory && !selectedCoach && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Créer une activité
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
            {filteredActivities.map((activity, index) => (
              <div
                key={activity._id}
                className="relative group animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {viewMode === "grid" ? (
                  <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                            {activity.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {activity.description}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditActivity(activity)}
                            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 transform hover:scale-110"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(activity._id)}
                            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 transform hover:scale-110"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                          <MapPin className="w-5 h-5 text-blue-500" />
                          <span className="text-gray-700 font-medium">{activity.location || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                          <DollarSign className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700 font-bold">{activity.price || 0} DH</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                          <Clock className="w-5 h-5 text-orange-500" />
                          <span className="text-gray-700 font-medium">{activity.duration || "N/A"} min</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                          <Users className="w-5 h-5 text-purple-500" />
                          <span className="text-gray-700 font-medium">
                            {activity.schedule?.reduce(
                              (total, schedule) => total + (schedule.participants?.length || 0),
                              0,
                            ) || 0}
                            /
                            {activity.schedule?.reduce(
                              (total, schedule) => total + (schedule.maxParticipants || 0),
                              0,
                            ) || "N/A"}
                          </span>
                        </div>
                      </div>

                     
                      <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {typeof activity.coach === 'object' && activity.coach !== null
                                ? `${(activity.coach.firstName || '').charAt(0)}${(activity.coach.lastName || '').charAt(0)}`
                                : (activity.coach || 'C').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              Coach: {typeof activity.coach === 'object' && activity.coach !== null
                                ? `${activity.coach.firstName || ''} ${activity.coach.lastName || ''}`.trim() || 'Coach inconnu'
                                : activity.coach || 'Coach inconnu'}
                            </p>
                            {typeof activity.coach === 'object' && activity.coach !== null && activity.coach.email && (
                              <p className="text-xs text-gray-600">{activity.coach.email}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {activity.schedule && activity.schedule.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            Horaires et Dates
                          </h4>
                          <div className="space-y-2">
                            {activity.schedule.map((session, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-lg border border-blue-100/50">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-700 capitalize">
                                    {formatDay(session.day)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="w-3 h-3 text-blue-500" />
                                  <span className="font-medium">
                                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 bg-white/70 px-2 py-1 rounded-full">
                                  Max: {session.maxParticipants || 0}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>Créée le: {new Date(activity.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        {activity.isActive !== undefined && (
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${activity.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xs">{activity.isActive ? 'Active' : 'Inactive'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-6">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                                {activity.name}
                              </h3>
                              <p className="text-gray-600 text-base mb-6 leading-relaxed">{activity.description}</p>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                                  <MapPin className="w-5 h-5 text-blue-500" />
                                  <span className="text-gray-700 font-medium">{activity.location || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                  <DollarSign className="w-5 h-5 text-green-500" />
                                  <span className="text-gray-700 font-bold">{activity.price || 0} DH</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                                  <Clock className="w-5 h-5 text-orange-500" />
                                  <span className="text-gray-700 font-medium">{activity.duration || "N/A"} min</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                                  <Users className="w-5 h-5 text-purple-500" />
                                  <span className="text-gray-700 font-medium">
                                    {activity.schedule?.reduce(
                                      (total, schedule) => total + (schedule.participants?.length || 0),
                                      0,
                                    ) || 0}
                                    /
                                    {activity.schedule?.reduce(
                                      (total, schedule) => total + (schedule.maxParticipants || 0),
                                      0,
                                    ) || "N/A"}
                                  </span>
                                </div>
                              </div>

                   
                              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                      {typeof activity.coach === 'object' && activity.coach !== null
                                        ? `${(activity.coach.firstName || '').charAt(0)}${(activity.coach.lastName || '').charAt(0)}`
                                        : (activity.coach || 'C').charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-base font-semibold text-gray-800">
                                      Coach: {typeof activity.coach === 'object' && activity.coach !== null
                                        ? `${activity.coach.firstName || ''} ${activity.coach.lastName || ''}`.trim() || 'Coach inconnu'
                                        : activity.coach || 'Coach inconnu'}
                                    </p>
                                    {typeof activity.coach === 'object' && activity.coach !== null && activity.coach.email && (
                                      <p className="text-sm text-gray-600">{activity.coach.email}</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {activity.schedule && activity.schedule.length > 0 && (
                                <div className="mt-6">
                                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    Horaires et Dates
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {activity.schedule.map((session, index) => (
                                      <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-lg border border-blue-100/50">
                                        <div className="flex items-center gap-3">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                          <span className="text-sm font-medium text-gray-700 capitalize">
                                            {formatDay(session.day)}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                          <Clock className="w-3 h-3 text-blue-500" />
                                          <span className="font-medium">
                                            {formatTime(session.startTime)} - {formatTime(session.endTime)}
                                          </span>
                                        </div>
                                        <div className="text-xs text-gray-500 bg-white/70 px-2 py-1 rounded-full">
                                          Max: {session.maxParticipants || 0}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                    
                              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span>Créée le: {new Date(activity.createdAt).toLocaleDateString('fr-FR')}</span>
                                </div>
                                {activity.isActive !== undefined && (
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${activity.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span>{activity.isActive ? 'Active' : 'Inactive'}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 ml-6">
                          <button
                            onClick={() => handleEditActivity(activity)}
                            className="p-4 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 transform hover:scale-110"
                            title="Modifier"
                          >
                            <Edit className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(activity._id)}
                            className="p-4 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 transform hover:scale-110"
                            title="Supprimer"
                          >
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityManagement
