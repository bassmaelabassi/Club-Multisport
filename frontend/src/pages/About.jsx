import React from "react";
import { 
  Award, 
  Users, 
  Target, 
  Heart, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Trophy,
  Shield,
  Zap,
  User,
  Calendar,
  TrendingUp,
  Globe,
  CheckCircle,
  ArrowRight,
  Activity
} from "lucide-react";

const About = () => {
  // Données des coachs
  const coaches = [
    {
      id: 1,
      name: "Ahmed Benali",
      position: "Directeur Sportif & Coach Fitness",
      experience: "15 ans",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      specialties: ["Fitness", "CrossFit", "Musculation", "Nutrition"],
      description: "Expert en conditionnement physique et en développement de programmes personnalisés. Ancien athlète professionnel.",
      achievements: ["Champion national de fitness 2018", "Certifié CrossFit Level 2", "Diplômé en nutrition sportive"]
    },
    {
      id: 2,
      name: "Fatima Zahra",
      position: "Coach Yoga & Pilates",
      experience: "12 ans",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=300&q=80",
      specialties: ["Yoga", "Pilates", "Méditation", "Thérapie par le mouvement"],
      description: "Spécialiste en bien-être et relaxation, certifiée en yoga thérapeutique et pilates clinique.",
      achievements: ["Instructrice certifiée Yoga Alliance", "Spécialiste en yoga pour seniors", "Formée en yoga prénatal"]
    },
    {
      id: 3,
      name: "Karim El Mansouri",
      position: "Coach Arts Martiaux & Self-défense",
      experience: "18 ans",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
      specialties: ["Kickboxing", "MMA", "Self-défense", "Conditionnement"],
      description: "Champion national et instructeur certifié en arts martiaux mixtes. Expert en self-défense urbaine.",
      achievements: ["Champion national de kickboxing 2015-2017", "Ceinture noire 3ème dan", "Instructeur certifié MMA"]
    },
    {
      id: 4,
      name: "Amina Tazi",
      position: "Coach Danse & Expression Corporelle",
      experience: "10 ans",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
      specialties: ["Danse Latine", "Zumba", "Hip-Hop", "Expression corporelle"],
      description: "Danseuse professionnelle passionnée par l'enseignement et la transmission de la joie de danser.",
      achievements: ["Championne de salsa 2019", "Instructrice Zumba certifiée", "Formée en danse-thérapie"]
    }
  ];

  // Valeurs du club
  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Nous transmettons notre passion du sport à chaque membre avec enthousiasme et dévouement.",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque cours, service et interaction avec nos membres.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Nous créons une communauté soudée, bienveillante et inclusive pour tous les passionnés.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "La sécurité physique et émotionnelle de nos membres est notre priorité absolue.",
      color: "from-purple-500 to-indigo-600"
    }
  ];

  // Pourquoi nous choisir
  const advantages = [
    {
      icon: Award,
      title: "Coachs Certifiés",
      description: "Tous nos coachs sont diplômés, certifiés et en formation continue dans leurs disciplines.",
      stat: "100%"
    },
    {
      icon: Clock,
      title: "Horaires Flexibles",
      description: "Ouvert 7j/7 de 6h à 23h pour s'adapter à votre emploi du temps et votre rythme.",
      stat: "7j/7"
    },
    {
      icon: Zap,
      title: "Équipements Modernes",
      description: "Matériel de dernière génération et technologies innovantes pour des entraînements optimaux.",
      stat: "Top"
    },
    {
      icon: Star,
      title: "Programmes Personnalisés",
      description: "Des programmes adaptés à vos objectifs, votre niveau et vos préférences personnelles.",
      stat: "100%"
    }
  ];

  // Statistiques du club
  const stats = [
    { number: "13+", label: "Années d'Expérience", icon: Calendar },
    { number: "5000+", label: "Membres Satisfaits", icon: Users },
    { number: "50+", label: "Activités Différentes", icon: Activity },
    { number: "98%", label: "Taux de Satisfaction", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141414] via-[#003c3c] to-[#143c3c] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#003c3c] to-[#143c3c] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#a0f000] to-[#003c3c] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-br from-[#143c3c] to-[#003c3c] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 to-[#003c3c]/80"></div>
        <img 
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1400&q=80" 
          alt="Fill Rouge Club" 
          className="w-full h-[70vh] object-cover" 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-5xl px-6">
            <h1 className="text-6xl md:text-7xl font-black mb-6">
              À Propos de
              <span className="block bg-gradient-to-r from-[#a0f000] via-[#ffffff] to-[#003c3c] bg-clip-text text-transparent">
                Fill Rouge Club
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Découvrez l'histoire, la mission et les valeurs qui font de notre plateforme 
              sportive un lieu unique d'innovation et d'excellence
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Notre Histoire */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black bg-gradient-to-r from-[#a0f000] via-[#ffffff] to-[#003c3c] bg-clip-text text-transparent mb-6">
              Notre Histoire
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-[#a0f000] to-[#003c3c] mx-auto"></div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-white text-lg leading-relaxed mb-6">
                  Fondé en 2010, Fill Rouge Club est né d'une vision révolutionnaire : créer une plateforme 
                  qui transcende le concept traditionnel de club sportif en intégrant technologie et innovation.
                </p>
                <p className="text-white text-lg leading-relaxed mb-6">
                  Depuis plus de 13 ans, nous avons accompagné des milliers de membres dans leur parcours sportif, 
                  en nous adaptant constamment aux nouvelles tendances et aux besoins de notre communauté.
                </p>
                <p className="text-white text-lg leading-relaxed">
                  Notre engagement envers l'excellence et l'innovation nous a permis de devenir une référence 
                  dans le domaine du fitness et du bien-être, en créant un écosystème numérique unique.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-8 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full mb-6">
                  <Trophy className="h-16 w-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">13+ Années d'Excellence</h3>
                <p className="text-white/80">Plus d'une décennie au service de votre bien-être</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex p-6 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-black text-[#a0f000] mb-2">{stat.number}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notre Mission et Nos Valeurs */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black bg-gradient-to-r from-[#a0f000] via-[#ffffff] to-[#003c3c] bg-clip-text text-transparent mb-6">
              Notre Mission et Nos Valeurs
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-[#a0f000] to-[#003c3c] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 text-center group hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className={`inline-flex p-6 bg-gradient-to-r ${value.color} rounded-full mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-white/80 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Nos Avantages */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black bg-gradient-to-r from-[#a0f000] via-[#ffffff] to-[#003c3c] bg-clip-text text-transparent mb-6">
              Pourquoi Nous Choisir ?
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-[#a0f000] to-[#003c3c] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 group hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full group-hover:scale-110 transition-transform">
                    <advantage.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-black text-[#a0f000]">{advantage.stat}</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{advantage.title}</h3>
                <p className="text-white/80 leading-relaxed text-lg">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notre Équipe */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black bg-gradient-to-r from-[#a0f000] via-[#ffffff] to-[#003c3c] bg-clip-text text-transparent mb-6">
              Notre Équipe d'Experts
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-[#a0f000] to-[#003c3c] mx-auto"></div>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Des professionnels passionnés et certifiés pour vous accompagner dans votre transformation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {coaches.map((coach) => (
              <div key={coach.id} className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 group hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{coach.name}</h3>
                    <p className="text-[#a0f000] font-medium mb-3">{coach.position}</p>
                    <div className="bg-white/20 rounded-full px-4 py-2 mb-4 inline-block">
                      <span className="text-white text-sm font-medium">{coach.experience} d'expérience</span>
                    </div>
                    <p className="text-white/80 mb-4 leading-relaxed">{coach.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {coach.specialties.map((specialty, index) => (
                        <span key={index} className="bg-[#003c3c]/50 text-white px-3 py-1 rounded-full text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {coach.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-2 text-white/70 text-sm">
                          <CheckCircle className="w-4 h-4 text-[#a0f000]" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-3xl p-12 border border-white/20">
            <h3 className="text-4xl font-black text-white mb-6">Prêt à Rejoindre Notre Communauté ?</h3>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Commencez votre parcours vers une vie plus saine et active dès aujourd'hui. 
              Notre équipe d'experts vous attend !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#003c3c] hover:bg-white/90 font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl transition-all duration-300 flex items-center justify-center gap-2">
                <ArrowRight className="w-6 h-6" />
                Commencer Maintenant
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-[#003c3c] font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-300 flex items-center justify-center gap-2">
                <Globe className="w-6 h-6" />
                Découvrir Plus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

