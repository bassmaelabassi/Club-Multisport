import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAdmin, isCoach, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

<<<<<<< HEAD
  // Helper pour savoir si le lien est actif
  const isActive = (path) => location.pathname === path;

  // Liens par rôle
  let navLinks = [];
  if (!isAuthenticated) {
    navLinks = [
      { to: '/', label: 'Accueil' },
      { to: '/about', label: 'À propos' },
      { to: '/contact', label: 'Contact' },
      { to: '/login', label: 'Se connecter' },
      { to: '/register', label: 'S\'inscrire' },
=======
  const isActive = (path) => location.pathname === path;

  let navLinks = [];
  if (!isAuthenticated) {
    navLinks = [
      { to: '/login', label: 'Se connecter' },
      { to: '/register', label: 'S’inscrire' },
>>>>>>> 1e95eb9508b1e4c7a0e489aa846f21b96edc3e12
    ];
  } else if (isAdmin) {
    navLinks = [
      { to: '/admin', label: 'Tableau de bord' },
      { to: '/admin/users', label: 'Gérer les utilisateurs' },
      { to: '/admin/coaches', label: 'Gérer les coachs' },
      { to: '/admin/activities', label: 'Gérer les activités' },
      { to: '/admin/export', label: 'Exporter données' },
      { to: '/admin/notifications', label: 'Envoyer notifications' },
      { to: '/profile', label: 'Profil' },
    ];
  } else if (isCoach) {
    navLinks = [
      { to: '/coach/activities', label: 'Gérer les activités' },
      { to: '/coach/reviews', label: 'Voir les avis' },
      { to: '/coach/reservations', label: 'Gérer les réservations' },
      { to: '/profile', label: 'Modifier le profil' },
    ];
  } else {
<<<<<<< HEAD
    // Utilisateur simple
=======
>>>>>>> 1e95eb9508b1e4c7a0e489aa846f21b96edc3e12
    navLinks = [
      { to: '/profile', label: 'Profil' },
      { to: '/activities', label: 'Consulter les activités' },
      { to: '/reservations', label: 'Mes réservations' },
    ];
  }

  return (
    <>
<<<<<<< HEAD
      {/* Navbar principale */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo et nom */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-blue-600 to-blue-800 text-white group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-xl font-bold">CS</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-800">Club Sportif</h1>
                  <p className="text-xs transition-colors duration-300 text-gray-600">
                    Excellence & Performance
=======
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-blue-600 to-blue-800 text-white group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-xl font-bold">AE</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs transition-colors duration-300 text-gray-600">
                    Where Champions Train
>>>>>>> 1e95eb9508b1e4c7a0e489aa846f21b96edc3e12
                  </p>
                </div>
              </Link>
            </div>
<<<<<<< HEAD

            {/* Navigation desktop */}
=======
>>>>>>> 1e95eb9508b1e4c7a0e489aa846f21b96edc3e12
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative group px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm ${
                    isActive(link.to)
                      ? 'bg-blue-900 text-white shadow-lg' 
                      : 'text-gray-700 hover:text-blue-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{link.label}</span>
<<<<<<< HEAD
                  {/* Effet de soulignement animé */}
=======
>>>>>>> 1e95eb9508b1e4c7a0e489aa846f21b96edc3e12
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-orange-500 transition-all duration-300 ${
                    isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></div>
                </Link>
              ))}
            </div>
<<<<<<< HEAD

            {/* Bouton menu mobile */}
=======
>>>>>>> 1e95eb9508b1e4c7a0e489aa846f21b96edc3e12
            <div className="lg:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-xl transition-all duration-300 text-gray-700 hover:bg-gray-100"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-5 h-0.5 transition-all duration-300 bg-gray-700 ${menuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                  <span className={`block w-5 h-0.5 my-0.5 transition-all duration-300 bg-gray-700 ${menuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-5 h-0.5 transition-all duration-300 bg-gray-700 ${menuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
<<<<<<< HEAD

        {/* Menu mobile */}
=======
>>>>>>> 1e95eb9508b1e4c7a0e489aa846f21b96edc3e12
        {menuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="grid grid-cols-1 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
                      isActive(link.to)
                        ? 'bg-blue-900 text-white shadow-lg'
                        : 'text-gray-700 hover:text-blue-900 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
<<<<<<< HEAD

      {/* Spacer pour éviter que le contenu soit caché sous la navbar fixe */}
=======
>>>>>>> 1e95eb9508b1e4c7a0e489aa846f21b96edc3e12
      <div className="h-20"></div>
    </>
  );
};

<<<<<<< HEAD
export default Navbar;
=======
export default Navbar;
>>>>>>> 1e95eb9508b1e4c7a0e489aa846f21b96edc3e12
