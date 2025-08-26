import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, isAdmin, isCoach, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  let navLinks = [];
  if (!isAuthenticated) {
    navLinks = [
      { to: '/about', label: 'À propos' },
      { to: '/contact', label: 'Contact' },
      { to: '/login', label: 'Se connecter' },
      { to: '/register', label: "S'inscrire" },
    ];
  } else if (isAdmin) {
    navLinks = [
      { to: '/admin', label: 'Tableau de bord' },
      { to: '/admin/users', label: 'Gérer les utilisateurs' },
      { to: '/admin/coaches', label: 'Gérer les coachs' },
      { to: '/admin/activities', label: 'Gérer les activités' },
      { to: '/admin/notifications', label: 'Envoyer notifications' },
      { to: '/admin/contact', label: 'Messages Contact' },
      { to: '/about', label: 'À propos' },
      { to: '/contact', label: 'Contact' },
      { to: '/profile', label: 'Profil' },
    ];
  } else if (isCoach) {
    navLinks = [
      { to: '/coach/activities', label: 'Gérer les activités' },
      { to: '/coach/reviews', label: 'Voir les avis' },
      { to: '/coach/reservations', label: 'Gérer les réservations' },
      { to: '/coach/messages', label: 'Messages Contact' },
      { to: '/about', label: 'À propos' },
      { to: '/contact', label: 'Contact' },
      { to: '/profile', label: 'Modifier le profil' },
    ];
  } else {
    navLinks = [
      { to: '/activities', label: 'Consulter les activités' },
      { to: '/reservations', label: 'Mes réservations' },
      { to: '/messages', label: 'Mes messages' },
      { to: '/about', label: 'À propos' },
      { to: '/contact', label: 'Contact' },
      { to: '/profile', label: 'Profil' },
    ];
  }
  const paletteColors = [
    'from-[#141414] to-[#003c3c]',
    'from-[#003c3c] to-[#a0f000]',
    'from-[#a0f000] to-[#143c3c]',
    'from-[#143c3c] to-[#000000]',
    'from-[#000000] to-[#a0f000]',
    'from-[#a0f000] to-[#003c3c]',
    'from-[#003c3c] to-[#141414]',
    'from-[#143c3c] to-[#a0f000]'
  ];

  const getRandomPaletteColor = () => paletteColors[Math.floor(Math.random() * paletteColors.length)];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm shadow-none border-none">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 bg-gradient-to-br ${getRandomPaletteColor()} text-white group-hover:scale-125 group-hover:rotate-180 group-hover:skew-x-12 shadow-2xl animate-pulse`}>
                  <span className="text-xl font-black">FR</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs transition-all duration-300 text-black font-black animate-bounce">
                    Fill Rouge Club
                  </p>
                </div>
              </Link>
            </div>
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative group px-4 py-2 rounded-2xl font-black transition-all duration-500 text-sm transform hover:scale-110 hover:rotate-2 ${
                    isActive(link.to)
                      ? `bg-black text-white shadow-2xl animate-pulse` 
                      : `text-black hover:text-white hover:bg-black hover:shadow-2xl`
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <span className="relative z-10">{link.label}</span>
                  <div className={`absolute inset-0 rounded-2xl bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-black transition-all duration-500 ${
                    isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></div>
                </Link>
              ))}
            </div>
            <div className="lg:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-3 rounded-full transition-all duration-500 text-white hover:scale-110 hover:rotate-12 bg-black shadow-2xl`}
              >
                {menuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-transparent backdrop-blur-none border-none shadow-none">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="grid grid-cols-1 gap-3">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 py-3 rounded-2xl font-black transition-all duration-500 text-sm transform hover:scale-105 hover:rotate-1 ${
                      isActive(link.to)
                        ? `bg-black text-white shadow-2xl animate-pulse`
                        : `text-black hover:text-white hover:bg-black hover:shadow-2xl`
                    }`}
                    style={{
                      animationDelay: `${index * 150}ms`
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
