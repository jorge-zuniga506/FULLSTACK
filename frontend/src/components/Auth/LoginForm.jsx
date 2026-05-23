import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
=======
import { useAuth } from '../../context/AuthContext';
>>>>>>> 74c4e8c15f6a5898e8263e05749b5e53530c002d
import authBg from '../../assets/auth_bg.png';
import LoginNavbar from '../Navbar/LoginNavbar'; 

/**
 * LoginForm — Formulario de inicio de sesión
 */
const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Controla la visibilidad de la contraseña en el campo de texto
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
=======
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate('/verify-role-code');
    } else {
      setFormError(result.error || 'Credenciales incorrectas o problemas al conectar con el servidor.');
    }
  };
>>>>>>> 74c4e8c15f6a5898e8263e05749b5e53530c002d

  return (
    <div className="auth-wrapper">

      {/* ── PANEL IZQUIERDO: Formulario ─────────────────────────────────── */}
      <div className="auth-form-panel">
        <LoginNavbar />
        <div className="auth-content">

          <div className="auth-role-badge">Rol: Emprendedor</div>
          <h1 className="auth-title">Iniciar Sesión</h1>
          <p className="auth-subtitle">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="auth-link">Regístrate ahora</Link>
          </p>

          {/* Banner de error glassmorphic */}
          {formError && (
            <div className="form-error-banner" style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#f87171',
              padding: '12px 16px',
              fontSize: '14px',
              textAlign: 'left',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>⚠️</span>
              <div>{formError}</div>
            </div>
          )}

          {/* Formulario principal — animaciones escalonadas vía CSS --delay */}
<<<<<<< HEAD
          <form className="auth-form" onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            const form = new FormData(e.currentTarget);
            const email = form.get('email');
            const password = form.get('password');
            try {
              // Simulación de fetch al backend. Si hay backend lo intentará,
              // pero para propósitos del frontend navegamos directamente al dashboard.
              try {
                const res = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password })
                });
                if (res.ok) {
                  const data = await res.json();
                  if (data.token) localStorage.setItem('token', data.token);
                }
              } catch (e) {
                // Backend no disponible
              }
              navigate('/dashboard', { replace: true });
            } catch (err) {
              setError('Error de conexión');
            } finally {
              setLoading(false);
            }
          }}>
=======
          <form className="auth-form" onSubmit={handleSubmit}>
>>>>>>> 74c4e8c15f6a5898e8263e05749b5e53530c002d
            {/* Campo oculto para asegurar el rol de emprendedor */}
            <input type="hidden" id="role" name="role" value="emprendedor" />

            {/* Campo Email */}
            <div className="input-group" style={{ '--delay': '0.3s' }}>
              <label htmlFor="email">Email</label>
<<<<<<< HEAD
              <input name="email" type="email" id="email" placeholder="example@gmail.com" required />
=======
              <input
                type="email"
                id="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
>>>>>>> 74c4e8c15f6a5898e8263e05749b5e53530c002d
            </div>

            {/* Campo Contraseña con toggle de visibilidad */}
            <div className="input-group" style={{ '--delay': '0.4s' }}>
              <label htmlFor="password">Password</label>
              <div className="input-icon-wrapper">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="@#*%"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* Botón para mostrar/ocultar contraseña */}
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Botón de submit */}
<<<<<<< HEAD
            <button type="submit" className="auth-btn" style={{ '--delay': '0.5s' }} disabled={loading}>
              {loading ? 'Ingresando...' : 'Sign in'}
=======
            <button
              type="submit"
              className="auth-btn"
              style={{ '--delay': '0.5s' }}
              disabled={submitting}
            >
              {submitting ? 'Iniciando sesión...' : 'Sign in'}
>>>>>>> 74c4e8c15f6a5898e8263e05749b5e53530c002d
            </button>
            {error && <p className="auth-error" style={{ color: '#ff6b6b', marginTop: '0.6rem' }}>{error}</p>}

            {/* Separador visual entre form y social buttons */}
            <div className="auth-divider" style={{ '--delay': '0.6s' }}>
              <span>OR</span>
            </div>

            {/* Botón Social: Google OAuth (pendiente de implementar) */}
            <button type="button" className="social-btn" style={{ '--delay': '0.7s' }}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

          </form>
        </div>
      </div>

      {/* ── PANEL DERECHO: Imagen decorativa ────────────────────────────── */}
      <div className="auth-image-panel">
        <img src={authBg} alt="Cybersecurity" className="auth-bg-image" />
        {/* Overlay oscuro semitransparente sobre la imagen */}
        <div className="auth-image-overlay" />
      </div>

    </div>
  );
};

export default LoginForm;

