import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { LogIn, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
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
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full mb-6 shadow-lg">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-[#a0f000] via-[#ffffff] to-[#003c3c] bg-clip-text text-transparent mb-4">
              Connexion
            </h1>
            <p className="text-[#ffffff] text-lg">
              Accédez à votre espace membre
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-[#a0f000]">
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl text-center">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#ffffff] mb-2">
                  Adresse email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-[#ffffff]">
                    Mot de passe *
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#a0f000] hover:text-[#ffffff] hover:underline transition-colors duration-200"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 pr-12 bg-white/20 border border-[#a0f000] rounded-xl focus:ring-2 focus:ring-[#a0f000] focus:border-[#a0f000] text-[#ffffff] placeholder:text-[#ffffff]/50 transition-all duration-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-[#a0f000] hover:text-[#ffffff] transition-colors duration-200" />
                    ) : (
                      <Eye className="h-5 w-5 text-[#a0f000] hover:text-[#ffffff] transition-colors duration-200" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    loading 
                      ? 'bg-gradient-to-r from-[#003c3c] to-[#a0f000]' 
                      : 'bg-gradient-to-r from-[#003c3c] to-[#a0f000] hover:from-[#a0f000] hover:to-[#003c3c]'
                  }`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Connexion en cours...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Se connecter
                    </div>
                  )}
                </button>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-[#ffffff]/80">
                  Pas encore de compte ?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-[#a0f000] hover:text-[#ffffff] hover:underline transition-colors duration-200"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
