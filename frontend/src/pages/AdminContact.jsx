import React, { useState, useEffect } from "react";
import { 
  Mail, 
  Clock, 
  User, 
  MessageSquare, 
  Reply, 
  Trash2, 
  Eye, 
  CheckCircle,
  AlertCircle,
  Send
} from "lucide-react";
import { contactService } from "../services/contactService";

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [stats, setStats] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);
  const [activeSenderFilter, setActiveSenderFilter] = useState('all'); 
  const [roleCounts, setRoleCounts] = useState({ all: 0, user: 0, coach: 0, guest: 0 });

  useEffect(() => {
    loadMessages();
    loadStats();
  }, [activeSenderFilter]);

  useEffect(() => {
    
    loadRoleCounts();
  }, []);

  const loadMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (activeSenderFilter !== 'all') params.set('senderType', activeSenderFilter);
      const data = await contactService.getAllMessages(params.toString());
      setMessages(data);
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRoleCounts = async () => {
    try {
      const all = await contactService.getAllMessages('');
      const counts = {
        all: Array.isArray(all) ? all.length : 0,
        user: Array.isArray(all) ? all.filter(m => m.userId && m.userId.role === 'user').length : 0,
        coach: Array.isArray(all) ? all.filter(m => m.userId && m.userId.role === 'coach').length : 0,
        guest: Array.isArray(all) ? all.filter(m => !m.userId).length : 0,
      };
      setRoleCounts(counts);
    } catch (e) {
      setRoleCounts({ all: 0, user: 0, coach: 0, guest: 0 });
    }
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const data = await contactService.getContactStats();
      console.log('Statistiques reçues du backend:', data);
      const validatedStats = {
        totalMessages: parseInt(data.total) || 0,
        unreadMessages: parseInt(data.pending) || 0,
        repliedMessages: parseInt(data.replied) || 0,
        readMessages: parseInt(data.read) || 0
      };
      const calculatedTotal = validatedStats.unreadMessages + validatedStats.readMessages + validatedStats.repliedMessages;
      if (validatedStats.totalMessages !== calculatedTotal) {
        console.warn('Incohérence détectée dans les statistiques:', {
          totalFromBackend: validatedStats.totalMessages,
          calculatedTotal: calculatedTotal,
          difference: validatedStats.totalMessages - calculatedTotal
        });
        validatedStats.totalMessages = calculatedTotal;
      }
      console.log('Statistiques validées et cohérentes:', validatedStats);
      setStats(validatedStats);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      setStats({ totalMessages: 0, unreadMessages: 0, repliedMessages: 0, readMessages: 0 });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactService.markAsRead(id);
      console.log('Message marqué comme lu, mise à jour des données...');
      await loadMessages();
      await loadStats();
      await loadRoleCounts();
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      alert("Erreur lors du marquage comme lu");
    }
  };

  const handleReply = async (id) => {
    if (!replyText || typeof replyText !== 'string' || !replyText.trim()) {
      alert("Veuillez saisir une réponse");
      return;
    }

    try {
      await contactService.replyToMessage(id, replyText);
      setReplyText("");
      setSelectedMessage(null);
      console.log('Réponse envoyée, mise à jour des données...');
      await loadMessages();
      await loadStats();
      await loadRoleCounts();
      alert("Réponse envoyée avec succès");
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      alert("Erreur lors de l'envoi de la réponse");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      return;
    }

    try {
      await contactService.deleteMessage(id);
      console.log('Message supprimé, mise à jour des données...');
      await loadMessages();
      await loadStats();
      await loadRoleCounts();
      alert("Message supprimé avec succès");
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert("Erreur lors de la suppression");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-[#ffb480]" />;
      case 'read':
        return <Eye className="h-5 w-5 text-[#59adf6]" />;
      case 'replied':
        return <CheckCircle className="h-5 w-5 text-[#22b455]" />;
      default:
        return <Mail className="h-5 w-5 text-[#92e5a1]" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'read':
        return 'Lu';
      case 'replied':
        return 'Répondu';
      default:
        return 'Inconnu';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#003c3c] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#22b455] mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003c3c] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#22b455] to-[#92e5a1] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#ffb480] to-[#59adf6] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-br from-[#59adf6] to-[#003c3c] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-[#ffb480] to-[#22b455] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse animation-delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Gestion des Contacts
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Gérez les messages et répondez aux demandes des utilisateurs
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Statistiques des Messages</h2>
            <div className="flex items-center gap-4">
              {lastUpdate && (
                <div className="text-sm text-white/60">
                  Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
              <button
                onClick={loadStats}
                disabled={statsLoading}
                className="px-3 py-1 bg-[#22b455] hover:bg-[#ffb480] disabled:bg-gray-500 text-white text-sm rounded-lg transition-colors duration-300 flex items-center gap-2"
                title="Rafraîchir les statistiques"
              >
                <div className={`w-3 h-3 ${statsLoading ? 'animate-spin' : ''}`}>
                  {statsLoading ? '⟳' : '↻'}
                </div>
                Rafraîchir
              </button>
            </div>
          </div>
          
          {stats.totalMessages !== (stats.unreadMessages + stats.readMessages + stats.repliedMessages) && (
            <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-300">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  Attention: Incohérence détectée dans les statistiques. 
                  Total: {stats.totalMessages} | 
                  Calculé: {stats.unreadMessages + stats.readMessages + stats.repliedMessages}
                </span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-[#92e5a1]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#22b455] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black/70 text-sm font-medium">Messages</p>
                  {statsLoading ? (
                    <div className="animate-pulse bg-black/20 h-8 w-16 rounded mt-2"></div>
                  ) : (
                    <p className="text-3xl font-bold text-black group-hover:text-[#22b455] transition-colors duration-300">
                      {stats.totalMessages || 0}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#22b455] to-[#92e5a1] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-[#ffb480]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#ffb480] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black/70 text-sm font-medium">Non lus</p>
                  {statsLoading ? (
                    <div className="animate-pulse bg-black/20 h-8 w-16 rounded mt-2"></div>
                  ) : (
                    <p className="text-3xl font-bold text-black group-hover:text-[#ffb480] transition-colors duration-300">
                      {stats.unreadMessages || 0}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#ffb480] to-[#59adf6] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-[#59adf6]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#59adf6] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black/70 text-sm font-medium">Répondu</p>
                  {statsLoading ? (
                    <div className="animate-pulse bg-black/20 h-8 w-16 rounded mt-2"></div>
                  ) : (
                    <p className="text-3xl font-bold text-black group-hover:text-[#59adf6] transition-colors duration-300">
                      {stats.repliedMessages || 0}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#59adf6] to-[#ffb480] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {[{value:'all', label:'Tous', count: roleCounts.all},
            {value:'user', label:'Utilisateurs', count: roleCounts.user},
            {value:'coach', label:'Coachs', count: roleCounts.coach},
            {value:'guest', label:'Invités', count: roleCounts.guest}
          ].map(f => (
            <button key={f.value} onClick={()=>setActiveSenderFilter(f.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeSenderFilter===f.value? 'bg-[#22b455] text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#92e5a1]/90 via-[#ffb480]/80 to-[#59adf6]/90 backdrop-blur-xl rounded-2xl border border-[#22b455] shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#22b455] to-[#ffb480] p-6 border-b border-[#22b455]">
            <h2 className="text-xl font-bold text-white">Messages reçus</h2>
          </div>
          
          {messages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#ffb480] to-[#59adf6] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <p className="text-black/70">Aucun message reçu</p>
            </div>
          ) : (
            <div className="divide-y divide-[#22b455]/30">
              {messages.map((message, index) => (
                <div key={message._id} className={`p-6 hover:bg-white/20 transition-all duration-300 ${
                  index % 3 === 0 ? 'bg-[#92e5a1]/30' : 
                  index % 3 === 1 ? 'bg-[#ffb480]/30' : 
                  'bg-[#59adf6]/30'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-black">{message.subject}</h3>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(message.status)}
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                            message.status === 'pending' ? 'bg-[#ffb480]/20 text-[#ffb480] border border-[#ffb480]/30' :
                            message.status === 'read' ? 'bg-[#59adf6]/20 text-[#59adf6] border border-[#59adf6]/30' :
                            'bg-[#22b455]/20 text-[#22b455] border border-[#22b455]/30'
                          }`}>
                            {getStatusText(message.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-black/60 mb-3">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-[#ffb480] rounded-full"></div>
                          <span>{message.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-[#59adf6] rounded-full"></div>
                          <span>{message.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-[#22b455] rounded-full"></div>
                          <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <p className="text-black/80 mb-4 line-clamp-2">{message.message}</p>
                      
                      {message.adminReply && (
                        <div className="bg-gradient-to-r from-[#22b455]/20 to-[#ffb480]/20 border-l-4 border-[#22b455] p-4 mb-4 rounded-r-lg">
                          <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#22b455]" />
                            Réponse admin :
                          </h4>
                          <p className="text-black/80">{message.adminReply}</p>
                          <p className="text-sm text-black/60 mt-2 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Répondu le {new Date(message.repliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-2 ml-4">
                      {message.status === 'pending' && (
                        <button
                          onClick={() => handleMarkAsRead(message._id)}
                          className="p-2 text-[#ffb480] hover:bg-[#ffb480]/20 rounded-lg transition-all duration-300 hover:scale-110"
                          title="Marquer comme lu"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      )}
                      
                      {message.status !== 'replied' && (
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="p-2 text-[#59adf6] hover:bg-[#59adf6]/20 rounded-lg transition-all duration-300 hover:scale-110"
                          title="Répondre"
                        >
                          <Reply className="h-5 w-5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(message._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300 hover:scale-110"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedMessage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-[#92e5a1] via-[#ffb480] to-[#59adf6] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-[#22b455]">
              <div className="bg-gradient-to-r from-[#22b455] to-[#ffb480] p-6 border-b border-[#22b455] rounded-t-2xl">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Répondre à {selectedMessage.name}
                </h3>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#22b455]" />
                    Message original :
                  </h4>
                  <div className="bg-white/50 p-4 rounded-lg border border-[#22b455]/30 backdrop-blur-sm">
                    <p className="text-black/80">{selectedMessage.message}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="text-sm font-medium text-black mb-2 flex items-center gap-2">
                    <Send className="h-4 w-4 text-[#59adf6]" />
                    Votre réponse :
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                    className="w-full border-2 border-[#22b455] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffb480] focus:border-[#ffb480] bg-white/80 text-black placeholder:text-black/60 transition-all duration-300"
                    placeholder="Tapez votre réponse..."
                  />
                </div>
                
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    onClick={() => handleReply(selectedMessage._id)}
                    className="flex-1 bg-gradient-to-r from-[#22b455] to-[#ffb480] hover:from-[#ffb480] hover:to-[#59adf6] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg"
                  >
                    <Send className="h-5 w-5" />
                    Envoyer la réponse
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMessage(null);
                      setReplyText("");
                    }}
                    className="px-6 py-3 border-2 border-[#59adf6] text-[#59adf6] rounded-lg hover:bg-[#59adf6] hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 180, 85, 0.3); }
          50% { box-shadow: 0 0 30px rgba(34, 180, 85, 0.6); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        /* Hover effects */
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        /* Responsive breakpoints */
        @media (max-width: 768px) {
          .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 768px) and (max-width: 1024px) {
          .grid-cols-3 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 1024px) {
          .grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default AdminContact;
