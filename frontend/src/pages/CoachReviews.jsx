import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import api, { API_URLS } from "../services/api"
import activityService from "../services/activityService"

const CoachReviews = () => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    loadReviews()
  }, [user?._id])

  const loadReviews = async () => {
    try {
      setLoading(true)
      if (!user?._id) {
        setReviews([])
        setLoading(false)
        return
      }

      const activities = await activityService.getByCoach(user._id)

      const reviewsByActivity = await Promise.all(
        (activities || []).map(async (act) => {
          try {
            const resp = await api.get(`${API_URLS.REVIEWS}/activity/${act._id}`)
            const list = Array.isArray(resp.data) ? resp.data : []
            return list.map((r) => ({
              id: r._id || r.id,
              userId: r.userId?._id || r.userId || null,
              userName: `${r.userId?.firstName || ''} ${r.userId?.lastName || ''}`.trim() || 'Utilisateur',
              rating: Number(r.rating) || 0,
              comment: r.comment,
              activityName: act.name || 'Activité',
              date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : ''
            }))
          } catch (e) {
            console.warn('Impossible de charger les avis pour activité', act._id)
            return []
          }
        })
      )

      const aggregated = reviewsByActivity.flat()
      setReviews(aggregated)
    } catch (error) {
      console.error("Erreur lors du chargement des avis:", error)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`h-5 w-5 transition-all duration-300 ${
          i < rating ? "fill-amber-400 text-amber-400 scale-110" : "text-slate-300"
        }`}
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 0
    const total = reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0)
    return (total / reviews.length).toFixed(1)
  }

  const uniqueCount = (list) => {
    const keys = list.map((r) => r.userId || r.userName)
    return new Set(keys).size
  }

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true
    if (filter === "positive") return (Number(review.rating) || 0) >= 4
    if (filter === "negative") return (Number(review.rating) || 0) <= 2
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003c3c] via-[#143c3c] to-[#003c3c] flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-border"></div>
          <div className="absolute inset-2 bg-white rounded-full"></div>
          <div className="absolute inset-4 animate-pulse bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003c3c] via-[#143c3c] to-[#003c3c] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center md:text-left bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent animate-fade-in">
          Avis et Évaluations
        </h1>

        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-8 border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                {uniqueCount(reviews)}
              </div>
              <div className="text-sm text-slate-600 font-medium">Utilisateurs ayant donné un avis</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                {getAverageRating()}
              </div>
              <div className="text-sm text-slate-600 font-medium">Note moyenne</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                {uniqueCount(reviews.filter((r) => (Number(r.rating) || 0) >= 4))}
              </div>
              <div className="text-sm text-slate-600 font-medium">Avis positifs (utilisateurs)</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                filter === "all"
                  ? "bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-lg shadow-teal-500/25"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md"
              }`}
            >
              Tous ({uniqueCount(reviews)})
            </button>
            <button
              onClick={() => setFilter("positive")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                filter === "positive"
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/25"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md"
              }`}
            >
              Positifs ({uniqueCount(reviews.filter((r) => (Number(r.rating) || 0) >= 4))})
            </button>
            <button
              onClick={() => setFilter("negative")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                filter === "negative"
                  ? "bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-lg shadow-red-500/25"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md"
              }`}
            >
              Négatifs ({uniqueCount(reviews.filter((r) => (Number(r.rating) || 0) <= 2))})
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-teal-50 to-emerald-50">
            <h2 className="text-2xl font-bold text-slate-800">Avis sur vos activités</h2>
            <p className="text-slate-600 mt-2">Consultez les retours de vos membres pour améliorer vos services.</p>
          </div>

          <div className="p-6">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v1.306z"
                    />
                  </svg>
                </div>
                <p className="text-slate-500 text-lg">Aucun avis à afficher pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredReviews.map((review, index) => (
                  <div
                    key={review.id || index}
                    className="border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-teal-200 transition-all duration-500 transform hover:-translate-y-1 bg-gradient-to-r from-white to-slate-50/50 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg hover:scale-110 transition-transform duration-300">
                        {(review.userName || 'U').charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <div>
                            <div className="font-bold text-xl text-slate-800">{review.userName || 'Utilisateur'}</div>
                            <div className="text-sm font-medium text-teal-700 bg-teal-50 px-3 py-1 rounded-full inline-block mt-1">
                              {review.activityName || 'Activité'}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{review.date || ''}</div>
                          </div>
                          <div
                            className="flex items-center gap-1 mt-3 sm:mt-0 bg-amber-50 px-3 py-2 rounded-full"
                            role="img"
                            aria-label={`${review.rating} étoiles sur 5`}
                          >
                            {renderStars(Number(review.rating) || 0)}
                            <span className="ml-2 text-sm font-semibold text-slate-700">({Number(review.rating) || 0}/5)</span>
                          </div>
                        </div>
                        <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border-l-4 border-teal-500">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  )
}

export default CoachReviews
