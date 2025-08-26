import { API_URLS } from './api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

export const getAll = async () => {
  try {
    const response = await fetch(API_URLS.ACTIVITIES, {
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé, veuillez vous reconnecter')
      }
      throw new Error('Erreur lors du chargement des activités')
    }
    return await response.json()
  } catch (error) {
    console.error('Erreur getAll:', error)
    throw error
  }
}

export const getById = async (id) => {
  try {
    const response = await fetch(`${API_URLS.ACTIVITIES}/${id}`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé, veuillez vous reconnecter')
      }
      throw new Error('Activité non trouvée')
    }
    return await response.json()
  } catch (error) {
    console.error('Erreur getById:', error)
    throw error
  }
}

export const create = async (activityData) => {
  try {
    console.log('Données envoyées au backend:', activityData)
    const response = await fetch(API_URLS.ACTIVITIES, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(activityData),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé, veuillez vous reconnecter')
      }
      if (response.status === 400) {
        const errorData = await response.json()
        console.error('Erreur 400 - Détails:', errorData)

        if (errorData.message) {
          throw new Error(errorData.message)
        } else if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).map(err => err.message || err).join(', ')
          throw new Error(`Erreur de validation: ${errorMessages}`)
        } else {
          throw new Error('Données invalides envoyées au serveur')
        }
      }
      
      const errorData = await response.json()
      throw new Error(errorData.message || 'Erreur lors de la création')
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur create:', error)
    throw error
  }
}

export const update = async (id, activityData) => {
  try {
    const response = await fetch(`${API_URLS.ACTIVITIES}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(activityData),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé, veuillez vous reconnecter')
      }
      const errorData = await response.json()
      throw new Error(errorData.message || 'Erreur lors de la mise à jour')
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur update:', error)
    throw error
  }
}

export const deleteActivity = async (id) => {
  try {
    const response = await fetch(`${API_URLS.ACTIVITIES}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé, veuillez vous reconnecter')
      }
      const errorData = await response.json()
      throw new Error(errorData.message || 'Erreur lors de la suppression')
    }

    return true
  } catch (error) {
    console.error('Erreur deleteActivity:', error)
    throw error
  }
}

export const getByCoach = async (coachId) => {
  try {
    const response = await fetch(`${API_URLS.ACTIVITIES}/coach/${coachId}`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé, veuillez vous reconnecter')
      }
      throw new Error('Erreur lors du chargement des activités du coach')
    }
    return await response.json()
  } catch (error) {
    console.error('Erreur getByCoach:', error)
    throw error
  }
}

export const getByCategory = async (category) => {
  try {
    const response = await fetch(`${API_URLS.ACTIVITIES}/category/${category}`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé, veuillez vous reconnecter')
      }
      throw new Error('Erreur lors du chargement des activités par catégorie')
    }
    return await response.json()
  } catch (error) {
    console.error('Erreur getByCategory:', error)
    throw error
  }
}

export const getActive = async () => {
  try {
    const response = await fetch(`${API_URLS.ACTIVITIES}/active`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé, veuillez vous reconnecter')
      }
      throw new Error('Erreur lors du chargement des activités actives')
    }
    return await response.json()
  } catch (error) {
    console.error('Erreur getActive:', error)
    throw error
  }
}

export const search = async (query) => {
  try {
    const response = await fetch(`${API_URLS.ACTIVITIES}/search?q=${encodeURIComponent(query)}`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé, veuillez vous reconnecter')
      }
      throw new Error('Erreur lors de la recherche')
    }
    return await response.json()
  } catch (error) {
    console.error('Erreur search:', error)
    throw error
  }
}

// Export par défaut pour la compatibilité
const activityService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteActivity,
  getByCoach,
  getByCategory,
  getActive,
  search
}

export default activityService
