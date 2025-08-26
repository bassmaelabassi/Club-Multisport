import axios from 'axios';

export const API_URLS = {

  RESERVATIONS: 'http://localhost:9000/api/reservations',
 
  ACTIVITIES: 'http://localhost:9000/api/activities',

  USERS: 'http://localhost:9000/api/users',
 
  AUTH: 'http://localhost:9000/api/auth',

  COACHES: 'http://localhost:9000/api/coaches',
 
  REVIEWS: 'http://localhost:9000/api/reviews',

  STATS: 'http://localhost:9000/api/stats',

  CONTACT: 'http://localhost:9000/api/contact',

  NOTIFICATIONS: 'http://localhost:9000/api/notifications',
  
};

export const API_BASE_URL = 'http://localhost:9000/api';

export const API_CONFIG = {
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:9000/api',
  timeout: 30000, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const retryCount = originalRequest._retryCount || 0;
      const delay = Math.min(3000 * Math.pow(2, retryCount), 30000);
      
      console.log(`Rate limiting détecté. Retry dans ${delay}ms... (tentative ${retryCount + 1})`);
            await new Promise(resolve => setTimeout(resolve, delay));
      
      originalRequest._retryCount = retryCount + 1;
      if (retryCount < 1) {
        return api(originalRequest);
      } else {
        console.log('Nombre maximum de tentatives atteint pour cette requête');
      }
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    if (error.response?.status >= 500) {
      console.error('Erreur serveur:', error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;
