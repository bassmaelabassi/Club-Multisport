import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { useForm } from 'react-hook-form';
import { User, LogOut, Edit3, Save, X, Mail, Phone, Calendar, MapPin, Lock, Shield, MessageSquare, Bell } from 'lucide-react';

const Profile = () => {
  const { user, loading, login, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState('profile');
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
      setValue('email', user.email);
      setValue('phone', user.phone);
      setValue('birthDate', user.birthDate ? user.birthDate.substring(0, 10) : '');
      setValue('address.street', user.address?.street || '');
      setValue('address.city', user.address?.city || '');
      setValue('address.zipCode', user.address?.zipCode || '');
      setValue('address.country', user.address?.country || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setErrorMsg("");
    const address = {
      street: data['address.street'],
      city: data['address.city'],
      zipCode: data['address.zipCode'],
      country: data['address.country'],
    };
    const payload = {
      ...data,
      address,
    };
    delete payload['address.street'];
    delete payload['address.city'];
    delete payload['address.zipCode'];
    delete payload['address.country'];
    if (!payload.password) {
      delete payload.password;
      delete payload.confirmPassword;
    } else {
      if (payload.password !== payload.confirmPassword) {
        setErrorMsg('Les mots de passe ne correspondent pas');
        return;
      }
    }
    try {
      await userService.updateProfile(user._id, payload);
      if (typeof window !== 'undefined' && window.location) {
        window.location.reload();
      }
      setEditMode(false);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#003c3c] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-[#22b455] mx-auto mb-4"></div>
          <p className="text-lg text-white font-medium">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003c3c] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#22b455] to-[#92e5a1] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#92e5a1] to-[#22b455] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-br from-[#22b455] to-[#020204] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block p-8 rounded-3xl bg-[#92e5a1] border border-[#22b455] shadow-2xl mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#22b455] to-[#92e5a1] rounded-full mb-6 shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-[#22b455] via-[#92e5a1] to-[#020204] bg-clip-text text-transparent mb-4">
              Mon Profil
            </h1>
            <p className="text-black text-lg max-w-2xl mx-auto leading-relaxed">
              Gérez vos informations personnelles et vos préférences
            </p>
          </div>
        </div>

        <div className="bg-[#92e5a1] rounded-2xl shadow-2xl p-8 border border-[#22b455] relative">
          <button
            className="absolute top-6 right-6 bg-black text-white px-4 py-2 rounded-xl shadow-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 group hover:scale-105"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Déconnexion
          </button>

          <div className="flex space-x-2 mb-8 border-b border-[#22b455]">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-t-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-[#22b455] text-white shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <User className="w-4 h-4" />
              Profil
            </button>
            {/* Onglet SMS supprimé */}
          </div>

          {activeTab === 'profile' && (
            <>
              {editMode ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {errorMsg && (
                    <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl">
                      {errorMsg}
                    </div>
                  )}
                  
                  <div className="bg-[#92e5a1] rounded-xl p-6 border border-[#22b455]">
                    <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informations personnelles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input 
                          {...register('firstName', { required: 'Le prénom est requis' })} 
                          className="w-full px-4 py-3 bg-white border border-[#22b455] rounded-xl focus:ring-2 focus:ring-[#22b455] focus:border-[#22b455] text-gray-800 placeholder:text-gray-500 transition-all duration-300" 
                          placeholder="Prénom" 
                        />
                        {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <input 
                          {...register('lastName', { required: 'Le nom est requis' })} 
                          className="w-full px-4 py-3 bg-white border border-[#22b455] rounded-xl focus:ring-2 focus:ring-[#22b455] focus:border-[#22b455] text-gray-800 placeholder:text-gray-500 transition-all duration-300" 
                          placeholder="Nom" 
                        />
                        {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>}
                      </div>
                    </div>
                    <div className="mt-4">
                      <input 
                        {...register('email', { required: 'L\'email est requis' })} 
                        className="w-full px-4 py-3 bg-white border border-[#22b455] rounded-xl focus:ring-2 focus:ring-[#22b455] focus:border-[#22b455] text-gray-800 placeholder:text-gray-500 transition-all duration-300" 
                        placeholder="Email" 
                      />
                      {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="mt-4">
                      <input 
                        {...register('phone', { required: 'Le téléphone est requis' })} 
                        className="w-full px-4 py-3 bg-white border border-[#22b455] rounded-xl focus:ring-2 focus:ring-[#22b455] focus:border-[#22b455] text-gray-800 placeholder:text-gray-500 transition-all duration-300" 
                        placeholder="Téléphone" 
                      />
                      {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                    <div className="mt-4">
                      <input 
                        {...register('birthDate')} 
                        type="date" 
                        className="w-full px-4 py-3 bg-white border border-[#22b455] rounded-xl focus:ring-2 focus:ring-[#22b455] focus:border-[#22b455] text-gray-800 transition-all duration-300" 
                      />
                    </div>
                  </div>

                  <div className="bg-[#92e5a1] rounded-xl p-6 border border-[#22b455]">
                    <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Adresse
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input 
                          {...register('address.street')} 
                          className="w-full px-4 py-3 bg-white border border-[#22b455] rounded-xl focus:ring-2 focus:ring-[#22b455] focus:border-[#22b455] text-gray-800 placeholder:text-gray-500 transition-all duration-300" 
                          placeholder="Rue" 
                        />
                      </div>
                      <div>
                        <input 
                          {...register('address.city')} 
                          className="w-full px-4 py-3 bg-white border border-[#22b455] rounded-xl focus:ring-2 focus:ring-[#22b455] focus:border-[#22b455] text-gray-800 placeholder:text-gray-500 transition-all duration-300" 
                          placeholder="Ville" 
                        />
                      </div>
                      <div>
                        <input 
                          {...register('address.zipCode')} 
                          className="w-full px-4 py-3 bg-white border border-[#22b455] rounded-xl focus:ring-2 focus:ring-[#22b455] focus:border-[#22b455] text-gray-800 placeholder:text-gray-500 transition-all duration-300" 
                          placeholder="Code postal" 
                        />
                      </div>
                      <div>
                        <input 
                          {...register('address.country')} 
                          className="w-full px-4 py-3 bg-white border border-[#22b455] rounded-xl focus:ring-2 focus:ring-[#22b455] focus:border-[#22b455] text-gray-800 placeholder:text-gray-500 transition-all duration-300" 
                          placeholder="Pays" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#92e5a1] rounded-xl p-6 border border-[#22b455]">
                    <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Modifier le mot de passe
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input 
                          {...register('password')} 
                          type="password" 
                          className="w-full px-4 py-3 bg-white border border-[#22b455] rounded-xl focus:ring-2 focus:ring-[#22b455] focus:border-[#22b455] text-gray-800 placeholder:text-gray-500 transition-all duration-300" 
                          placeholder="Nouveau mot de passe" 
                        />
                      </div>
                      <div>
                        <input 
                          {...register('confirmPassword')} 
                          type="password" 
                          className="w-full px-4 py-3 bg-white border border-[#22b455] rounded-xl focus:ring-2 focus:ring-[#22b455] focus:border-[#22b455] text-gray-800 placeholder:text-gray-500 transition-all duration-300" 
                          placeholder="Confirmer le mot de passe" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button 
                      type="submit" 
                      className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2" 
                    >
                      <Save className="w-5 h-5" />
                      Sauvegarder
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditMode(false)} 
                      className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2" 
                    >
                      <X className="w-5 h-5" />
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-[#92e5a1] rounded-xl p-6 border border-[#22b455]">
                    <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informations personnelles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-[#22b455]" />
                        <div>
                          <p className="text-gray-600 text-sm">Prénom</p>
                          <p className="text-gray-800 font-medium">{user.firstName || <span className="text-gray-400">Non renseigné</span>}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-[#22b455]" />
                        <div>
                          <p className="text-gray-600 text-sm">Nom</p>
                          <p className="text-gray-800 font-medium">{user.lastName || <span className="text-gray-400">Non renseigné</span>}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-[#22b455]" />
                        <div>
                          <p className="text-gray-600 text-sm">Email</p>
                          <p className="text-gray-800 font-medium">{user.email || <span className="text-gray-400">Non renseigné</span>}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-[#22b455]" />
                        <div>
                          <p className="text-gray-600 text-sm">Téléphone</p>
                          <p className="text-gray-800 font-medium">{user.phone || <span className="text-gray-400">Non renseigné</span>}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-[#22b455]" />
                        <div>
                          <p className="text-gray-600 text-sm">Date de naissance</p>
                          <p className="text-gray-800 font-medium">{user.birthDate ? user.birthDate.substring(0, 10) : <span className="text-gray-400">Non renseigné</span>}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Shield className="w-5 h-5 text-[#22b455]" />
                        <div>
                          <p className="text-gray-600 text-sm">Rôle</p>
                          <p className="text-gray-800 font-medium">{user.role || <span className="text-gray-400">Non renseigné</span>}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#92e5a1] rounded-xl p-6 border border-[#22b455]">
                    <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Adresse
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-[#22b455]" />
                        <div>
                          <p className="text-gray-600 text-sm">Rue</p>
                          <p className="text-gray-800 font-medium">{user.address?.street || <span className="text-gray-400">Non renseigné</span>}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-[#22b455]" />
                        <div>
                          <p className="text-gray-600 text-sm">Ville</p>
                          <p className="text-gray-800 font-medium">{user.address?.city || <span className="text-gray-400">Non renseigné</span>}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-[#22b455]" />
                        <div>
                          <p className="text-gray-600 text-sm">Code postal</p>
                          <p className="text-gray-800 font-medium">{user.address?.zipCode || <span className="text-gray-400">Non renseigné</span>}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-[#22b455]" />
                        <div>
                          <p className="text-gray-600 text-sm">Pays</p>
                          <p className="text-gray-800 font-medium">{user.address?.country || <span className="text-gray-400">Non renseigné</span>}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button 
                      className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto" 
                      onClick={() => setEditMode(true)}
                    >
                      <Edit3 className="w-5 h-5" />
                      Modifier mon profil
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Section SMS supprimée */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
