import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          // always fetch fresh user data from backend
          const res = await api.get("/user");
          const freshUser = res.data.user;
          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    await api.get("/sanctum/csrf-cookie", { baseURL: "http://localhost:8000" });
    const res = await api.post("/login", { email, password });
    const user = res.data.user;
    const token = res.data.token; // ← get token from response

    // do not save unverified user to context (except admins)
    if (!user.email_verified_at && user.role !== 'admin') {
      return user;
    }

    // ← save token to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}