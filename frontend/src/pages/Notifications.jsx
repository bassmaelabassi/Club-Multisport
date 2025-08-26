import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Bell, Mail, MessageSquare, Calendar, Star, Trash2, CheckCircle, Eye } from "lucide-react";
import api from "../services/api";

const Notifications = () => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      const newUnreadCount = notifications.filter(n => n._id !== id && !n.isRead).length;
      setUnreadCount(newUnreadCount);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'contact':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'reservation':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-purple-500" />;
      case 'promotion':
        return <Star className="h-5 w-5 text-yellow-500" />;
      default:
        return <Mail className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'contact':
        return 'border-l-blue-500 bg-blue-50';
      case 'reservation':
        return 'border-l-green-500 bg-green-50';
      case 'system':
        return 'border-l-purple-500 bg-purple-50';
      case 'promotion':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EDE9E3] via-[#CBBCA7] to-[#AAAB96]">
        <div className="text-center">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Connexion requise</h2>
          <p className="text-gray-500">Connectez-vous pour voir vos notifications</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EDE9E3] via-[#CBBCA7] to-[#AAAB96]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDE9E3] via-[#CBBCA7] to-[#AAAB96] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl border border-[#CBBCA7]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-[#AAAB96] to-[#925B42] rounded-full">
                <Bell className="w-8 h-8 text-white" />
        </div>
        <div>
                <h1 className="text-3xl font-bold text-[#5D6043]">Notifications</h1>
                <p className="text-[#925B42]">
                  {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Aucune notification non lue'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-gradient-to-r from-[#AAAB96] to-[#925B42] text-white rounded-lg hover:from-[#925B42] hover:to-[#AAAB96] transition-all duration-300 flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Tout marquer comme lu</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 text-center shadow-xl border border-[#CBBCA7]">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune notification</h3>
              <p className="text-gray-500">Vous n'avez pas encore de notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#CBBCA7] border-l-4 ${getNotificationColor(notification.type)} transition-all duration-300 hover:shadow-2xl ${
                  !notification.isRead ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className={`font-semibold ${!notification.isRead ? 'text-[#5D6043]' : 'text-gray-600'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{notification.message}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Marquer comme lu"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
        </div>
            ))
          )}
        </div>
        </div>
    </div>
  );
};

export default Notifications; 