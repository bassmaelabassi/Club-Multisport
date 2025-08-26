
export { login, register, getMe, logout } from './authService';

export {
  getAll as getAllActivities,
  getById as getActivityById,
  create as createActivity,
  update as updateActivity,
  deleteActivity,
  getByCoach,
  getByCategory,
  getActive,
  search as searchActivities
} from './activityService';

export {
  create as createReservation,
  getUserReservations,
  getAll as getAllReservations,
  getByActivity,
  updateStatus,
  complete,
  cancel,
  cancelReservation,
  deleteReservation
} from './reservationService';

// Service d'utilisateurs
export {
  getAll as getAllUsers,
  getCoaches,
  getUserStats,
  updateProfile,
  changePassword,
  deleteAccount,
  banUser,
  unbanUser,
  deleteUser,
  updateUserRole,
  createCoach,
  updateCoach,
  deleteCoach,
  promoteToCoach
} from './userService';

// Service de contact
export {
  sendMessage,
  getMyMessages,
  getAllMessages,
  getMessageById,
  markAsRead,
  replyToMessage,
  deleteMessage,
  getContactStats
} from './contactService';

// Service de notifications
export {
  getUserNotifications,
  getAdminNotifications,
  markAsRead as markNotificationAsRead,
  createReservationNotification,
  deleteNotification
} from './notificationService';


// Service API principal
export { default as api, API_URLS, API_BASE_URL, API_CONFIG } from './api';

// Exports des objets de service pour la compatibilité
export { default as activityService } from './activityService';
export { reservationService } from './reservationService';
export { userService } from './userService';
export { contactService } from './contactService';
export { notificationService } from './notificationService';
