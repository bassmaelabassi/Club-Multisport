import { useState, useEffect } from "react"
import { X, Save, Calendar, MapPin, DollarSign, Clock, Users, FileText, Plus, Trash2, UserPlus, Settings, Edit } from "lucide-react"

const ActivityForm = ({ onSubmit, onCancel, activity, mode, userRole }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    price: 0,
    duration: 60,
    coach: "",
    schedule: [
      {
        id: "1",
        maxParticipants: 10,
        day: "lundi",
        startTime: "09:00",
        endTime: "10:00",
        participants: [],
      },
    ],
    isActive: true,
    image: "",
  })

  const [availableCoaches, setAvailableCoaches] = useState([])
  const [isAdmin] = useState(userRole === "admin")
  const isCoach = !isAdmin

  useEffect(() => {
    if (activity && mode === "edit") {
      const safeActivity = {
        name: activity.name || "",
        description: activity.description || "",
        category: activity.category || "",
        location: activity.location || "",
        price: activity.price || 0,
        duration: activity.duration || 60,
        coach: activity.coach || "",
        schedule: (activity.schedule || []).map(schedule => ({
          id: schedule.id || Date.now().toString(),
          maxParticipants: schedule.maxParticipants || 10,
          day: schedule.day || "lundi",
          startTime: schedule.startTime || "09:00",
          endTime: schedule.endTime || "10:00",
          participants: schedule.participants || [],
        })),
        isActive: activity.isActive !== undefined ? activity.isActive : true,
        image: activity.image || "",
      };
      
      console.log('Données d\'activité sécurisées:', safeActivity);
      setFormData(safeActivity);
    }

    if (isAdmin) {
      loadAvailableCoaches();
    }
  }, [activity, mode, isAdmin])

  const loadAvailableCoaches = async () => {
    try {
      const coaches = [
        { id: "1", name: "Coach Ahmed", email: "ahmed@example.com" },
        { id: "2", name: "Coach Fatima", email: "fatima@example.com" },
        { id: "3", name: "Coach Karim", email: "karim@example.com" },
      ];
      setAvailableCoaches(coaches);
    } catch (error) {
      console.error("Erreur lors du chargement des coachs:", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const errors = []
    
    if (!formData.name.trim()) {
      errors.push("Le nom de l'activité est requis")
    }
    
    if (!formData.category.trim()) {
      errors.push("La catégorie est requise")
    }
    
    if (!formData.location.trim()) {
      errors.push("Le lieu est requis")
    }
    
    if (formData.price < 0) {
      errors.push("Le prix doit être positif")
    }
    
    if (formData.duration < 15) {
      errors.push("La durée doit être d'au moins 15 minutes")
    }
    
    if (isAdmin && !formData.coach.trim()) {
      errors.push("Le coach est requis")
    }
    
    if (!formData.schedule || formData.schedule.length === 0) {
      errors.push("Au moins un planning est requis")
    }
    
    formData.schedule.forEach((schedule, index) => {
      if (!schedule.day) {
        errors.push(`Le jour du planning ${index + 1} est requis`)
      }
      if (!schedule.startTime) {
        errors.push(`L'heure de début du planning ${index + 1} est requise`)
      }
      if (!schedule.endTime) {
        errors.push(`L'heure de fin du planning ${index + 1} est requise`)
      }
      if (schedule.maxParticipants < 1) {
        errors.push(`Le nombre maximum de participants du planning ${index + 1} doit être au moins 1`)
      }
    })
    
    if (errors.length > 0) {
      alert("Erreurs de validation:\n" + errors.join("\n"))
      return
    }
        const cleanData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: validateCategory(formData.category),
      location: formData.location.trim(),
      coach: formData.coach?.trim(),
      price: Number(formData.price),
      duration: Number(formData.duration),
      isActive: Boolean(formData.isActive),
      image: formData.image.trim() || undefined,
      schedule: formData.schedule.map(schedule => ({
        day: schedule.day.toLowerCase(),
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        maxParticipants: Number(schedule.maxParticipants)
      }))
    }
    
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === undefined) {
        delete cleanData[key]
      }
    })
    
    let finalData = cleanDataForBackend(cleanData)
    if (!isAdmin) {
      const { coach, ...rest } = finalData
      finalData = rest
    }
    
    console.log('Données validées et nettoyées:', finalData)
    onSubmit(finalData)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const categories = [
    "danse",
    "musique",
    "natation",
    "équitation",
    "fitness",
    "yoga",
    "autre",
  ]

  const [customCategories, setCustomCategories] = useState([])
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim()
    if (trimmedCategory && !categories.includes(trimmedCategory) && !customCategories.includes(trimmedCategory)) {
      const cleanCategory = trimmedCategory.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim()
      if (cleanCategory) {
        setCustomCategories([...customCategories, cleanCategory])
        setNewCategory("")
        setShowAddCategory(false)
        console.log('Nouvelle catégorie ajoutée:', cleanCategory)
      }
    }
  }

  const debugFormData = () => {
    console.log('=== DEBUG FORM DATA ===')
    console.log('formData brut:', formData)
    console.log('Categories disponibles:', allCategories)
    console.log('Catégorie sélectionnée:', formData.category)
    console.log('Type de catégorie:', typeof formData.category)
    console.log('Catégorie dans la liste:', allCategories.includes(formData.category))
    console.log('Catégories par défaut:', categories)
    console.log('Catégories personnalisées:', customCategories)
    
    if (formData.category) {
      const isValidCategory = allCategories.includes(formData.category)
      console.log('Catégorie valide:', isValidCategory)
      if (!isValidCategory) {
        console.warn('⚠️ Catégorie non reconnue par le backend!')
        console.warn('Catégories acceptées:', allCategories)
      }
    }
        console.log('--- DONNÉES POUR BACKEND ---')
    const testData = {
      ...formData,
      category: validateCategory(formData.category),
      schedule: formData.schedule.map(schedule => ({
        day: schedule.day.toLowerCase(),
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        maxParticipants: Number(schedule.maxParticipants),
        participants: (schedule.participants || []).map(participant => ({
          name: participant.name.trim(),
          email: participant.email.trim().toLowerCase(),
          phone: participant.phone ? participant.phone.trim() : undefined
        }))
      }))
    }
    
    const finalTestData = cleanDataForBackend(testData)
    console.log('Données finales (sans champs non autorisés):', finalTestData)
    console.log('=======================')
  }
  const allCategories = [...categories, ...customCategories].filter(Boolean)
  const validateCategory = (category) => {
    const validCategories = [
      "danse", "musique", "natation", "équitation", "fitness", "yoga", "autre"
    ]
    
    if (validCategories.includes(category.toLowerCase())) {
      return category.toLowerCase()
    }
    
    if (customCategories.includes(category.toLowerCase())) {
      return category.toLowerCase()
    }
        console.warn(`Catégorie "${category}" non reconnue, utilisation de "autre" par défaut`)
    return "autre"
  }

  const cleanDataForBackend = (data) => {
    const { id, _id, __v, createdAt, updatedAt, ...cleanData } = data
    
    if (cleanData.schedule) {
      cleanData.schedule = cleanData.schedule.map(schedule => {
        const { id: scheduleId, _id: scheduleMongoId, ...cleanSchedule } = schedule
        
        if (cleanSchedule.participants) {
          cleanSchedule.participants = cleanSchedule.participants.map(participant => {
            const { id: participantId, _id: participantMongoId, ...cleanParticipant } = participant
            return cleanParticipant
          })
        }
        
        return cleanSchedule
      })
    }
    
    return cleanData
  }

  const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]

  const addSchedule = () => {
    const newSchedule = {
      id: Date.now().toString(),
      maxParticipants: 10,
      day: "lundi",
      startTime: "09:00",
      endTime: "10:00",
      participants: [],
    }
    setFormData((prev) => ({
      ...prev,
      schedule: [...(prev.schedule || []), newSchedule],
    }))
  }

  const removeSchedule = (scheduleId) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule?.filter((s) => s.id !== scheduleId) || [],
    }))
  }

  const addParticipant = (scheduleId) => {
    const newParticipant = {
      id: Date.now().toString(),
      name: "",
      email: "",
      phone: "",
    }
    setFormData((prev) => ({
      ...prev,
      schedule:
        prev.schedule?.map((s) =>
          s.id === scheduleId ? { 
            ...s, 
            participants: [...(s.participants || []), newParticipant] 
          } : s,
        ) || [],
    }))
  }

  const removeParticipant = (scheduleId, participantId) => {
    setFormData((prev) => ({
      ...prev,
      schedule:
        prev.schedule?.map((s) =>
          s.id === scheduleId ? { 
            ...s, 
            participants: (s.participants || []).filter((p) => p.id !== participantId) 
          } : s,
        ) || [],
    }))
  }

  const updateParticipant = (scheduleId, participantId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      schedule:
        prev.schedule?.map((s) =>
          s.id === scheduleId
            ? {
                ...s,
                participants: (s.participants || []).map((p) => (p.id === participantId ? { ...p, [field]: value } : p)),
              }
            : s,
        ) || [],
    }))
  }

  const updateSchedule = (scheduleId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule?.map((s) => (s.id === scheduleId ? { ...s, [field]: value } : s)) || [],
    }))
  }

  return (
    <div className={`fixed inset-0 ${isCoach ? 'bg-black/70' : 'bg-black/60'} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`${isCoach ? 'bg-white' : 'bg-white/90'} backdrop-blur-sm rounded-2xl shadow-2xl ${isCoach ? 'border border-gray-200' : 'border border-white/30'} w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
        <div className={`${isCoach ? 'bg-white' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'} p-6 rounded-t-2xl ${isCoach ? 'border-b border-gray-200' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${isCoach ? 'bg-gray-100' : 'bg-white/20'} rounded-lg`}>
                {mode === "create" ? <Calendar className={`w-6 h-6 ${isCoach ? 'text-[#003c3c]' : ''}`} /> : <FileText className={`w-6 h-6 ${isCoach ? 'text-[#003c3c]' : ''}`} />}
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isCoach ? 'text-gray-900' : ''}`}>
                  {mode === "create" ? "Nouvelle Activité" : "Modifier l'Activité"}
                </h2>
                {isAdmin && (
                  <p className="text-sm text-white/80 mt-1 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Mode Administrateur
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && mode === "edit" && (
                <button
                  onClick={() => console.log('Voir l\'historique des modifications')}
                  className={`p-2 ${isCoach ? 'text-gray-700 hover:bg-gray-100' : 'hover:bg-white/20'} rounded-lg transition-colors text-sm`}
                  title="Voir l'historique des modifications"
                >
                  Historique
                </button>
              )}
              <button onClick={onCancel} className={`p-2 ${isCoach ? 'text-gray-700 hover:bg-gray-100' : 'hover:bg-white/20'} rounded-lg transition-colors`}>
                <X className={`w-6 h-6 ${isCoach ? '' : 'text-white'}`} />
              </button>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className={`p-6 space-y-6 ${isCoach ? 'bg-white' : ''}`}>
          <div className="space-y-2">
            <label className={`block text-sm font-semibold ${isCoach ? 'text-gray-800' : 'text-gray-700'}`}>Nom de l'activité *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-4 py-3 ${isCoach ? 'bg-white border border-gray-200' : 'bg-white/70 border border-gray-200'} rounded-xl focus:outline-none focus:ring-2 ${isCoach ? 'focus:ring-[#a0f000]' : 'focus:ring-blue-500'} focus:border-transparent transition-all duration-200`}
              placeholder="Ex: Yoga matinal, Pilates débutant..."
            />
          </div>
          <div className="space-y-2">
            <label className={`block text-sm font-semibold ${isCoach ? 'text-gray-800' : 'text-gray-700'}`}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 ${isCoach ? 'bg-white border border-gray-200' : 'bg-white/70 border border-gray-200'} rounded-xl focus:outline-none focus:ring-2 ${isCoach ? 'focus:ring-[#a0f000]' : 'focus:ring-blue-500'} focus:border-transparent transition-all duration-200 resize-none`}
              placeholder="Décrivez votre activité..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isCoach ? 'text-gray-800' : 'text-gray-700'}`}>Catégorie *</label>
              <div className="space-y-2">
                <select
                  required
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className={`w-full px-4 py-3 ${isCoach ? 'bg-white border border-gray-200' : 'bg-white/70 border border-gray-200'} rounded-xl focus:outline-none focus:ring-2 ${isCoach ? 'focus:ring-[#a0f000]' : 'focus:ring-blue-500'} focus:border-transparent transition-all duration-200`}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    {showAddCategory ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Nouvelle catégorie"
                          className="flex-1 px-3 py-2 bg-white/70 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddCategory}
                          className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                        >
                          Ajouter
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddCategory(false)}
                          className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAddCategory(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Nouvelle catégorie
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isCoach ? 'text-gray-800' : 'text-gray-700'} flex items-center gap-2`}>
                <MapPin className="w-4 h-4" />
                Lieu *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={`w-full px-4 py-3 ${isCoach ? 'bg-white border border-gray-200' : 'bg-white/70 border border-gray-200'} rounded-xl focus:outline-none focus:ring-2 ${isCoach ? 'focus:ring-[#a0f000]' : 'focus:ring-blue-500'} focus:border-transparent transition-all duration-200`}
                placeholder="Salle A, Studio 1..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isCoach ? 'text-gray-800' : 'text-gray-700'} flex items-center gap-2`}>
                <DollarSign className="w-4 h-4" />
                Prix (DH) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-3 ${isCoach ? 'bg-white border border-gray-200' : 'bg-white/70 border border-gray-200'} rounded-xl focus:outline-none focus:ring-2 ${isCoach ? 'focus:ring-[#a0f000]' : 'focus:ring-blue-500'} focus:border-transparent transition-all duration-200`}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isCoach ? 'text-gray-800' : 'text-gray-700'} flex items-center gap-2`}>
                <Clock className="w-4 h-4" />
                Durée (minutes) *
              </label>
              <input
                type="number"
                required
                min="15"
                step="15"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", Number.parseInt(e.target.value) || 60)}
                className={`w-full px-4 py-3 ${isCoach ? 'bg-white border border-gray-200' : 'bg-white/70 border border-gray-200'} rounded-xl focus:outline-none focus:ring-2 ${isCoach ? 'focus:ring-[#a0f000]' : 'focus:ring-blue-500'} focus:border-transparent transition-all duration-200`}
                placeholder="60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`block text-sm font-semibold ${isCoach ? 'text-gray-800' : 'text-gray-700'}`}>Coach *</label>
            {isAdmin ? (
              <select
                required
                value={formData.coach}
                onChange={(e) => handleInputChange("coach", e.target.value)}
                className={`w-full px-4 py-3 ${isCoach ? 'bg-white border border-gray-200' : 'bg-white/70 border border-gray-200'} rounded-xl focus:outline-none focus:ring-2 ${isCoach ? 'focus:ring-[#a0f000]' : 'focus:ring-blue-500'} focus:border-transparent transition-all duration-200`}
              >
                <option value="">Sélectionner un coach</option>
                {availableCoaches.map((coach) => (
                  <option key={coach.id} value={coach.id} className="capitalize">
                    {coach.name} ({coach.email})
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700">
                Le coach (vous) sera assigné automatiquement.
              </div>
            )}
          </div>
          {isAdmin && (
            <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                Options Administrateur
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Statut de l'activité</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="isActive"
                        value="true"
                        checked={formData.isActive === true}
                        onChange={(e) => handleInputChange("isActive", e.target.value === "true")}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="isActive"
                        value="false"
                        checked={formData.isActive === false}
                        onChange={(e) => handleInputChange("isActive", e.target.value === "true")}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Inactive</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Image de l'activité</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="URL de l'image (optionnel)"
                  />
                </div>
              </div>
              {formData.image && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Aperçu de l'image</label>
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={formData.image}
                      alt="Aperçu de l'activité"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
                      Image non disponible
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {formData.schedule && formData.schedule.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Plannings et participants
                </label>
                <button
                  type="button"
                  onClick={addSchedule}
                  className={`flex items-center gap-2 px-4 py-2 ${isCoach ? 'bg-[#003c3c] hover:bg-[#143c3c]' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'} text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105`}
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un planning
                </button>
              </div>

              {formData.schedule.map((schedule, scheduleIndex) => (
                <div
                  key={schedule.id}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">Planning {scheduleIndex + 1}</h4>
                    {formData.schedule.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSchedule(schedule.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Jour</label>
                      <select
                        value={schedule.day}
                        onChange={(e) => updateSchedule(schedule.id, "day", e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {days.map((day) => (
                          <option key={day} value={day} className="capitalize">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Début</label>
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => updateSchedule(schedule.id, "startTime", e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Fin</label>
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => updateSchedule(schedule.id, "endTime", e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Max participants</label>
                      <input
                        type="number"
                        min="1"
                        value={schedule.maxParticipants}
                        onChange={(e) =>
                          updateSchedule(schedule.id, "maxParticipants", Number.parseInt(e.target.value) || 1)
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Participants ({(schedule.participants || []).length}/{schedule.maxParticipants})
                      </h5>
                      <div className="flex gap-2">
                        {(schedule.participants || []).length < schedule.maxParticipants && (
                          <button
                            type="button"
                            onClick={() => addParticipant(schedule.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg font-medium transition-all duration-200"
                          >
                            <UserPlus className="w-3 h-3" />
                            Ajouter
                          </button>
                        )}
                        {isAdmin && formData.schedule.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSchedule(schedule.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg font-medium transition-all duration-200"
                            title="Supprimer ce planning (Admin)"
                          >
                            <Trash2 className="w-3 h-3" />
                            Supprimer
                          </button>
                        )}
                      </div>
                    </div>

                    {(schedule.participants || []).map((participant) => (
                      <div key={participant.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                            <input
                              type="text"
                              placeholder="Nom complet"
                              value={participant.name}
                              onChange={(e) => updateParticipant(schedule.id, participant.id, "name", e.target.value)}
                              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <input
                              type="email"
                              placeholder="Email"
                              value={participant.email}
                              onChange={(e) => updateParticipant(schedule.id, participant.id, "email", e.target.value)}
                              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <input
                              type="tel"
                              placeholder="Téléphone (optionnel)"
                              value={participant.phone || ""}
                              onChange={(e) => updateParticipant(schedule.id, participant.id, "phone", e.target.value)}
                              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeParticipant(schedule.id, participant.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {(schedule.participants || []).length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        Aucun participant ajouté pour ce planning
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 px-6 py-3 ${isCoach ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} rounded-xl font-semibold transition-all duration-200 transform hover:scale-105`}
            >
              Annuler
            </button>
            {isAdmin && mode === "edit" && (
              <button
                type="button"
                onClick={() => console.log('Dupliquer l\'activité')}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Dupliquer
              </button>
            )}
            
            <button
              type="submit"
              className={`flex-1 px-6 py-3 ${isCoach ? 'bg-[#a0f000] hover:bg-[#93d400] text-black' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'} text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2`}
            >
              <Save className="w-5 h-5" />
              {mode === "create" ? "Créer l'activité" : "Sauvegarder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ActivityForm
