import { useState, useEffect, useCallback } from "react"
import activityService from "../services/activityService"
import { useAuth } from "../context/AuthContext"
import { useLocation } from "react-router-dom"
import { Activity, Search, Filter, X, Clock, DollarSign, Star } from "lucide-react"

const Activities = () => {
  const [activities, setActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const categories = [
    {
      value: "all",
      label: "Toutes les catégories",
      icon: <Activity className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
    },
    { value: "Danse", label: "Danse", icon: <Activity className="w-5 h-5" />, color: "from-pink-500 to-rose-500" },
    {
      value: "Natation",
      label: "Natation",
      icon: <Activity className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "Fitness",
      label: "Fitness",
      icon: <Activity className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      value: "Équitation",
      label: "Équitation",
      icon: <Activity className="w-5 h-5" />,
      color: "from-amber-500 to-orange-500",
    },
    {
      value: "Musique",
      label: "Musique",
      icon: <Activity className="w-5 h-5" />,
      color: "from-violet-500 to-purple-500",
    },
    {
      value: "Arts Martiaux",
      label: "Arts Martiaux",
      icon: <Activity className="w-5 h-5" />,
      color: "from-red-500 to-pink-500",
    },
  ]

  const { isAdmin } = useAuth()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const showSuccess = searchParams.get("success") === "1"

  useEffect(() => {
    loadActivities()
  }, [])

  const applyFilters = useCallback(() => {
    let filtered = [...activities]

    if (activeCategory && activeCategory !== "all") {
      filtered = filtered.filter(
        (activity) =>
          activity.category &&
          typeof activity.category === "string" &&
          typeof activeCategory === "string" &&
          activity.category.trim().toLowerCase() === activeCategory.trim().toLowerCase(),
      )
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (activity) =>
          (activity.title?.toLowerCase() || "").includes(searchLower) ||
          (activity.description?.toLowerCase() || "").includes(searchLower) ||
          (activity.category?.toLowerCase() || "").includes(searchLower),
      )
    }

    setFilteredActivities(filtered)
  }, [activities, activeCategory, searchTerm])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const loadActivities = async () => {
    try {
      const data = await activityService.getAll()
      setActivities(data)
    } catch (error) {
      console.error("Erreur lors du chargement des activités:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
  }

  const handleCategoryChange = (categoryValue) => {
    setActiveCategory(categoryValue)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setActiveCategory("all")
  }

  const handleReservation = (activity) => {
    window.location.href = `/reservation/new?activityId=${activity._id}&activityName=${encodeURIComponent(activity.name)}`
  }

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity)
    setShowDetails(true)
  }

  const closeDetails = () => {
    setShowDetails(false)
    setSelectedActivity(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#003c3c] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-[#22b455] to-[#a0f000] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-[#a0f000] to-[#22b455] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-gradient-to-r from-[#22b455] to-[#003c3c] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent bg-gradient-to-r from-[#22b455] to-[#a0f000] mx-auto mb-6"></div>
              <div
                className="animate-spin rounded-full h-20 w-20 border-4 border-transparent bg-gradient-to-r from-[#22b455] to-[#a0f000] absolute top-0 left-1/2 transform -translate-x-1/2"
                style={{ clipPath: "inset(0 0 50% 0)" }}
              ></div>
            </div>
            <p className="text-xl text-white font-semibold">Chargement des activités...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#003c3c] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-[#22b455] to-[#a0f000] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-[#a0f000] to-[#22b455] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-gradient-to-r from-[#22b455] to-[#003c3c] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#22b455] to-[#a0f000] rounded-2xl mb-6 shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#22b455] via-[#a0f000] to-[#003c3c] bg-clip-text text-transparent mb-4">
            Nos Activités
          </h1>
          <p className="text-white text-lg max-w-2xl mx-auto leading-relaxed">
            Découvrez notre large gamme d'activités sportives adaptées à tous les niveaux
          </p>
        </div>

        <div className="bg-[#a0f000]/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 mb-8 border border-[#22b455]">
     
          <div className="mb-8">
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une activité..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/90 border border-[#22b455] rounded-2xl focus:ring-2 focus:ring-[#22b455] focus:border-[#22b455] text-black placeholder:text-black/60 transition-all duration-300 shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black hover:text-[#22b455] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-black" />
              <h2 className="text-xl font-semibold text-black">Filtrer par Catégorie</h2>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
                    activeCategory === category.value
                      ? `bg-gradient-to-r from-[#22b455] to-[#a0f000] text-white shadow-lg shadow-[#22b455]/25`
                      : "bg-white/80 text-black hover:bg-white border border-[#22b455] shadow-sm"
                  }`}
                >
                  {category.icon}
                  <span className="text-sm">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {(activeCategory !== "all" || searchTerm) && (
            <div className="text-center">
              <button
                onClick={clearFilters}
                className="bg-black text-white px-6 py-3 rounded-2xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
              >
                <X className="w-4 h-4" />
                Effacer les Filtres
              </button>
            </div>
          )}
        </div>
        {filteredActivities.length > 0 ? (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-[#a0f000]/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-[#22b455]">
                <Star className="w-5 h-5 text-[#22b455]" />
                <p className="text-black font-medium">
                  {activeCategory === "all"
                    ? `${filteredActivities.length} activité${filteredActivities.length > 1 ? "s" : ""} trouvée${filteredActivities.length > 1 ? "s" : ""}`
                    : `${filteredActivities.length} activité${filteredActivities.length > 1 ? "s" : ""} dans "${activeCategory}"`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredActivities.map((activity, index) => (
                <div
                  key={activity._id || activity.id}
                  className="group bg-[#92e5a1]/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-[#22b455] hover:shadow-2xl hover:shadow-[#22b455]/20 transition-all duration-500 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-black mb-2 group-hover:text-[#22b455] transition-colors">
                        {String(activity.name || "Activité sans nom")}
                      </h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#22b455] to-[#a0f000] text-white border border-[#22b455]">
                        {String(activity.category || "N/A")}
                      </span>
                      <div className="mt-2 text-xs text-black flex items-center gap-2">
                        <span>📍 {String(activity.location || "")}</span>
                        {activity.coach && (
                          <>
                            <span>•</span>
                            <span>👤 {String(activity.coach.firstName || "")} {String(activity.coach.lastName || "")}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-black text-sm mb-4 line-clamp-2">
                    {String(activity.description || "Aucune description")}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#22b455]" />
                        <span className="text-black font-semibold">{String(activity.price || 0)} DH</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#22b455]" />
                        <span className="text-black text-sm">{String(activity.duration || 0)} min</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#22b455]/30">
                      <span className="text-black/70 text-xs">Niveau</span>
                      <span className="text-black text-sm font-medium">{String(activity.level || "N/A")}</span>
                    </div>

                    <div className="pt-4 space-y-2">
                      <button
                        onClick={() => handleReservation(activity)}
                        className="w-full bg-gradient-to-r from-[#22b455] to-[#a0f000] text-white py-2 px-4 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl hover:from-[#a0f000] hover:to-[#22b455] transition-all duration-300 transform hover:scale-105"
                      >
                        Réserver Maintenant
                      </button>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-[#22b455]/5 to-[#a0f000]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#a0f000]/90 backdrop-blur-xl rounded-3xl shadow-xl p-16 text-center border border-[#22b455]">
            <div className="w-24 h-24 bg-gradient-to-r from-[#22b455] to-[#a0f000] rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-[#22b455] to-[#a0f000] bg-clip-text text-transparent mb-4">
              Aucune Activité Trouvée
            </h3>
            <p className="text-black text-lg mb-8 max-w-md mx-auto">
              {activeCategory === "all"
                ? "Aucune activité n'est disponible pour le moment."
                : `Aucune activité dans la catégorie "${activeCategory}" n'est disponible.`}
            </p>
            {activeCategory !== "all" && (
              <button
                onClick={clearFilters}
                className="bg-black text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
              >
                Voir Toutes les Activités
              </button>
            )}
          </div>
        )}
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
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
                 }
       `}</style>

       {showDetails && selectedActivity && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div 
             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
             onClick={closeDetails}
           />
           
           <div className="relative bg-[#a0f000]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#22b455] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
             <div className="sticky top-0 bg-[#a0f000]/80 backdrop-blur-xl rounded-t-3xl p-6 border-b border-[#22b455]">
               <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-bold bg-gradient-to-r from-[#22b455] to-[#a0f000] bg-clip-text text-transparent">
                   {String(selectedActivity.name || 'Activité sans nom')}
                 </h2>
                 <button
                   onClick={closeDetails}
                   className="p-2 hover:bg-[#22b455]/20 rounded-full transition-colors"
                 >
                   <X className="w-6 h-6 text-black" />
                 </button>
               </div>
             </div>

             <div className="p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                 <div>
                   <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                     <Activity className="w-5 h-5 text-[#22b455]" />
                     Informations
                   </h3>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                       <span className="font-medium text-black">Catégorie:</span>
                       <span className="text-black">{String(selectedActivity.category || 'N/A')}</span>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                       <span className="font-medium text-black">Coach:</span>
                       <span className="text-black">
                         {selectedActivity.coach && (selectedActivity.coach.firstName || selectedActivity.coach.lastName)
                           ? `${selectedActivity.coach.firstName || ''} ${selectedActivity.coach.lastName || ''}`.trim()
                           : 'N/A'}
                       </span>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                       <span className="font-medium text-black">Prix:</span>
                       <span className="text-black font-semibold">{String(selectedActivity.price || 0)} DH</span>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                       <span className="font-medium text-black">Durée:</span>
                       <span className="text-black">{String(selectedActivity.duration || 0)} min</span>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                       <span className="font-medium text-black">Niveau:</span>
                       <span className="text-black">{String(selectedActivity.level || 'N/A')}</span>
                     </div>
                   </div>
                 </div>

                 <div>
                   <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                     <Star className="w-5 h-5 text-[#22b455]" />
                     Description
                   </h3>
                   <div className="p-4 bg-white/50 rounded-xl">
                     <p className="text-black leading-relaxed">
                       {String(selectedActivity.description || 'Aucune description disponible')}
                     </p>
                   </div>
                 </div>
               </div>

               {selectedActivity.schedule && selectedActivity.schedule.length > 0 && (
                 <div className="mb-8">
                   <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                     <Clock className="w-5 h-5 text-[#22b455]" />
                     Horaires
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {selectedActivity.schedule.map((session, index) => (
                       <div key={index} className="bg-gradient-to-r from-white/50 to-[#22b455]/20 p-4 rounded-xl border border-[#22b455]">
                         <p className="font-medium text-black">{String(session.day || 'N/A')}</p>
                         <p className="text-[#22b455]">{String(session.startTime || 'N/A')} - {String(session.endTime || 'N/A')}</p>
                         <p className="text-sm text-black/70">Max: {String(session.maxParticipants || 0)} participants</p>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#22b455]">
                 <button
                   onClick={() => handleReservation(selectedActivity)}
                   className="flex-1 bg-black text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                 >
                   Choisir Horaire
                 </button>
                 <button
                   onClick={closeDetails}
                   className="px-6 py-3 border border-[#22b455] text-black rounded-xl font-medium hover:bg-[#22b455]/20 transition-colors"
                 >
                   Fermer
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }

export default Activities

