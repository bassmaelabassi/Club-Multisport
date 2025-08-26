import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  Users,
  Activity,
  Calendar,
  Star,
  Plus,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  Heart,
  Zap,
  Target,
  Crown,
  Dumbbell,
  Waves,
  Music,
  Shield,
  CheckCircle,
  ArrowRight,
  Play,
  BookOpen,
  Users2,
  Trophy
} from "lucide-react"

const popularActivities = [
    {
      id: "1",
      name: "Yoga Flow Matinal",
      description: "Réveillez votre corps en douceur avec cette séance de yoga dynamique",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=80",
      category: "Bien-être",
    coach: "Sarah Chen",
        rating: 4.9,
      duration: "60 min",
    level: "Débutant"
    },
    {
      id: "2",
      name: "CrossFit Intense",
      description: "Entraînement fonctionnel haute intensité pour repousser vos limites",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=500&q=80",
      category: "Fitness",
    coach: "Mike Johnson",
        rating: 4.7,
      duration: "45 min",
    level: "Avancé"
    },
    {
      id: "3",
      name: "Danse Latine",
      description: "Salsa, bachata et merengue dans une ambiance festive et chaleureuse",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=500&q=80",
      category: "Danse",
    coach: "Isabella Rodriguez",
      rating: 4.9,
      duration: "75 min",
    level: "Intermédiaire"
    },
    {
      id: "4",
      name: "Natation Technique",
      description: "Perfectionnez votre technique de nage avec un coach professionnel",
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=500&q=80",
      category: "Aquatique",
    coach: "Thomas Dubois",
        rating: 4.8,
      duration: "50 min",
    level: "Intermédiaire"
  }
]

const activityCategories = [
  {
    name: "Fitness & Musculation",
      icon: Dumbbell,
    description: "Entraînements intensifs et programmes de musculation personnalisés",
    color: "from-red-500 to-pink-600"
  },
  {
    name: "Bien-être & Relaxation",
    icon: Heart,
    description: "Yoga, pilates et méditation pour l'équilibre corps-esprit",
    color: "from-green-500 to-teal-600"
  },
  {
    name: "Danse & Expression",
      icon: Music,
    description: "Danse latine, hip-hop et danse contemporaine",
    color: "from-purple-500 to-indigo-600"
  },
  {
    name: "Sports Aquatiques",
    icon: Waves,
    description: "Natation, aquagym et sports nautiques",
    color: "from-blue-500 to-cyan-600"
  }
]

const platformBenefits = [
  {
    icon: Users2,
    title: "Communauté Active",
    description: "Rejoignez une communauté de passionnés du sport et du bien-être"
  },
    {
      icon: Award,
      title: "Coachs Certifiés",
    description: "Des professionnels qualifiés pour vous accompagner dans votre progression"
    },
    {
      icon: Clock,
    title: "Flexibilité Totale",
    description: "Réservez vos cours selon vos disponibilités, 7j/7"
  },
  {
    icon: Shield,
    title: "Environnement Sécurisé",
    description: "Un espace sécurisé et bienveillant pour tous les niveaux"
  }
]

const Home = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141414] via-[#003c3c] to-[#143c3c] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#003c3c] to-[#143c3c] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#a0f000] to-[#003c3c] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-br from-[#143c3c] to-[#003c3c] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 to-[#003c3c]/80"></div>
        <img 
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1400&q=80" 
          alt="Club Sportif Fill Rouge" 
          className="w-full h-[70vh] object-cover" 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-5xl px-6">
            <h1 className="text-6xl md:text-7xl font-black mb-6">
              Bienvenue au
              <span className="block bg-gradient-to-r from-[#a0f000] via-[#ffffff] to-[#003c3c] bg-clip-text text-transparent">
                Fill Rouge Club
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Découvrez une plateforme innovante qui révolutionne l'expérience sportive. 
              Rejoignez notre communauté et transformez votre passion en performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
              <button
                onClick={() => navigate('/register')}
                    className="px-8 py-4 bg-gradient-to-r from-[#a0f000] to-[#003c3c] text-white font-bold rounded-2xl text-lg hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-2"
              >
                    <Plus className="w-6 h-6" />
                    Commencer l'aventure
              </button>
              <button 
                    onClick={() => navigate('/activities')}
                    className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-2xl text-lg hover:bg-white/30 transition-all duration-300 border border-white/30 flex items-center justify-center gap-2"
                  >
                    <Play className="w-6 h-6" />
                    Découvrir les activités
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => navigate('/activities')}
                  className="px-8 py-4 bg-gradient-to-r from-[#a0f000] to-[#003c3c] text-white font-bold rounded-2xl text-lg hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-2"
                >
                  <Activity className="w-6 h-6" />
                  Voir mes activités
              </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black bg-gradient-to-r from-[#a0f000] via-[#ffffff] to-[#003c3c] bg-clip-text text-transparent mb-6">
            Une Plateforme Révolutionnaire
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Fill Rouge Club n'est pas qu'un simple club sportif. C'est une expérience complète 
            qui connecte passionnés, coachs et activités dans un écosystème numérique innovant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {platformBenefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center group hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="inline-flex p-4 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full mb-6 group-hover:scale-110 transition-transform">
                <benefit.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
              <p className="text-white/80 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-16">
          <h3 className="text-4xl font-black bg-gradient-to-r from-[#a0f000] via-[#ffffff] to-[#003c3c] bg-clip-text text-transparent mb-6">
            Nos Catégories d'Activités
          </h3>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Découvrez la diversité de nos programmes adaptés à tous les niveaux et objectifs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {activityCategories.map((category, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 group hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 bg-gradient-to-r ${category.color} rounded-full group-hover:scale-110 transition-transform`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white">{category.name}</h4>
              </div>
              <p className="text-white/80 leading-relaxed text-lg">{category.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-16">
          <h3 className="text-4xl font-black bg-gradient-to-r from-[#a0f000] via-[#ffffff] to-[#003c3c] bg-clip-text text-transparent mb-6">
            Activités Populaires
          </h3>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Les cours les plus appréciés par notre communauté
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {popularActivities.map((activity) => (
            <div 
              key={activity.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 group hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => navigate('/activities')}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={activity.image} 
                  alt={activity.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {activity.category}
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#a0f000] transition-colors">
                  {activity.name}
                </h4>
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-white/80">
                    <Clock className="w-4 h-4" />
                    {activity.duration}
                  </div>
                  <div className="flex items-center gap-1 text-[#a0f000]">
                    <Star className="w-4 h-4 fill-current" />
                    {activity.rating}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-3xl p-12 border border-white/20">
            <h3 className="text-4xl font-black text-white mb-6">
              Prêt à Transformer Votre Vie ?
            </h3>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Rejoignez Fill Rouge Club et commencez votre transformation dès aujourd'hui. 
              Notre communauté vous attend !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
            <button
              onClick={() => navigate('/register')}
                    className="px-8 py-4 bg-white text-[#003c3c] font-bold rounded-2xl text-lg hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-2"
            >
                    <Trophy className="w-6 h-6" />
                    Rejoindre le Club
            </button>
            <button 
                    onClick={() => navigate('/about')}
                    className="px-8 py-4 border-2 border-white text-white font-bold rounded-2xl text-lg hover:bg-white hover:text-[#003c3c] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-6 h-6" />
                    En Savoir Plus
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => navigate('/activities')}
                  className="px-8 py-4 bg-white text-[#003c3c] font-bold rounded-2xl text-lg hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-6 h-6" />
                  Explorer les Activités
            </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
