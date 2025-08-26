import api from './api';

export const sendMessage = async (contactData) => {
  const response = await api.post('/contact', contactData);
  return response.data;
};

export const getMyMessages = async () => {
  const response = await api.get('/contact/me');
  return response.data;
};

export const getAllMessages = async (queryString = '') => {
  const url = queryString ? `/contact/admin?${queryString}` : '/contact/admin';
  const response = await api.get(url);
  return response.data;
};

export const getMessageById = async (id) => {
  const response = await api.get(`/contact/admin/${id}`);
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.put(`/contact/admin/${id}/read`);
  return response.data;
};

export const replyToMessage = async (id, adminReply) => {
  const response = await api.put(`/contact/admin/${id}/reply`, { adminReply });
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await api.delete(`/contact/admin/${id}`);
  return response.data;
};

export const getContactStats = async () => {
  const response = await api.get('/contact/admin/stats');
  return response.data;
};

// Export par défaut pour la compatibilité
const contactService = {
  sendMessage,
  getMyMessages,
  getAllMessages,
  getMessageById,
  markAsRead,
  replyToMessage,
  deleteMessage,
  getContactStats
};

export { contactService };
