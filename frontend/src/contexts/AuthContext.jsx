import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRole(parsed.role);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    await api.get("/sanctum/csrf-cookie", { baseURL: "http://localhost:8000" });
    const res  = await api.post("/login", { email, password });
    const user = res.data.user;

    // do not save unverified user to context
    if (!user.email_verified_at) {
      return user;
    }

    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // ignore server errors
    } finally {
      // ✅ Always clear everything regardless of server response
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}