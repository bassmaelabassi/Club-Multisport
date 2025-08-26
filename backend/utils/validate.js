const Joi = require('joi');

const userValidationSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name cannot exceed 50 characters',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name cannot exceed 50 characters',
    'any.required': 'Last name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords must match',
    'any.required': 'Password confirmation is required'
  }),
  phone: Joi.string().optional().allow(''),
  birthDate: Joi.date().optional().allow(''),
  address: Joi.object({
    street: Joi.string().optional().allow(''),
    city: Joi.string().optional().allow(''),
    zipCode: Joi.string().optional().allow(''),
    country: Joi.string().optional().allow('')
  }).optional()
});

const userUpdateValidationSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  phone: Joi.string().optional().allow(''),
  birthDate: Joi.date().optional().allow(''),
  speciality: Joi.string().optional(),
  experience: Joi.number().optional(),
  rating: Joi.number().min(0).max(5).optional(),
  bio: Joi.string().optional()
});

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

const contactValidationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut pas dépasser 100 caractères',
    'any.required': 'Le nom est requis'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Veuillez fournir une adresse email valide',
    'any.required': 'L\'email est requis'
  }),
  subject: Joi.string().min(2).max(200).required().messages({
    'string.min': 'Le sujet doit contenir au moins 2 caractères',
    'string.max': 'Le sujet ne peut pas dépasser 200 caractères',
    'any.required': 'Le sujet est requis'
  }),
  message: Joi.string().min(10).max(1000).required().messages({
    'string.min': 'Le message doit contenir au moins 10 caractères',
    'string.max': 'Le message ne peut pas dépasser 1000 caractères',
    'any.required': 'Le message est requis'
  }),
  coachId: Joi.string().length(24).hex().optional().allow(null),
  activityId: Joi.string().length(24).hex().optional().allow(null)
});

const activityValidationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut pas dépasser 100 caractères',
    'any.required': 'Le nom est requis'
  }),
  category: Joi.string().valid('danse', 'musique', 'natation', 'équitation', 'fitness', 'yoga', 'autre').required().messages({
    'any.only': 'Catégorie invalide',
    'any.required': 'La catégorie est requise'
  }),
  description: Joi.string().min(10).max(1000).required().messages({
    'string.min': 'La description doit contenir au moins 10 caractères',
    'string.max': 'La description ne peut pas dépasser 1000 caractères',
    'any.required': 'La description est requise'
  }),
  coach: Joi.string().required().messages({
    'any.required': 'Le coach est requis'
  }),
  schedule: Joi.array().items(Joi.object({
    day: Joi.string().valid('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche').required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    maxParticipants: Joi.number().min(1).required()
  })).min(1).required().messages({
    'array.min': 'Au moins un créneau horaire est requis',
    'any.required': 'Le planning est requis'
  }),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Le prix doit être positif',
    'any.required': 'Le prix est requis'
  }),
  duration: Joi.number().min(15).max(300).required().messages({
    'number.min': 'La durée doit être d\'au moins 15 minutes',
    'number.max': 'La durée ne peut pas dépasser 300 minutes',
    'any.required': 'La durée est requise'
  }),
  location: Joi.string().min(2).max(200).required().messages({
    'string.min': 'Le lieu doit contenir au moins 2 caractères',
    'string.max': 'Le lieu ne peut pas dépasser 200 caractères',
    'any.required': 'Le lieu est requis'
  }),
  image: Joi.string().optional().allow(''),
  isActive: Joi.boolean().default(true)
});

const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = {
  userValidationSchema,
  userUpdateValidationSchema,
  loginValidationSchema,
  contactValidationSchema,
  activityValidationSchema,
  validateObjectId
};
