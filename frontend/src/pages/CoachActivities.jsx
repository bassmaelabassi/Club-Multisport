import { useState, useEffect } from "react"
import activityService from "../services/activityService"
import { useAuth } from "../context/AuthContext"
import ActivityForm from "../components/ActivityForm"

const ACTIVITY_CATEGORIES = [
  { value: "danse", label: "Danse" },
  { value: "musique", label: "Musique" },
  { value: "natation", label: "Natation" },
  { value: "fitness", label: "Fitness" },
  { value: "yoga", label: "Yoga" },
  { value: "autre", label: "Autre" },
]

const DAYS_OF_WEEK = [
  { value: "lundi", label: "Lundi" },
  { value: "mardi", label: "Mardi" },
  { value: "mercredi", label: "Mercredi" },
  { value: "jeudi", label: "Jeudi" },
  { value: "vendredi", label: "Vendredi" },
  { value: "samedi", label: "Samedi" },
  { value: "dimanche", label: "Dimanche" },
]

const INITIAL_FORM_STATE = {
  name: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  location: "",
  maxParticipants: "",
  schedule: [{ day: "", startTime: "", endTime: "", maxParticipants: 1 }],
  image: "",
}

const CoachActivities = () => {
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [allActivities, setAllActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadActivities()
  }, [user?._id])

  const loadActivities = async () => {
    try {
      setLoading(true)
      const [mine, all] = await Promise.all([activityService.getByCoach(user?._id), activityService.getAll()])
      setActivities(mine || [])
      setAllActivities(all || [])
    } catch (error) {
      console.error("Erreur lors du chargement des activités:", error)
      alert("Erreur lors du chargement des activités")
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    const isEmptyString = (value) => {
      if (typeof value !== "string") return true
      return !value.trim()
    }

    if (isEmptyString(formData.name)) newErrors.name = "Le nom est requis"
    if (!formData.category) newErrors.category = "La catégorie est requise"
    if (isEmptyString(formData.description)) newErrors.description = "La description est requise"
    if (!formData.price || formData.price <= 0) newErrors.price = "Le prix doit être supérieur à 0"
    if (!formData.duration || formData.duration < 15) newErrors.duration = "La durée minimum est de 15 minutes"
    if (isEmptyString(formData.location)) newErrors.location = "Le lieu est requis"
    if (!formData.maxParticipants || formData.maxParticipants < 1)
      newErrors.maxParticipants = "Il faut au moins 1 participant"

    if (formData.schedule.length === 0) {
      newErrors.schedule = "Au moins un créneau horaire est requis"
    } else {
      formData.schedule.forEach((session, index) => {
        if (!session.day) newErrors[`schedule.${index}.day`] = "Le jour est requis"
        if (!session.startTime) newErrors[`schedule.${index}.startTime`] = "L'heure de début est requise"
        if (!session.endTime) newErrors[`schedule.${index}.endTime`] = "L'heure de fin est requise"
        if (session.startTime && session.endTime && session.startTime >= session.endTime) {
          newErrors[`schedule.${index}.endTime`] = "L'heure de fin doit être après l'heure de début"
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      alert("Veuillez corriger les erreurs dans le formulaire")
      return
    }

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        maxParticipants: Number(formData.maxParticipants),
        schedule: formData.schedule.map((s) => ({
          ...s,
          maxParticipants: Number(s.maxParticipants),
        })),
      }

      console.log("=== FRONTEND DEBUG ===")
      console.log("Form data:", formData)
      console.log("Payload to send:", payload)

      if (editingActivity) {
        await activityService.update(editingActivity._id, payload)
        alert("Activité mise à jour avec succès !")
      } else {
        await activityService.create(payload)
        alert("Activité créée avec succès !")
      }
      closeForm()
      loadActivities()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      console.error("Error details:", error.response?.data)
      alert("Erreur lors de la sauvegarde de l'activité")
    }
  }

  const handleEdit = (activity) => {
    setEditingActivity(activity)
    setShowForm(true)
    setErrors({})
  }

  const handleDelete = async (activityId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      try {
        await activityService.delete(activityId)
        alert("Activité supprimée avec succès !")
        loadActivities()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        alert("Erreur lors de la suppression de l'activité")
      }
    }
  }

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingActivity(null)
    setFormData(INITIAL_FORM_STATE)
    setErrors({})
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.schedule]
    newSchedule[index] = { ...newSchedule[index], [field]: value }
    setFormData((prev) => ({ ...prev, schedule: newSchedule }))
    setErrors((prev) => ({ ...prev, [`schedule.${index}.${field}`]: "" }))
  }

  const addScheduleItem = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { day: "", startTime: "", endTime: "", maxParticipants: 1 }],
    }))
  }

  const removeScheduleItem = (index) => {
    const newSchedule = formData.schedule.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, schedule: newSchedule }))
  }

  const openCreateForm = () => {
    setShowForm(true)
    setEditingActivity(null)
    setFormData(INITIAL_FORM_STATE)
    setErrors({})
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 min-h-screen flex items-center justify-center" style={{ backgroundColor: "#141414" }}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4" style={{ borderColor: "#143c3c" }}></div>
            <div
              className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent absolute top-0 left-0 animate-pulse"
              style={{ borderColor: "#a0f000" }}
            ></div>
          </div>
          <div className="font-medium animate-pulse" style={{ color: "#a0f000" }}>
            Chargement des activités...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 min-h-screen" style={{ backgroundColor: "#141414" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold" style={{ color: "#a0f000" }}>
            Gestion des activités
          </h1>
          <button
            onClick={openCreateForm}
            className="text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
            style={{
              backgroundColor: "#003c3c",
              boxShadow: "0 4px 15px rgba(160, 240, 0, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#143c3c"
              e.target.style.boxShadow = "0 6px 20px rgba(160, 240, 0, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#003c3c"
              e.target.style.boxShadow = "0 4px 15px rgba(160, 240, 0, 0.3)"
            }}
          >
            ✨ Créer une activité
          </button>
        </div>

        {showForm && (
          <div className="animate-slide-in-down">
            <ActivityForm
              onSubmit={async (data) => {
                try {
                  if (editingActivity) {
                    await activityService.update(editingActivity._id, data)
                  } else {
                    await activityService.create(data)
                  }
                  closeForm()
                  loadActivities()
                } catch (err) {
                  console.error("Erreur sauvegarde activité (coach):", err)
                  alert("Erreur lors de la sauvegarde de l'activité")
                }
              }}
              onCancel={closeForm}
              activity={editingActivity}
              mode={editingActivity ? "edit" : "create"}
              userRole={"coach"}
            />
                </div>
        )}

        {selectedActivity && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          >
            <div
              className="shadow-2xl rounded-2xl p-8 mb-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-scale-in"
              style={{ backgroundColor: "#000000" }}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold" style={{ color: "#a0f000" }}>
                  {selectedActivity.name}
                </h2>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="text-2xl transition-colors duration-200 hover:rotate-90 transform"
                  style={{ color: "#143c3c" }}
                  onMouseEnter={(e) => (e.target.style.color = "#a0f000")}
                  onMouseLeave={(e) => (e.target.style.color = "#143c3c")}
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg pb-2 border-b" style={{ color: "#003c3c", borderColor: "#143c3c" }}>
                    Informations
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#a0f000" }}></span>
                      <span className="font-medium" style={{ color: "#a0f000" }}>
                        Catégorie:
                      </span>
                      <span
                        className="px-2 py-1 rounded-full text-sm"
                        style={{ backgroundColor: "#003c3c", color: "#a0f000" }}
                      >
                        {selectedActivity.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#143c3c" }}></span>
                      <span className="font-medium" style={{ color: "#a0f000" }}>
                        Prix:
                      </span>
                      <span className="font-bold" style={{ color: "#a0f000" }}>
                        {selectedActivity.price} DH
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#003c3c" }}></span>
                      <span className="font-medium" style={{ color: "#a0f000" }}>
                        Durée:
                      </span>
                      <span style={{ color: "#143c3c" }}>{selectedActivity.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#a0f000" }}></span>
                      <span className="font-medium" style={{ color: "#a0f000" }}>
                        Lieu:
                      </span>
                      <span style={{ color: "#143c3c" }}>{selectedActivity.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#003c3c" }}></span>
                      <span className="font-medium" style={{ color: "#a0f000" }}>
                        Participants max:
                      </span>
                      <span style={{ color: "#143c3c" }}>{selectedActivity.maxParticipants}</span>
              </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#143c3c" }}></span>
                      <span className="font-medium" style={{ color: "#a0f000" }}>
                        Participants actuels:
                      </span>
                      <span style={{ color: "#143c3c" }}>{selectedActivity.currentParticipants || 0}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#a0f000" }}></span>
                  <span className="font-medium" style={{ color: "#a0f000" }}>
                    Coach:
                  </span>
                  <span style={{ color: "#143c3c" }}>
                    {selectedActivity.coach?.firstName || ""} {selectedActivity.coach?.lastName || ""}
                  </span>
                </div>
                </div>
                </div>
                <div>
                  <h3
                    className="font-bold text-lg pb-2 mb-4 border-b"
                    style={{ color: "#003c3c", borderColor: "#143c3c" }}
                  >
                    Description
                  </h3>
                  <p className="leading-relaxed" style={{ color: "#143c3c" }}>
                    {selectedActivity.description}
                  </p>
                </div>
              </div>

              {selectedActivity.schedule && selectedActivity.schedule.length > 0 && (
                <div className="mt-8">
                  <h3
                    className="font-bold text-lg pb-2 mb-4 border-b"
                    style={{ color: "#003c3c", borderColor: "#143c3c" }}
                  >
                    Horaires
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedActivity.schedule.map((session, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 rounded-xl transition-shadow duration-200 hover:shadow-lg"
                        style={{
                          backgroundColor: "#003c3c",
                          border: `1px solid #143c3c`,
                        }}
                      >
                        <span className="font-semibold" style={{ color: "#a0f000" }}>
                          {session.day}
                        </span>
                        <span style={{ color: "#ffffff" }}>
                          {session.startTime} - {session.endTime}
                        </span>
                        <span
                          className="text-sm px-2 py-1 rounded-full"
                          style={{ color: "#000000", backgroundColor: "#a0f000" }}
                        >
                          Max: {session.maxParticipants}
                        </span>
                    </div>
                    ))}
                  </div>
              </div>
              )}
              </div>
          </div>
        )}

        <div
          className="shadow-xl rounded-2xl overflow-hidden mb-8 animate-fade-in-up"
          style={{ backgroundColor: "#000000" }}
        >
          <div className="px-8 py-6 text-white" style={{ backgroundColor: "#003c3c" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <span>🎯</span>
                <span style={{ color: "#a0f000" }}>Mes activités</span>
              </h2>
              <button
                onClick={openCreateForm}
                className="px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 font-medium"
                style={{
                  backgroundColor: "rgba(160, 240, 0, 0.2)",
                  color: "#a0f000",
                  border: `1px solid #a0f000`,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#a0f000"
                  e.target.style.color = "#000000"
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(160, 240, 0, 0.2)"
                  e.target.style.color = "#a0f000"
                }}
              >
                + Nouvelle activité
              </button>
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {activities.map((a, index) => (
              <div
                key={a._id}
                className="group rounded-2xl p-8 min-h-72 shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{
                  backgroundColor: "#141414",
                  border: `2px solid #143c3c`,
                  animationDelay: `${index * 100}ms`,
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#a0f000"
                  e.target.style.boxShadow = "0 20px 40px rgba(160, 240, 0, 0.2)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#143c3c"
                  e.target.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)"
                }}
              >
                <div className="font-bold text-2xl mb-3 transition-colors duration-200" style={{ color: "#a0f000" }}>
                  {a.name}
                </div>
                <div className="text-sm mb-3 flex items-center space-x-2" style={{ color: "#143c3c" }}>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "#003c3c", color: "#a0f000" }}
                  >
                    {a.category}
                  </span>
                  <span>•</span>
                  <span style={{ color: "#a0f000" }}>📍 {a.location}</span>
                  {a.coach && (
                    <>
                      <span>•</span>
                      <span style={{ color: "#93d400" }}>
                        👤 {a.coach.firstName || ""} {a.coach.lastName || ""}
                      </span>
                    </>
                  )}
              </div>
                <div className="flex items-center justify-between text-xs sm:text-sm mb-3" style={{ color: "#a0f000" }}>
                  <span>Prix: <span style={{ color: "#93d400" }}>{Number(a.price) || 0} DH</span></span>
                  <span>Durée: <span style={{ color: "#93d400" }}>{Number(a.duration) || 0} min</span></span>
              </div>
                <div className="text-sm mb-4 line-clamp-3" style={{ color: "#143c3c" }}>
                  {a.description}
            </div>
                {Array.isArray(a.schedule) && a.schedule.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <div className="text-xs font-semibold" style={{ color: "#a0f000" }}>Horaires</div>
                    {a.schedule.slice(0, 2).map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-xs rounded-lg px-3 py-2" style={{ backgroundColor: "#0e1b1b", color: "#93d400", border: "1px solid #143c3c" }}>
                        <span className="capitalize">{String(s.day)}</span>
                        <span style={{ color: "#cfe97a" }}>{String(s.startTime)} - {String(s.endTime)}</span>
                        <span style={{ color: "#93d400" }}>Max {Number(s.maxParticipants) || 0}</span>
                    </div>
                  ))}
                    {a.schedule.length > 2 && (
                      <div className="text-xs" style={{ color: "#93d400" }}>+ {a.schedule.length - 2} autres créneaux</div>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedActivity(a)}
                    className="flex-1 px-4 py-2 text-sm rounded-xl transition-all duration-200 transform hover:scale-105 font-medium"
                    style={{ backgroundColor: "#a0f000", color: "#000000" }}
                  >
                    Voir détails
                  </button>
                  <button
                    onClick={() => handleEdit(a)}
                    className="flex-1 px-4 py-2 text-sm text-white rounded-xl transition-all duration-200 transform hover:scale-105 font-medium"
                    style={{ backgroundColor: "#003c3c" }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#a0f000"
                      e.target.style.color = "#000000"
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#003c3c"
                      e.target.style.color = "#ffffff"
                    }}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="flex-1 px-4 py-2 text-sm rounded-xl transition-all duration-200 transform hover:scale-105 font-medium"
                    style={{ backgroundColor: "#143c3c", color: "#a0f000" }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#a0f000"
                      e.target.style.color = "#000000"
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#143c3c"
                      e.target.style.color = "#a0f000"
                    }}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="shadow-xl rounded-2xl overflow-hidden animate-fade-in-up"
          style={{
            backgroundColor: "#000000",
            animationDelay: "200ms",
          }}
        >
          <div className="px-8 py-6 text-white" style={{ backgroundColor: "#143c3c" }}>
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <span>🌟</span>
              <span style={{ color: "#a0f000" }}>Toutes les activités</span>
            </h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {allActivities.map((a, index) => (
              <div
                key={a._id}
                className="group rounded-2xl p-8 min-h-72 shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer animate-fade-in-up"
                style={{
                  backgroundColor: "#141414",
                  border: `2px solid #003c3c`,
                  animationDelay: `${(index + activities.length) * 100}ms`,
                }}
                onClick={() => handleViewDetails(a)}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#a0f000"
                  e.target.style.boxShadow = "0 20px 40px rgba(160, 240, 0, 0.2)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#003c3c"
                  e.target.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)"
                }}
              >
                <div className="font-bold text-2xl mb-3 transition-colors duration-200" style={{ color: "#a0f000" }}>
                  {a.name}
                </div>
                <div className="text-sm mb-3 flex items-center space-x-2" style={{ color: "#143c3c" }}>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "#143c3c", color: "#a0f000" }}
                  >
                    {a.category}
                  </span>
                  <span>•</span>
                  <span style={{ color: "#a0f000" }}>📍 {a.location}</span>
                  {a.coach && (
                    <>
                      <span>•</span>
                      <span style={{ color: "#93d400" }}>
                        👤 {a.coach.firstName || ""} {a.coach.lastName || ""}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm mb-3" style={{ color: "#a0f000" }}>
                  <span>Prix: <span style={{ color: "#93d400" }}>{Number(a.price) || 0} DH</span></span>
                  <span>Durée: <span style={{ color: "#93d400" }}>{Number(a.duration) || 0} min</span></span>
                </div>
                <div className="text-sm line-clamp-3" style={{ color: "#143c3c" }}>
                  {a.description}
                </div>
                {Array.isArray(a.schedule) && a.schedule.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-semibold" style={{ color: "#a0f000" }}>Horaires</div>
                    {a.schedule.slice(0, 2).map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-xs rounded-lg px-3 py-2" style={{ backgroundColor: "#0e1b1b", color: "#93d400", border: "1px solid #143c3c" }}>
                        <span className="capitalize">{String(s.day)}</span>
                        <span style={{ color: "#cfe97a" }}>{String(s.startTime)} - {String(s.endTime)}</span>
                        <span style={{ color: "#93d400" }}>Max {Number(s.maxParticipants) || 0}</span>
                      </div>
                    ))}
                    {a.schedule.length > 2 && (
                      <div className="text-xs" style={{ color: "#93d400" }}>+ {a.schedule.length - 2} autres créneaux</div>
                    )}
                  </div>
                )}
                <div className="mt-4 text-xs font-medium transition-colors duration-200" style={{ color: "#003c3c" }}>
                  Cliquez pour voir les détails →
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-in-down {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-slide-in-down {
          animation: slide-in-down 0.4s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default CoachActivities 