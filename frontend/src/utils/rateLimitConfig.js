export const RATE_LIMIT_CONFIG = {

  retryDelays: {
    initial: 2000,        
    max: 30000,           
    multiplier: 2,       
  },
  
  maxRetries: 2,

  throttling: {
    minInterval: 1000,
    cacheTTL: 5 * 60 * 1000,
  },
  
  messages: {
    rateLimit: "Trop de requêtes. Nouvelle tentative dans {delay}s... ({attempt}/{max})",
    maxRetries: "Trop de requêtes après {max} tentatives. Veuillez patienter quelques minutes avant de réessayer.",
    throttling: "Attente automatique pour respecter les limites de requêtes...",
  },
  
  endpoints: {
    activities: {
      path: '/activities',
      priority: 'high',
      cacheEnabled: true,
    },
    users: {
      path: '/users',
      priority: 'medium',
      cacheEnabled: true,
    },
    reservations: {
      path: '/reservations',
      priority: 'medium',
      cacheEnabled: false,
    },
  }
};
export const calculateRetryDelay = (attempt, baseDelay = RATE_LIMIT_CONFIG.retryDelays.initial) => {
  const delay = baseDelay * Math.pow(RATE_LIMIT_CONFIG.retryDelays.multiplier, attempt);
  return Math.min(delay, RATE_LIMIT_CONFIG.retryDelays.max);
};

export const formatErrorMessage = (message, variables) => {
  return message.replace(/\{(\w+)\}/g, (match, key) => variables[key] || match);
};
export const isRateLimitError = (error) => {
  return error.response?.status === 429 || 
         error.message?.includes('429') || 
         error.message?.includes('Too Many Requests');
};
export const getEndpointPriority = (path) => {
  for (const [key, config] of Object.entries(RATE_LIMIT_CONFIG.endpoints)) {
    if (path.includes(config.path)) {
      return config.priority;
    }
  }
  return 'low';
};

export default RATE_LIMIT_CONFIG;
