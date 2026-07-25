import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, if we have a stored token, verify it and restore the session.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((profile) => setUser(profile))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authApi.login({ email, password });
    localStorage.setItem("token", result.accessToken);
    localStorage.setItem("refreshToken", result.refreshToken);
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(async (payload) => {
    return authApi.register(payload);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // best-effort - clear local session regardless of API result
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const profile = await authApi.me();
    setUser(profile);
    return profile;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
