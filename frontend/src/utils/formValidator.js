export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return false;
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/
  return passwordRegex.test(password)
}

export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
    const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/
  const cleanPhone = phone.replace(/\s/g, '')
  return phoneRegex.test(cleanPhone)
}

export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return true;
  if (typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return false;
}

export const validateMinLength = (value, minLength) => {
  if (!value) return false;
  if (typeof value === 'string') return value.length >= minLength;
  if (typeof value === 'number') return value.toString().length >= minLength;
  if (Array.isArray(value)) return value.length >= minLength;
  return false;
}

export const validateMaxLength = (value, maxLength) => {
  if (!value) return true;
  if (typeof value === 'string') return value.length <= maxLength;
  if (typeof value === 'number') return value.toString().length <= maxLength;
  if (Array.isArray(value)) return value.length <= maxLength;
  return true;
}

export const validateNumber = (value, min = null, max = null) => {
  if (value === null || value === undefined) return false;
  
  let num;
  if (typeof value === 'number') {
    num = value;
  } else if (typeof value === 'string') {
    num = parseFloat(value);
  } else {
    return false;
  }
  
  if (isNaN(num)) return false;
  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;
  return true;
}

export const validateDate = (date) => {
  if (!date) return false;
  
  let dateObj;
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    return false;
  }
  
  return dateObj instanceof Date && !isNaN(dateObj);
}

export const validateAge = (birthDate, minAge = 0, maxAge = 120) => {
  if (!birthDate) return false;
  
  let birth;
  if (birthDate instanceof Date) {
    birth = birthDate;
  } else if (typeof birthDate === 'string') {
    birth = new Date(birthDate);
  } else if (typeof birthDate === 'number') {
    birth = new Date(birthDate);
  } else {
    return false;
  }
  
  if (!(birth instanceof Date) || isNaN(birth)) {
    return false;
  }
  
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= minAge && age <= maxAge;
}

export const validateForm = (data, rules) => {
  if (!data || typeof data !== 'object' || !rules || typeof rules !== 'object') {
    return {
      isValid: false,
      errors: { general: 'Données de formulaire invalides' }
    };
  }
  
  const errors = {}
  
  for (const field in rules) {
    const fieldRules = rules[field]
    const value = data[field]
    
    for (const rule of fieldRules) {
      const { type, message, ...params } = rule
      let isValid = true
      
      try {
      switch (type) {
        case 'required':
          isValid = validateRequired(value)
          break
        case 'email':
          isValid = !value || validateEmail(value)
          break
        case 'password':
          isValid = !value || validatePassword(value)
          break
        case 'phone':
          isValid = !value || validatePhone(value)
          break
        case 'minLength':
          isValid = validateMinLength(value, params.min)
          break
        case 'maxLength':
          isValid = validateMaxLength(value, params.max)
          break
        case 'number':
          isValid = validateNumber(value, params.min, params.max)
          break
        case 'date':
          isValid = !value || validateDate(value)
          break
        case 'age':
          isValid = !value || validateAge(value, params.min, params.max)
          break
        default:
          break
        }
      } catch (error) {
        console.error(`Erreur de validation pour le champ ${field}:`, error);
        isValid = false;
      }
      
      if (!isValid) {
        errors[field] = message
        break
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validationRules = {
  user: {
    firstName: [
      { type: 'required', message: 'Le prénom est requis' },
      { type: 'minLength', min: 2, message: 'Le prénom doit contenir au moins 2 caractères' },
      { type: 'maxLength', max: 50, message: 'Le prénom ne peut pas dépasser 50 caractères' }
    ],
    lastName: [
      { type: 'required', message: 'Le nom est requis' },
      { type: 'minLength', min: 2, message: 'Le nom doit contenir au moins 2 caractères' },
      { type: 'maxLength', max: 50, message: 'Le nom ne peut pas dépasser 50 caractères' }
    ],
    email: [
      { type: 'required', message: 'L\'email est requis' },
      { type: 'email', message: 'Format d\'email invalide' }
    ],
    password: [
      { type: 'required', message: 'Le mot de passe est requis' },
      { type: 'password', message: 'Le mot de passe doit contenir au moins 6 caractères, une majuscule, une minuscule et un chiffre' }
    ],
    phone: [
      { type: 'phone', message: 'Format de téléphone invalide' }
    ],
    dateOfBirth: [
      { type: 'date', message: 'Date invalide' },
      { type: 'age', min: 13, max: 100, message: 'L\'âge doit être compris entre 13 et 100 ans' }
    ]
  },
  activity: {
    title: [
      { type: 'required', message: 'Le titre est requis' },
      { type: 'minLength', min: 3, message: 'Le titre doit contenir au moins 3 caractères' },
      { type: 'maxLength', max: 100, message: 'Le titre ne peut pas dépasser 100 caractères' }
    ],
    description: [
      { type: 'required', message: 'La description est requise' },
      { type: 'minLength', min: 10, message: 'La description doit contenir au moins 10 caractères' },
      { type: 'maxLength', max: 1000, message: 'La description ne peut pas dépasser 1000 caractères' }
    ],
    price: [
      { type: 'required', message: 'Le prix est requis' },
      { type: 'number', min: 0, max: 1000, message: 'Le prix doit être compris entre 0 et 1000 DH' }
    ],
    duration: [
      { type: 'required', message: 'La durée est requise' },
      { type: 'number', min: 15, max: 300, message: 'La durée doit être comprise entre 15 et 300 minutes' }
    ],
    maxParticipants: [
      { type: 'number', min: 1, max: 100, message: 'Le nombre de participants doit être compris entre 1 et 100' }
    ]
  },
  coach: {
    firstName: [
      { type: 'required', message: 'Le prénom est requis' },
      { type: 'minLength', min: 2, message: 'Le prénom doit contenir au moins 2 caractères' }
    ],
    lastName: [
      { type: 'required', message: 'Le nom est requis' },
      { type: 'minLength', min: 2, message: 'Le nom doit contenir au moins 2 caractères' }
    ],
    email: [
      { type: 'required', message: 'L\'email est requis' },
      { type: 'email', message: 'Format d\'email invalide' }
    ],
    speciality: [
      { type: 'required', message: 'La spécialité est requise' }
    ]
  }
}
