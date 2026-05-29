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
    sessionStorage.removeItem('twoFactorDelivery');
    sessionStorage.removeItem('twoFactorDestination');
    sessionStorage.removeItem('twoFactorWhatsappPhone');
    sessionStorage.removeItem('twoFactorWhatsappApiKey');
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('isRoleVerified');
      sessionStorage.removeItem('twoFactorDelivery');
      sessionStorage.removeItem('twoFactorDestination');
      sessionStorage.removeItem('twoFactorWhatsappPhone');
      sessionStorage.removeItem('twoFactorWhatsappApiKey');
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

  const login = async (email, password, otpOptions = {}) => {
    setError(null);
    try {
      const {
        otpChannel = 'email',
        whatsappPhone = '',
        whatsappApiKey = ''
      } = otpOptions;

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          otp_channel: otpChannel,
          whatsapp_phone: whatsappPhone,
          whatsapp_api_key: whatsappApiKey
        })
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
      sessionStorage.setItem('twoFactorDelivery', data.twoFactorDelivery || otpChannel || 'email');
      sessionStorage.setItem('twoFactorDestination', data.twoFactorDestination || '');
      sessionStorage.setItem('twoFactorWhatsappPhone', whatsappPhone || '');
      sessionStorage.setItem('twoFactorWhatsappApiKey', whatsappApiKey || '');

      return {
        success: true,
        redirectPath: data.redirectPath,
        twoFactorDelivery: data.twoFactorDelivery || otpChannel || 'email',
        twoFactorDestination: data.twoFactorDestination || ''
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const loginWithGoogle = async (googleToken, roleId) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: googleToken, role_id: roleId })
      });

      const rawData = await response.json();
      if (!response.ok) {
        throw new Error(rawData.message || 'Error al iniciar sesión con Google');
      }

      const data = rawData?.data || rawData;
      
      if (data.requiresRoleSelection) {
        return {
          success: true,
          requiresRoleSelection: true,
          googleToken: data.googleToken,
          email: data.email,
          name: data.name,
          picture: data.picture
        };
      }

      setToken(data.token);
      setUser(data.usuario);
      setIsRoleVerified(true);
      sessionStorage.setItem('isRoleVerified', 'true');
      sessionStorage.removeItem('twoFactorDelivery');
      sessionStorage.removeItem('twoFactorDestination');
      sessionStorage.removeItem('twoFactorWhatsappPhone');
      sessionStorage.removeItem('twoFactorWhatsappApiKey');
      localStorage.setItem('user', JSON.stringify(data.usuario));

      return {
        success: true,
        requiresRoleSelection: false,
        redirectPath: data.redirectPath
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
      return loginResult;
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

  const resendRoleCode = async () => {
    setError(null);
    try {
      const twoFactorDelivery = sessionStorage.getItem('twoFactorDelivery') || 'email';
      const whatsappPhone = sessionStorage.getItem('twoFactorWhatsappPhone') || '';
      const whatsappApiKey = sessionStorage.getItem('twoFactorWhatsappApiKey') || '';

      const response = await fetch(`${API_BASE_URL}/api/auth/resend-role-code`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          otp_channel: twoFactorDelivery,
          whatsapp_phone: whatsappPhone,
          whatsapp_api_key: whatsappApiKey
        })
      });

      const rawData = await response.json();
      if (!response.ok) {
        throw new Error(rawData.message || 'Error al reenviar el codigo');
      }

      const data = rawData?.data || rawData;
      if (data.twoFactorDelivery) {
        sessionStorage.setItem('twoFactorDelivery', data.twoFactorDelivery);
      }
      if (data.twoFactorDestination) {
        sessionStorage.setItem('twoFactorDestination', data.twoFactorDestination);
      }

      return {
        success: true,
        twoFactorDelivery: data.twoFactorDelivery || twoFactorDelivery,
        twoFactorDestination: data.twoFactorDestination || sessionStorage.getItem('twoFactorDestination') || '',
        twoFactorExpiresAt: data.twoFactorExpiresAt
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Alias para no romper componentes antiguos
  const resetRoleCode = resendRoleCode;

  const changeUserRole = async (newRoleId) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/change-role`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role_id: parseInt(newRoleId, 10) })
      });

      const rawData = await response.json();
      if (!response.ok) {
        throw new Error(rawData.message || 'Error al cambiar de rol');
      }

      const data = rawData?.data || rawData;
      setToken(data.token);
      setUser(data.usuario);
      localStorage.setItem('user', JSON.stringify(data.usuario));

      return {
        success: true,
        redirectPath: data.redirectPath
      };
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
        loginWithGoogle,
        register,
        verifyCode,
        resendRoleCode,
        resetRoleCode,
        changeUserRole,
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
