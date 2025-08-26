import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "../services/authService";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('Le prénom est requis'),
    lastName: yup.string().required('Le nom est requis'),
    email: yup.string().email('Adresse email invalide').required('L\'email est requis'),
    password: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Le mot de passe est requis'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Les mots de passe ne correspondent pas').required('La confirmation du mot de passe est requise'),
    phone: yup.string().required('Le téléphone est requis'),
    birthDate: yup.string(),
    address: yup.object().shape({
      street: yup.string(),
      city: yup.string(),
      zipCode: yup.string(),
      country: yup.string(),
    }),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    
    try {
      const safeTrim = (value) => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return value.trim();
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'boolean') return value.toString();
        return '';
      };

      const cleanData = {
        firstName: safeTrim(data.firstName),
        lastName: safeTrim(data.lastName),
        email: safeTrim(data.email),
        password: safeTrim(data.password),
        confirmPassword: safeTrim(data.confirmPassword),
        phone: safeTrim(data.phone),
        birthDate: data.birthDate || undefined
      };

      if (data.address && typeof data.address === 'object' && data.address !== null) {
        const addressFields = {};
        if (data.address.street !== undefined) {
          addressFields.street = safeTrim(data.address.street);
        }
        if (data.address.city !== undefined) {
          addressFields.city = safeTrim(data.address.city);
        }
        if (data.address.zipCode !== undefined) {
          addressFields.zipCode = safeTrim(data.address.zipCode);
        }
        if (data.address.country !== undefined) {
          addressFields.country = safeTrim(data.address.country);
        }
        if (Object.keys(addressFields).length > 0) {
          cleanData.address = addressFields;
        }
      }

      console.log('Données envoyées:', cleanData);
      
      await registerUser(cleanData); 
      navigate("/login");
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      setError(err.response?.data?.message || err.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141414] via-[#003c3c] to-[#143c3c] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#003c3c] to-[#143c3c] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#a0f000] to-[#003c3c] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-br from-[#143c3c] to-[#003c3c] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full mb-6 shadow-lg">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-[#a0f000] via-[#ffffff] to-[#003c3c] bg-clip-text text-transparent mb-4">
              Créer un Compte
            </h1>
            <p className="text-[#ffffff] text-lg">
              Rejoignez notre communauté sportive
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-[#a0f000]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#ffffff] mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...register('firstName')}
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
                    {...register('lastName')}
                    className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300"
                    placeholder="Votre nom"
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#ffffff] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300"
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#ffffff] mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300"
                    placeholder="Votre numéro"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-[#ffffff] mb-2">
                  Date de naissance
                </label>
                <input
                  type="date"
                  id="birthDate"
                  {...register('birthDate')}
                  className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-[#ffffff] mb-2">
                    Rue
                  </label>
                  <input
                    type="text"
                    id="street"
                    {...register('address.street')}
                    className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300"
                    placeholder="Votre rue"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-[#ffffff] mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    id="city"
                    {...register('address.city')}
                    className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300"
                    placeholder="Votre ville"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-[#ffffff] mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    {...register('address.zipCode')}
                    className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300"
                    placeholder="Code postal"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-[#ffffff] mb-2">
                    Pays
                  </label>
                  <input
                    type="text"
                    id="country"
                    {...register('address.country')}
                    className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300"
                    placeholder="Votre pays"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#ffffff] mb-2">
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...register('password')}
                    className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#ffffff] mb-2">
                    Confirmer le mot de passe *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...register('confirmPassword')}
                    className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#003c3c] to-[#a0f000] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#a0f000] hover:to-[#003c3c] transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Création du compte...
                  </div>
                ) : (
                  'Créer mon Compte'
                )}
              </button>

              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl text-center">
                  {error}
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#ffffff]/80 mb-4">
                Déjà un compte ?
              </p>
              <button
                onClick={() => navigate('/login')}
                className="text-[#a0f000] hover:text-[#ffffff] font-medium transition-colors duration-200"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;