import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3007';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isRoleVerified, setIsRoleVerified] = useState(() => sessionStorage.getItem('isRoleVerified') === 'true');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cada vez que cambia el token, actualizamos localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('isRoleVerified');
    }
  }, [token]);

  // Recupera la sesión activa cuando el componente se monta
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const rawData = await response.json();
          const user = (rawData && rawData.status && rawData.data) ? rawData.data.user : rawData.user;
          setUser(user);
        } else {
          // Si el token es inválido o expiró, lo limpiamos
          setToken(null);
          setUser(null);
          setIsRoleVerified(false);
        }
      } catch (err) {
        console.error('Error al recuperar sesión:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  // Acción de Login
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const rawData = await response.json();

      if (!response.ok) {
        throw new Error(rawData.message || 'Error al iniciar sesión');
      }

      const data = (rawData && rawData.status && rawData.data) ? rawData.data : rawData;

      setToken(data.token);
      setUser(data.usuario);
      setIsRoleVerified(false); // Requiere verificación por código siempre tras login
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

  // Acción de Registro (con Autologin posterior)
  const register = async ({ cedula, nombre_hacienda, email, password, role_id }) => {
    setError(null);
    try {
      const payload = {
        cedula,
        nombre_hacienda,
        email,
        password_hash: password,
        role_id: parseInt(role_id, 10),
      };

      const response = await fetch(`${API_BASE_URL}/api/usuarios/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const rawData = await response.json();

      if (!response.ok) {
        throw new Error(rawData.message || (rawData.errors && rawData.errors[0]?.msg) || 'Error al registrarse');
      }

      const data = (rawData && rawData.status && rawData.data) ? rawData.data : rawData;

      // Autologin exitoso tras el registro
      const loginResult = await login(email, password);
      // Retornar también el verificationCode generado durante el login (el cual es el activo en BD)
      return {
        ...loginResult,
        verificationCode: loginResult.verificationCode || data.verificationCode
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Acción de Verificación de Código 2FA
  const verifyCode = async (code) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-role-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al verificar el código');
      }

      setIsRoleVerified(true);
      sessionStorage.setItem('isRoleVerified', 'true');
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Acción de Restablecer Código 2FA con la Contraseña
  const resetRoleCode = async (password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-role-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const rawData = await response.json();

      if (!response.ok) {
        throw new Error(rawData.message || 'Error al restablecer el código');
      }

      const data = (rawData && rawData.status && rawData.data) ? rawData.data : rawData;

      return { success: true, verificationCode: data.verificationCode };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Acción de Logout
  const logout = async () => {
    setError(null);
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (err) {
      console.error('Error al revocar sesión en backend:', err);
    } finally {
      // Siempre borramos localmente pase lo que pase en el backend
      setToken(null);
      setUser(null);
      setIsRoleVerified(false);
      sessionStorage.removeItem('isRoleVerified');
    }
  };

  return (
    <AuthContext.Provider value={{
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
    }}>
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
