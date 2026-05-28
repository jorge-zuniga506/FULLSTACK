import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AuthContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3007';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isRoleVerified, setIsRoleVerified] = useState(() => sessionStorage.getItem('isRoleVerified') === 'true');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearLocalSession = () => {
    setToken(null);
    setUser(null);
    setIsRoleVerified(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isRoleVerified');
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('isRoleVerified');
    }
  }, [token]);

  useEffect(() => {
    const onUnauthorized = () => {
      clearLocalSession();
      if (window.location.pathname !== '/Login') {
        window.location.assign('/Login');
      }
    };

    window.addEventListener(apiService.AUTH_401_EVENT, onUnauthorized);
    return () => window.removeEventListener(apiService.AUTH_401_EVENT, onUnauthorized);
  }, []);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          clearLocalSession();
          return;
        }

        const rawData = await response.json();
        const payload = rawData?.data || rawData;
        const currentUser = payload?.user || payload?.usuario || payload;
        setUser(currentUser);
      } catch (err) {
        console.error('Error al recuperar sesion:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const rawData = await response.json();
      if (!response.ok) {
        throw new Error(rawData.message || 'Error al iniciar sesion');
      }

      const data = rawData?.data || rawData;
      setToken(data.token);
      setUser(data.usuario);
      setIsRoleVerified(false);
      sessionStorage.setItem('isRoleVerified', 'false');
      localStorage.setItem('user', JSON.stringify(data.usuario));

      return {
        success: true,
        redirectPath: data.redirectPath,
        verificationCode: data.verificationCode
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async ({ cedula, nombre_hacienda, email, password, role_id }) => {
    setError(null);
    try {
      const payload = {
        cedula,
        nombre_hacienda,
        email,
        password_hash: password,
        role_id: parseInt(role_id, 10)
      };

      const response = await fetch(`${API_BASE_URL}/api/usuarios/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const rawData = await response.json();
      if (!response.ok) {
        throw new Error(rawData.message || (rawData.errors && rawData.errors[0]?.msg) || 'Error al registrarse');
      }

      const loginResult = await login(email, password);
      return {
        ...loginResult,
        verificationCode: loginResult.verificationCode || rawData?.data?.verificationCode
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const verifyCode = async (code) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-role-code`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al verificar el codigo');
      }

      setIsRoleVerified(true);
      sessionStorage.setItem('isRoleVerified', 'true');
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const resetRoleCode = async (password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-role-code`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const rawData = await response.json();
      if (!response.ok) {
        throw new Error(rawData.message || 'Error al restablecer el codigo');
      }

      const data = rawData?.data || rawData;
      return { success: true, verificationCode: data.verificationCode };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('Error al revocar sesion en backend:', err);
    } finally {
      clearLocalSession();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        isRoleVerified,
        loading,
        error,
        login,
        register,
        verifyCode,
        resetRoleCode,
        logout,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
