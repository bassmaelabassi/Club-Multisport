import { createContext, useState, useEffect, useCallback, useContext } from "react";
import {
  login as loginService,
  register as registerService,
  getMe,
  logout as logoutService
} from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    console.log('Appel login avec :', credentials);
    const data = await loginService(credentials);
    console.log('Réponse backend login :', data);
    localStorage.setItem("token", data.token);
    await loadUser();
    console.log('Utilisateur après login :', user);
    return data;
  };

  const register = async (userData) => {
    const data = await registerService(userData);
    localStorage.setItem("token", data.token);
    await loadUser();
    return data;
  };

  const logout = () => {
    logoutService();
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isCoach: user?.role === "coach",
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
