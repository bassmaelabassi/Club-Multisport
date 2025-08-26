import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Check, Facebook, Instagram, Twitter, Youtube, X, CheckCircle, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { contactService } from "../services/contactService";
import { userService } from "../services/userService";
import activityService from "../services/activityService";
import { useAuth } from "../context/AuthContext";

const Contact = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [linkedActivityId, setLinkedActivityId] = useState(null);
  const [linkedCoachId, setLinkedCoachId] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [coachLoading, setCoachLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const activityId = params.get('activityId');
    const coachId = params.get('coachId');
    if (activityId) setLinkedActivityId(activityId);
    if (coachId) setLinkedCoachId(coachId);
  }, [location.search]);

  useEffect(() => {
    const loadCoaches = async () => {
      try {
        setCoachLoading(true);
        const list = await userService.getCoaches();
        setCoaches(Array.isArray(list) ? list : []);
      } catch (e) {
        setCoaches([]);
      } finally {
        setCoachLoading(false);
      }
    };
    loadCoaches();
  }, []);

  useEffect(() => {
    const loadActivitiesForCoach = async () => {
      if (!linkedCoachId) {
        setActivities([]);
        return;
      }
      try {
        setActivityLoading(true);
        const list = await activityService.getByCoach(linkedCoachId);
        setActivities(Array.isArray(list) ? list : []);
      } catch (e) {
        setActivities([]);
      } finally {
        setActivityLoading(false);
      }
    };
    loadActivitiesForCoach();
  }, [linkedCoachId]);
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('email', user.email || '');
      
      setForm(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user, setValue]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const subjectNormalized = (data.subject && String(data.subject).trim()) || 'general';
      const safeActivityId = linkedActivityId && String(linkedActivityId).length === 24 ? linkedActivityId : undefined;
      const safeCoachId = linkedCoachId && String(linkedCoachId).length === 24 ? linkedCoachId : undefined;

      const contactData = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        subject: subjectNormalized,
        message: data.message,
        activityId: safeActivityId,
        coachId: safeCoachId
      };

      const result = await contactService.sendMessage(contactData);
      
      setSubmitted(true);
      setForm({ firstName: "", lastName: "", email: "", subject: "", message: "" });
      reset(); 
      navigate('/messages?success=1', { state: { newContact: result?.contact || null } });
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      showToast(err.response?.data?.message || "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Adresse",
      details: "123 Avenue du Club Sportif, Quartier Maarif, Casablanca, Maroc",
      color: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-200"
    },
    {
      icon: Phone,
      title: "Téléphone",
      details: "+212 6 12 34 56 78",
      color: "from-green-500 to-green-600",
      shadow: "shadow-green-200"
    },
    {
      icon: Mail,
      title: "Email",
      details: "contact@clubmultisport.ma",
      color: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-200"
    },
    {
      icon: Clock,
      title: "Horaires",
      details: "Lun-Dim: 6h00 - 23h00",
      color: "from-orange-500 to-orange-600",
      shadow: "shadow-orange-200"
    }
  ];

  const faqs = [
    {
      question: "Comment m'inscrire au club ?",
      answer: "Vous pouvez vous inscrire en ligne via notre site web ou directement au club pendant nos heures d'ouverture."
    },
    {
      question: "Quels sont les horaires d'ouverture ?",
      answer: "Nous sommes ouverts 7j/7 de 6h00 à 23h00 pour s'adapter à votre emploi du temps."
    },
    {
      question: "Proposez-vous des cours d'essai ?",
      answer: "Oui, nous offrons une séance d'essai gratuite pour vous permettre de découvrir nos activités."
    },
    {
      question: "Y a-t-il un parking disponible ?",
      answer: "Oui, nous disposons d'un parking gratuit pour tous nos membres."
    },
    {
      question: "Proposez-vous des programmes pour débutants ?",
      answer: "Absolument ! Nous avons des programmes adaptés à tous les niveaux, y compris les débutants."
    },
    {
      question: "Comment réserver un cours ?",
      answer: "Vous pouvez réserver vos cours via notre application mobile ou directement au club."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141414] via-[#003c3c] to-[#143c3c] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#003c3c] to-[#143c3c] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#a0f000] to-[#003c3c] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-br from-[#143c3c] to-[#003c3c] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block p-8 rounded-3xl bg-white/10 backdrop-blur-lg border border-[#a0f000] shadow-2xl mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full mb-6 shadow-lg">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-[#a0f000] via-[#ffffff] to-[#003c3c] bg-clip-text text-transparent mb-4">
              Contactez-Nous
            </h1>
            <p className="text-[#ffffff] text-lg max-w-2xl mx-auto leading-relaxed">
              Nous sommes là pour vous aider et répondre à toutes vos questions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-[#a0f000]">
              <h2 className="text-2xl font-bold text-[#ffffff] mb-6">Nos Coordonnées</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#ffffff]">Adresse</h3>
                    <p className="text-[#ffffff]/80">123 Rue du Sport, 75001 Paris, France</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#ffffff]">Téléphone</h3>
                    <p className="text-[#ffffff]/80">+33 1 23 45 67 89</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#ffffff]">Email</h3>
                    <p className="text-[#ffffff]/80">contact@fillrouge.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#ffffff]">Horaires d'ouverture</h3>
                    <p className="text-[#ffffff]/80">Lundi - Dimanche : 6h00 - 23h00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-[#a0f000]">
              <h2 className="text-2xl font-bold text-[#ffffff] mb-6">Suivez-Nous</h2>
              
              <div className="flex gap-4">
                <a href="#" className="p-3 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full hover:from-[#a0f000] hover:to-[#003c3c] transition-all duration-300 transform hover:scale-110">
                  <Facebook className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="p-3 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full hover:from-[#a0f000] hover:to-[#003c3c] transition-all duration-300 transform hover:scale-110">
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="p-3 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full hover:from-[#a0f000] hover:to-[#003c3c] transition-all duration-300 transform hover:scale-110">
                  <Twitter className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="p-3 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full hover:from-[#a0f000] hover:to-[#003c3c] transition-all duration-300 transform hover:scale-110">
                  <Youtube className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-[#a0f000]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#ffffff]">Envoyez-nous un Message</h2>
              {isAuthenticated && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  <Check className="w-4 h-4" />
                  <span>Connecté en tant que {user?.firstName} {user?.lastName}</span>
                </div>
              )}
            </div>

            {(linkedActivityId || linkedCoachId) && (
              <div className="mb-4 p-3 rounded-xl bg-white/10 border border-[#a0f000] text-[#ffffff]">
                Ce message sera transmis au coach concerné.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-[#ffffff] mb-2">
                  Coach destinataire {" "}
                  <span className="text-[#a0f000]">(requis)</span>
                </label>
                <select
                  value={linkedCoachId || ''}
                  onChange={(e)=>{
                    const v = e.target.value || null;
                    setLinkedCoachId(v);
                    setLinkedActivityId(null);
                  }}
                  className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] transition-all duration-300"
                >
                  <option value="">Sélectionner un coach</option>
                  {coachLoading ? (
                    <option value="" disabled>Chargement des coachs...</option>
                  ) : (
                    coaches.map((c)=> (
                      <option key={c._id} value={c._id} className="text-black">
                        {(c.firstName || '') + ' ' + (c.lastName || '')}
                      </option>
                    ))
                  )}
                </select>
                <p className="text-xs text-white/70 mt-1">L’équipe renseignera la liste des vrais entraîneurs.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#ffffff] mb-2">
                  Activité concernée (optionnel)
                </label>
                <select
                  value={linkedActivityId || ''}
                  onChange={(e)=> setLinkedActivityId(e.target.value || null)}
                  disabled={!linkedCoachId}
                  className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Sélectionner une activité</option>
                  {activityLoading ? (
                    <option value="" disabled>Chargement des activités...</option>
                  ) : (
                    activities.map((a)=> (
                      <option key={a._id} value={a._id} className="text-black">
                        {a.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#ffffff] mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...register('firstName', { required: 'Le prénom est requis' })}
                    className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300"
                    placeholder="Votre prénom"
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-[#ffffff] mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...register('lastName', { required: 'Le nom est requis' })}
                    className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300"
                    placeholder="Votre nom"
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#ffffff] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', { 
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Adresse email invalide'
                    }
                  })}
                  className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300"
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#ffffff] mb-2">
                  Sujet *
                </label>
                <select
                  id="subject"
                  {...register('subject', { required: 'Le sujet est requis' })}
                  className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] transition-all duration-300"
                >
                  <option value="">Sélectionner un sujet</option>
                  <option value="general">Question générale</option>
                  <option value="reservation">Réservation</option>
                  <option value="technical">Problème technique</option>
                  <option value="feedback">Retour d'expérience</option>
                  <option value="other">Autre</option>
                </select>
                {errors.subject && (
                  <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#ffffff] mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={6}
                  {...register('message', { 
                    required: 'Le message est requis',
                    minLength: {
                      value: 10,
                      message: 'Le message doit contenir au moins 10 caractères'
                    }
                  })}
                  className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300 resize-none"
                  placeholder="Décrivez votre demande..."
                />
                {errors.message && (
                  <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#003c3c] to-[#a0f000] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#a0f000] hover:to-[#003c3c] transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  'Envoyer le Message'
                )}
              </button>

              {toast && (
                <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 translate-x-0 opacity-100`}>
                  <div className={`${
                    toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                    toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                    'bg-blue-50 border-blue-200 text-blue-800'
                  } border rounded-lg shadow-lg p-4 flex items-start space-x-3`}>
                    <div className="flex-shrink-0 mt-0.5">
                      {toast.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : toast.type === 'error' ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <MessageCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{toast.message}</p>
                    </div>
                    <button
                      onClick={hideToast}
                      className="flex-shrink-0 ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">💡 Comment recevrez-vous une réponse ?</p>
                  <ul className="space-y-1">
                    <li>• <strong>Si vous êtes connecté :</strong> Vous recevrez une notification dans votre espace personnel</li>
                    <li>• <strong>Par email :</strong> Une copie de la réponse sera envoyée à votre adresse email</li>
                    <li>• <strong>Notifications en temps réel :</strong> Dès qu'un coach ou administrateur répond</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;