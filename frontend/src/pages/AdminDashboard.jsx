import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { userService } from "../services/userService"
import activityService from "../services/activityService"
import { reservationService } from "../services/reservationService"
import { useAuth } from "../context/AuthContext";
import { 
  Users, 
  Activity, 
  GraduationCap, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Star,
  ArrowRight,
  BarChart3,
  Settings,
  Bell,
  Eye,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalActivities: 0,
    totalReservations: 0,
    totalCoaches: 0,
  });
  const [recentReservations, setRecentReservations] = useState([])
  const [popularActivities, setPopularActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, activities, reservations] = await Promise.all([
          userService.getAll(),
          activityService.getAll(),
          reservationService.getAll(),
        ]);
        setStats({
          totalUsers: users.filter(u => u.role === "user").length,
          totalActivities: activities.length,
          totalReservations: reservations.length,
          totalCoaches: users.filter(u => u.role === "coach").length,
        });
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
    }
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStatusText = (status) => {
    const texts = {
      pending: "En attente",
      confirmed: "Confirmée",
      cancelled: "Annulée",
      completed: "Terminée",
    }
    return texts[status] || status
  }

  const showWelcomeNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  useEffect(() => {
    if (!loading) {
      showWelcomeNotification();
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#003c3c] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#22b455] mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement du tableau de bord...</p>
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
            Tableau de Bord Admin
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Gérez votre plateforme et surveillez les activités
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-[#92e5a1]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#22b455] shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black/70 text-sm font-medium">Utilisateurs</p>
                <p className="text-3xl font-bold text-black">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-[#22b455] to-[#92e5a1] rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-[#ffb480]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#ffb480] shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black/70 text-sm font-medium">Activités</p>
                <p className="text-3xl font-bold text-black">{stats.totalActivities}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-[#ffb480] to-[#59adf6] rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-[#59adf6]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#59adf6] shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black/70 text-sm font-medium">Réservations</p>
                <p className="text-3xl font-bold text-black">{stats.totalReservations}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-[#59adf6] to-[#ffb480] rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-[#92e5a1]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#22b455] shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black/70 text-sm font-medium">Coaches</p>
                <p className="text-3xl font-bold text-black">{stats.totalCoaches}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-[#22b455] to-[#92e5a1] rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-[#22b455] to-[#92e5a1] rounded-full mr-4"></div>
              Actions Rapides
            </h2>
            <div className="flex items-center space-x-2 bg-[#22b455]/20 px-3 py-2 rounded-full border border-[#22b455]">
              <div className="w-2 h-2 bg-[#22b455] rounded-full animate-pulse"></div>
              <span className="text-sm text-white font-medium">Système opérationnel</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Link to="/admin/activities" className="group">
              <div className="bg-[#92e5a1]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#22b455] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#22b455] to-[#92e5a1] rounded-xl flex items-center justify-center">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#22b455] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-black mb-2">Gérer les Activités</h3>
                <p className="text-black/70 text-sm">Créer, modifier et organiser vos activités</p>
              </div>
            </Link>

            <Link to="/admin/users" className="group">
              <div className="bg-[#ffb480]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#ffb480] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ffb480] to-[#59adf6] rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#ffb480] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-black mb-2">Gérer les Utilisateurs</h3>
                <p className="text-black/70 text-sm">Suivre et gérer vos membres</p>
              </div>
            </Link>

            <Link to="/admin/coaches" className="group">
              <div className="bg-[#59adf6]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#59adf6] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#59adf6] to-[#ffb480] rounded-xl flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#59adf6] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-black mb-2">Gérer les Coachs</h3>
                <p className="text-black/70 text-sm">Coordonner votre équipe de coachs</p>
              </div>
            </Link>

            <Link to="/admin/notifications" className="group">
              <div className="bg-[#92e5a1]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#22b455] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#22b455] to-[#92e5a1] rounded-xl flex items-center justify-center">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#22b455] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-black mb-2">Notifications</h3>
                <p className="text-black/70 text-sm">Communiquer avec vos membres</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="bg-[#ffb480]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#ffb480] shadow-xl">
            <h3 className="text-xl font-bold text-black mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-[#ffb480]" />
              Activités Populaires
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#ffb480] rounded-full"></div>
                    <span className="font-medium text-black">Activité {i}</span>
                  </div>
                  <span className="text-black/70 font-medium">{Math.floor(Math.random() * 50) + 20} réservations</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#59adf6]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#59adf6] shadow-xl">
            <h3 className="text-xl font-bold text-black mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-[#59adf6]" />
              Réservations Récentes
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#59adf6] rounded-full"></div>
                    <span className="font-medium text-black">Réservation {i}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    i === 1 ? 'bg-yellow-100 text-yellow-800' :
                    i === 2 ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {i === 1 ? 'En attente' : i === 2 ? 'Confirmée' : 'Terminée'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ffb480]/20 to-[#59adf6]/20 rounded-2xl p-6 border border-[#ffb480]/30 backdrop-blur-xl">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              🚀 Votre club est en pleine croissance !
            </h3>
            <p className="text-white/80">
              Continuez à développer vos activités et à engager vos membres pour un succès encore plus grand.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
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
        
        /* Responsive breakpoints */
        @media (max-width: 768px) {
          .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 768px) and (max-width: 1024px) {
          .grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 1024px) {
          .grid-cols-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard
