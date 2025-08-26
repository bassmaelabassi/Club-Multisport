import { useState, useEffect } from "react"
import { Search, Filter, Plus, Edit3, Trash2, Star, Phone, Mail, Award, Clock } from "lucide-react"
import { userService } from "../services/userService"

const ManageCoaches = () => {
  const [coaches, setCoaches] = useState([])
  const [filteredCoaches, setFilteredCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [specialityFilter, setSpecialityFilter] = useState("all")
  const [showCoachForm, setShowCoachForm] = useState(false)
  const [editingCoach, setEditingCoach] = useState(null)
  const [error, setError] = useState(null)

  const specialities = [
    "Yoga & Méditation",
    "Natation & Aquafitness",
    "Danse Moderne & Jazz",
    "Équitation & Dressage",
    "Guitare & Composition",
    "Karaté Shotokan",
  ]

  useEffect(() => {
    loadCoaches()
  }, [])

  useEffect(() => {
    filterCoaches()
  }, [coaches, searchTerm, specialityFilter])

  const loadCoaches = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getCoaches()
      console.log("Coaches chargés:", data)
      setCoaches(data)
    } catch (error) {
      console.error("Erreur lors du chargement des coaches:", error)
      setError("Erreur lors du chargement des coaches")
    } finally {
      setLoading(false)
    }
  }

  const filterCoaches = () => {
    let filtered = [...coaches]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (coach) =>
          coach.firstName?.toLowerCase().includes(term) ||
          coach.lastName?.toLowerCase().includes(term) ||
          coach.speciality?.toLowerCase().includes(term),
      )
    }

    if (specialityFilter !== "all") {
      filtered = filtered.filter((coach) => coach.speciality === specialityFilter)
    }

    setFilteredCoaches(filtered)
  }

  const handleCreateCoach = () => {
    setEditingCoach(null)
    setShowCoachForm(true)
  }

  const handleEditCoach = (coach) => {
    setEditingCoach(coach)
    setShowCoachForm(true)
  }

  const handleDeleteCoach = async (coachId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce coach ?")) {
      return
    }

    try {
      await userService.deleteCoach(coachId)
      await loadCoaches()
      alert("Coach supprimé avec succès")
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Erreur lors de la suppression du coach")
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const coachData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      speciality: formData.get('speciality'),
      experience: formData.get('experience'),
      rating: formData.get('rating'),
      bio: formData.get('bio')
    }

    const password = formData.get('password')
    if (password) {
      coachData.password = password
    }

    try {
      if (editingCoach) {
        await userService.updateCoach(editingCoach._id, coachData)
        alert("Coach modifié avec succès")
      } else {
        await userService.createCoach(coachData)
        alert("Coach créé avec succès")
      }
      
      setShowCoachForm(false)
      setEditingCoach(null)
      await loadCoaches()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      alert("Erreur lors de la sauvegarde du coach")
    }
  }

  const handleFormCancel = () => {
    setShowCoachForm(false)
    setEditingCoach(null)
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`
  }

  const getSpecialityColor = (speciality) => {
    const colors = {
      "Yoga & Méditation": "from-green-400 to-emerald-500",
      "Natation & Aquafitness": "from-blue-400 to-cyan-500",
      "Danse Moderne & Jazz": "from-purple-400 to-pink-500",
      "Équitation & Dressage": "from-amber-400 to-orange-500",
      "Guitare & Composition": "from-indigo-400 to-purple-500",
      "Karaté Shotokan": "from-red-400 to-rose-500",
    }
    return colors[speciality] || "from-gray-400 to-gray-500"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animation-delay-150"></div>
          <div className="mt-4 text-center">
            <div className="text-lg font-semibold text-gray-700 animate-pulse">Chargement...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="mb-8 opacity-0 animate-fadeInDown" style={{animationDelay: '0.1s', animationFillMode: 'forwards'}}>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Gestion des Coachs
              </h1>
              <p className="text-lg text-gray-600">Gérez votre équipe de professionnels avec style</p>
            </div>
            <button
              onClick={handleCreateCoach}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative flex items-center space-x-2 z-10">
                <Plus className="w-5 h-5" />
                <span>Nouveau Coach</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 opacity-0 animate-fadeInUp" style={{animationDelay: '0.15s', animationFillMode: 'forwards'}}>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">⚠️</span>
              </div>
            <div>
                <p className="text-red-800 font-medium">{error}</p>
                <button 
                  onClick={loadCoaches}
                  className="text-red-600 text-sm underline hover:text-red-800"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8 opacity-0 animate-fadeInUp" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Search className="w-4 h-4 text-blue-500" />
                <span>Rechercher</span>
              </label>
              <div className="relative group">
              <input
                type="text"
                placeholder="Nom, prénom ou spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/80"
              />
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Filter className="w-4 h-4 text-indigo-500" />
                <span>Spécialité</span>
              </label>
              <select
                value={specialityFilter}
                onChange={(e) => setSpecialityFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/80"
              >
                <option value="all">Toutes les spécialités</option>
                {specialities.map((speciality) => (
                  <option key={speciality} value={speciality}>
                    {speciality}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md">
                {filteredCoaches.length} coach{filteredCoaches.length > 1 ? "s" : ""} trouvé
                {filteredCoaches.length > 1 ? "s" : ""}
              </div>
              <button
                onClick={loadCoaches}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors duration-300"
                title="Actualiser la liste"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 opacity-0 animate-fadeInUp" style={{animationDelay: '0.25s', animationFillMode: 'forwards'}}>
            <h4 className="font-semibold text-blue-800 mb-2">🔍 Debug Info</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Total coaches:</strong> {coaches.length}</p>
              <p><strong>Filtered coaches:</strong> {filteredCoaches.length}</p>
              <p><strong>Loading:</strong> {loading ? 'Oui' : 'Non'}</p>
              <p><strong>Error:</strong> {error || 'Aucune'}</p>
              {coaches.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer font-medium">Voir les données des coaches</summary>
                  <pre className="mt-2 text-xs bg-blue-100 p-2 rounded overflow-auto">
                    {JSON.stringify(coaches, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {filteredCoaches.map((coach, index) => (
             <div
               key={coach._id}
               data-coach-id={coach._id}
               className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 opacity-0 animate-fadeInUp"
               style={{
                 animationDelay: `${0.3 + index * 0.1}s`,
                 animationFillMode: 'forwards'
               }}
             >
               <div className="relative p-4">
                 <div className="flex items-center space-x-3 mb-4">
                   <div className={`relative w-12 h-12 bg-gradient-to-br ${getSpecialityColor(coach.speciality)} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                     <span className="text-white font-bold text-sm">
                       {getInitials(coach.firstName, coach.lastName)}
                     </span>
                     <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                   <div className="min-w-0 flex-1">
                     <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 truncate">
                      {coach.firstName} {coach.lastName}
                    </h3>
                     <p className="text-sm text-gray-600 font-medium truncate">{coach.speciality}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                   <div className="flex items-center space-x-2 text-xs text-gray-600 hover:text-blue-600 transition-colors group/item">
                     <Mail className="w-3 h-3 text-blue-500 group-hover/item:scale-110 transition-transform" />
                     <span className="truncate text-xs">{coach.email || "Email non renseigné"}</span>
                  </div>
                   <div className="flex items-center space-x-2 text-xs text-gray-600 hover:text-green-600 transition-colors group/item">
                     <Phone className="w-3 h-3 text-green-500 group-hover/item:scale-110 transition-transform" />
                     <span className="truncate text-xs">{coach.phone || "Téléphone non renseigné"}</span>
                  </div>
                   <div className="flex items-center space-x-2 text-xs text-gray-600 hover:text-purple-600 transition-colors group/item">
                     <Award className="w-3 h-3 text-purple-500 group-hover/item:scale-110 transition-transform" />
                     <span className="text-xs">{coach.experience || coach.yearsOfExperience || "5+"} ans</span>
                  </div>
                   <div className="flex items-center space-x-2 text-xs text-gray-600 hover:text-yellow-600 transition-colors group/item">
                     <Star className="w-3 h-3 text-yellow-500 group-hover/item:scale-110 transition-transform" />
                     <span className="text-xs">{coach.rating || "N/A"} / 5</span>
                  </div>
                </div>

                {coach.bio && (
                  <div className="mb-4">
                     <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                       {coach.bio}
                     </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCoach(coach)}
                     className="group/btn flex-1 relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-3 rounded-lg font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                   >
                     <span className="flex items-center justify-center space-x-1 relative z-10">
                       <Edit3 className="w-3 h-3" />
                       <span>Modifier</span>
                     </span>
                     <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300"></div>
                  </button>
                  <button
                    onClick={() => handleDeleteCoach(coach._id)}
                     className="group/btn relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-3 rounded-lg font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                     <span className="flex items-center justify-center relative z-10">
                       <Trash2 className="w-3 h-3" />
                     </span>
                     <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-600 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredCoaches.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center opacity-0 animate-fadeInUp" style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
            <div className="text-8xl mb-6 animate-bounce">👨‍🏫</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Aucun coach trouvé</h3>
            <p className="text-gray-600 mb-8 text-lg">
              {searchTerm || specialityFilter !== "all"
                ? "Essayez de modifier vos critères de recherche"
                : "Commencez par ajouter votre premier coach"}
            </p>
            <button
              onClick={handleCreateCoach}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Ajouter un coach
            </button>
          </div>
        )}

                                                                                                           {/* Modal formulaire coach - Version Très Grande */}
              {showCoachForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5">
                  <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full mx-5">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-3xl p-5 text-center">
                      <h2 className="text-xl font-bold text-white">
                        {editingCoach ? '✏️ Modifier le Coach' : '👨‍🏫 Nouveau Coach'}
                      </h2>
                    </div>

                    <div className="p-6">
                      <form onSubmit={handleFormSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="firstName"
                            defaultValue={editingCoach?.firstName || ''}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base"
                            placeholder="Prénom *"
                          />
                          <input
                            type="text"
                            name="lastName"
                            defaultValue={editingCoach?.lastName || ''}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base"
                            placeholder="Nom *"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="email"
                            name="email"
                            defaultValue={editingCoach?.email || ''}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base"
                            placeholder="Email *"
                          />
                          <select
                            name="speciality"
                            defaultValue={editingCoach?.speciality || ''}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base"
                          >
                            <option value="">Spécialité *</option>
                            {specialities.map((speciality) => (
                              <option key={speciality} value={speciality}>
                                {speciality}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="tel"
                            name="phone"
                            defaultValue={editingCoach?.phone || ''}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base"
                            placeholder="Téléphone"
                          />
                          <input
                            type="number"
                            name="experience"
                            min="0"
                            max="50"
                            defaultValue={editingCoach?.experience || editingCoach?.yearsOfExperience || ''}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base"
                            placeholder="Expérience"
                          />
                        </div>

                     <div className="grid grid-cols-2 gap-4">
                       <input
                         type="number"
                         name="rating"
                         min="0"
                         max="5"
                         step="0.1"
                         defaultValue={editingCoach?.rating || ''}
                         className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base"
                         placeholder="Note /5"
                       />
                       <textarea
                         name="bio"
                         rows="1"
                         defaultValue={editingCoach?.bio || ''}
                         className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base resize-none"
                         placeholder="Bio"
                       />
                     </div>

                     <div className="space-y-2">
                       <input
                         type="password"
                         name="password"
                         required={!editingCoach}
                         className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base"
                         placeholder={editingCoach ? "Laissez vide pour ne pas changer" : "Mot de passe *"}
                       />
                       <p className="text-xs text-gray-500">
                         {editingCoach 
                           ? "Laissez vide pour conserver le mot de passe actuel"
                           : "Si laissé vide, un mot de passe temporaire sera généré"
                         }
                       </p>
                     </div>

                        <div className="flex space-x-4 pt-4">
                          <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-3 px-5 rounded-xl text-base font-medium hover:bg-blue-700"
                          >
                            {editingCoach ? '💾 Modifier' : '✨ Créer'}
                          </button>
                          <button
                            type="button"
                            onClick={handleFormCancel}
                            className="px-5 py-3 bg-gray-500 text-white rounded-xl text-base font-medium hover:bg-gray-600"
                          >
                            Annuler
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
      </div>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate3d(0, -100%, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-none {
          display: block;
          -webkit-line-clamp: unset;
          -webkit-box-orient: unset;
          overflow: visible;
        }
      `}</style>
    </div>
  )
}

export default ManageCoaches


