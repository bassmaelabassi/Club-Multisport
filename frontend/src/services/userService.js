import api from './api';

export const getAll = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getCoaches = async () => {
  const response = await api.get('/users/coaches');
  return response.data;
};

export const getUserStats = async () => {
  const response = await api.get('/stats/user');
  return response.data;
};

export const updateProfile = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put('/users/password', passwordData);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete('/users/account');
  return response.data;
};

export const banUser = async (userId) => {
  await api.put(`/users/${userId}/ban`, { isActive: false });
};

export const unbanUser = async (userId) => {
  await api.put(`/users/${userId}/ban`, { isActive: true });
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  await api.put(`/users/${userId}/role`, { role });
};

export const createCoach = async (coachData) => {
  const response = await api.post('/coaches', coachData);
  return response.data;
};

export const updateCoach = async (coachId, coachData) => {
  const response = await api.put(`/users/${coachId}`, coachData);
  return response.data;
};

export const deleteCoach = async (coachId) => {
  const response = await api.delete(`/users/${coachId}`);
  return response.data;
};

export const promoteToCoach = async (userId) => {
  await api.post(`/users/${userId}/promote-to-coach`);
};

// Export par défaut pour la compatibilité
const userService = {
  getAll,
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
};

export { userService };
