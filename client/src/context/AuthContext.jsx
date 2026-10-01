import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) { setLoading(false); return; }
    api.get('/auth/me')
      .then(({ data }) => { setUser(data.data.user); setCompany(data.data.company); })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const persist = ({ token, user, company }) => {
    localStorage.setItem('token', token);
    setUser(user);
    setCompany(company);
  };
  const login = async (body) => persist((await api.post('/auth/login', body)).data.data);
  const registerCompany = async (body) => persist((await api.post('/auth/register-company', body)).data.data);
  const logout = () => { localStorage.removeItem('token'); setUser(null); setCompany(null); };

  return (
    <AuthContext.Provider value={{ user, company, loading, login, registerCompany, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}