import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getRole, setToken, setRole, removeToken, removeRole } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [role, setRoleState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      const r = await getRole();
      setTokenState(t);
      setRoleState(r);
      setLoading(false);
    })();
  }, []);

  const login = async (t, r) => {
    await setToken(t);
    await setRole(r);
    setTokenState(t);
    setRoleState(r);
  };

  const logout = async () => {
    await removeToken();
    await removeRole();
    setTokenState(null);
    setRoleState(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, loading, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
