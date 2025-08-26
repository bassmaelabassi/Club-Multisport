import React, { useState, useEffect } from "react";
import { Users, Search, Filter, Eye, Ban, Trash2, UserCheck, UserX, Crown, Shield, User } from "lucide-react";
import { userService } from "../services/userService";
import { useAuth } from "../context/AuthContext";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewUser, setViewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animatingUsers, setAnimatingUsers] = useState(new Set());
  const { isAdmin } = useAuth();
  const [roleEdit, setRoleEdit] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const userData = await userService.getAll();
        setUsers(userData);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();

    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.particle-effect');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const filtered = users.filter(u =>
    (filter === "all" ||
      (filter === "active" && u.isActive) ||
      (filter === "banned" && !u.isActive)
    ) &&
    (u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const animateUserAction = (userId) => {
    setAnimatingUsers(prev => new Set([...prev, userId]));
    setTimeout(() => {
      setAnimatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }, 600);
  };

  const handleBan = async (user) => {
    try {
      animateUserAction(user._id);
    if (user.isActive) {
      await userService.banUser(user._id);
    } else {
      await userService.unbanUser(user._id);
    }
    setUsers(await userService.getAll());
    } catch (error) {
      console.error("Erreur lors du bannissement:", error);
      alert("Erreur lors du bannissement de l'utilisateur");
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur "${user.firstName} ${user.lastName}" ? Cette action est irréversible.`)) {
      try {
        animateUserAction(user._id);
        await userService.deleteUser(user._id);
        setTimeout(async () => {
          setUsers(await userService.getAll());
        }, 300);
        alert("Utilisateur supprimé avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression de l'utilisateur");
      }
    }
  };

  const handleView = (user) => {
    setViewUser(user);
    setRoleEdit(user.role);
  };

  const handleRoleChange = async () => {
    if (viewUser && roleEdit !== viewUser.role) {
      try {
      await userService.updateUserRole(viewUser._id, roleEdit);
      setUsers(await userService.getAll());
      setViewUser({ ...viewUser, role: roleEdit });
        alert("Rôle mis à jour avec succès");
      } catch (error) {
        console.error("Erreur lors de la mise à jour du rôle:", error);
        alert("Erreur lors de la mise à jour du rôle");
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin": return <Crown className="w-4 h-4 text-yellow-500" />;
      case "coach": return <Shield className="w-4 h-4 text-blue-500" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "coach": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-lg font-medium loading-pulse">Chargement des utilisateurs...</p>
            <div className="mt-2 flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 page-transition">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20 header-animate">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-xl icon-animate">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gestion des membres
              </h1>
              <p className="text-gray-600 mt-1">{users.length} utilisateurs au total</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 search-animate">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 icon-animate" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher par nom ou email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm shine-effect"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 icon-animate" />
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer shine-effect"
              >
                <option value="all">Tous les utilisateurs</option>
                <option value="active">Utilisateurs actifs</option>
                <option value="banned">Utilisateurs bannis</option>
        </select>
      </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-white/20 empty-state">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4 icon-animate" />
              <p className="text-gray-600 text-lg">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            filtered.map((user, index) => (
              <div
                key={user._id}
                className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20 group overflow-hidden user-card particle-effect ${
                  animatingUsers.has(user._id) ? 'animate-pulse scale-95' : 'hover:scale-[1.02]'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm icon-animate">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs role-badge ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="font-medium capitalize">{user.role}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-blue-50 rounded-lg p-2 text-center stats-animate">
                      <p className="text-2xl font-bold text-blue-600">{user.reservationsCount || 0}</p>
                      <p className="text-xs text-gray-600">Réservations</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2 text-center stats-animate delay-100">
                      <p className="text-2xl font-bold text-purple-600">{user.loyaltyPoints || 0}</p>
                      <p className="text-xs text-gray-600">Points</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center mb-3">
                    <div className={`rounded-lg px-3 py-1 text-center ${user.isActive ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="flex items-center space-x-1">
                        {user.isActive ? (
                          <UserCheck className="w-4 h-4 text-green-600 icon-animate" />
                        ) : (
                          <UserX className="w-4 h-4 text-red-600 icon-animate" />
                        )}
                        <span className={`text-xs font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {user.isActive ? 'Actif' : 'Banni'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => handleView(user)}
                      className="flex items-center space-x-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-all duration-300 hover:shadow-md flex-1 justify-center action-btn btn-animate"
                    >
                      <Eye className="w-3 h-3 icon-animate" />
                      <span>Détails</span>
                    </button>
                    <button
                      onClick={() => handleBan(user)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-all duration-300 hover:shadow-md flex-1 justify-center action-btn btn-animate ${
                        user.isActive 
                          ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      <Ban className="w-3 h-3 icon-animate" />
                      <span>{user.isActive ? "Bannir" : "Débannir"}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="flex items-center space-x-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-all duration-300 hover:shadow-md flex-1 justify-center action-btn btn-animate"
                    >
                      <Trash2 className="w-3 h-3 icon-animate" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      {viewUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 modal-animate">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl icon-animate">
                    {viewUser.firstName?.charAt(0)}{viewUser.lastName?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Détails utilisateur</h2>
                    <p className="text-gray-600">Informations complètes</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3 fade-in-element delay-100">
                    <label className="text-sm font-medium text-gray-600">Nom complet</label>
                    <p className="text-lg font-semibold text-gray-800">{viewUser.firstName} {viewUser.lastName}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 fade-in-element delay-200">
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg text-gray-800">{viewUser.email}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 fade-in-element delay-300">
                    <label className="text-sm font-medium text-gray-600">Statut</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {viewUser.isActive ? (
                        <UserCheck className="w-5 h-5 text-green-600 icon-animate" />
                      ) : (
                        <UserX className="w-5 h-5 text-red-600 icon-animate" />
                      )}
                      <span className={`font-semibold ${viewUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {viewUser.isActive ? "Actif" : "Banni"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 fade-in-element delay-400">
                    <label className="text-sm font-medium text-gray-600">Rôle</label>
                    {isAdmin ? (
                      <div className="flex items-center space-x-2 mt-2">
                        <select
                          value={roleEdit}
                          onChange={e => setRoleEdit(e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                  <option value="user">Utilisateur</option>
                  <option value="coach">Coach</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={handleRoleChange}
                  disabled={roleEdit === viewUser.role}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 btn-animate"
                >
                          Sauvegarder
                </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        {getRoleIcon(viewUser.role)}
                        <span className="text-lg font-semibold capitalize">{viewUser.role}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setViewUser(null)}
                  className="w-full mt-6 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg btn-animate fade-in-element delay-500"
                >
                  Fermer
                </button>
              </div>
          </div>
        </div>
      )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Animations pour les cartes utilisateur */
        .user-card {
          animation: fadeInScale 0.6s ease-out forwards;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .user-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* Animation pour le header */
        .header-animate {
          animation: slideInFromLeft 0.8s ease-out forwards;
        }

        /* Animation pour la barre de recherche */
        .search-animate {
          animation: slideInFromRight 0.8s ease-out 0.2s both;
        }

        /* Animation pour les boutons */
        .btn-animate {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-animate:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .btn-animate:active {
          transform: translateY(0);
        }

        /* Animation pour les badges de rôle */
        .role-badge {
          animation: bounceIn 0.6s ease-out forwards;
        }

        /* Animation pour les statistiques */
        .stats-animate {
          animation: scaleIn 0.5s ease-out forwards;
        }

        /* Animation pour le modal */
        .modal-animate {
          animation: fadeInScale 0.4s ease-out forwards;
        }

        /* Effet de brillance au survol */
        .shine-effect {
          position: relative;
          overflow: hidden;
        }

        .shine-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.5s;
        }

        .shine-effect:hover::before {
          left: 100%;
        }

        /* Animation pour les icônes */
        .icon-animate {
          transition: all 0.3s ease;
        }

        .icon-animate:hover {
          transform: rotate(15deg) scale(1.1);
        }

        /* Animation pour le loading */
        .loading-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* Animation pour les éléments qui apparaissent */
        .fade-in-element {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        /* Délai progressif pour les animations */
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }

        /* Animation pour les boutons d'action */
        .action-btn {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s;
        }

        .action-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        /* Animation pour les cartes vides */
        .empty-state {
          animation: float 3s ease-in-out infinite;
        }

        /* Animation pour les transitions de page */
        .page-transition {
          animation: fadeInScale 0.8s ease-out forwards;
        }

        /* Effet de particules au survol */
        .particle-effect {
          position: relative;
        }

        .particle-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                                   rgba(59, 130, 246, 0.1) 0%, 
                                   transparent 50%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .particle-effect:hover::after {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;
