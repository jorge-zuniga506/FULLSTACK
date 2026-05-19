import React from 'react';
import { Link } from 'react-router-dom';
import authBg from '../../assets/auth_bg.png'; // Imagen decorativa del panel derecho

/**
 * RegisterForm — Formulario de registro de nuevos usuarios
 *
 * Estructura de dos paneles (split-screen, misma estética que LoginForm):
 * - Panel izquierdo: campos de registro (nombre, email, contraseña, confirmar)
 * - Panel derecho:   imagen decorativa con overlay
 *
 * Los campos de contraseña están en fila (input-row) para aprovechar el espacio.
 *
 * TODO: conectar onSubmit al endpoint POST /api/auth/register del backend
 * TODO: agregar validación de que ambas contraseñas coincidan antes de enviar
 */
const RegisterForm = () => {
  return (
    <div className="auth-wrapper">

      {/* ── PANEL IZQUIERDO: Formulario de registro ──────────────────────── */}
      <div className="auth-form-panel">
        <div className="auth-content">

          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>

          {/* Formulario de registro — animaciones escalonadas vía CSS --delay */}
          <form className="auth-form">

            {/* Campo Nombre completo */}
            <div className="input-group" style={{ '--delay': '0.3s' }}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="Your full name" required />
            </div>

            {/* Campo Email */}
            <div className="input-group" style={{ '--delay': '0.4s' }}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="example@gmail.com" required />
            </div>

            {/* Fila de contraseñas: dos campos lado a lado */}
            <div className="input-row">
              <div className="input-group" style={{ '--delay': '0.5s' }}>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="@#*%" required />
              </div>
              {/* Campo de confirmación — debe coincidir con password (validar en submit) */}
              <div className="input-group" style={{ '--delay': '0.6s' }}>
                <label htmlFor="confirmPassword">Confirm</label>
                <input type="password" id="confirmPassword" placeholder="@#*%" required />
              </div>
            </div>

            {/* Botón de submit */}
            <button type="submit" className="auth-btn" style={{ '--delay': '0.7s' }}>
              Create account
            </button>

            {/* Separador visual entre form y opciones sociales */}
            <div className="auth-divider" style={{ '--delay': '0.8s' }}>
              <span>OR</span>
            </div>

            {/* Registro con Google (OAuth — pendiente de implementar) */}
            <button type="button" className="social-btn" style={{ '--delay': '0.9s' }}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Registro con Facebook (OAuth — pendiente de implementar) */}
            <button type="button" className="social-btn facebook-btn" style={{ '--delay': '1.0s' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>

          </form>
        </div>
      </div>

      {/* ── PANEL DERECHO: Imagen decorativa ────────────────────────────── */}
      <div className="auth-image-panel">
        <img src={authBg} alt="Cybersecurity" className="auth-bg-image" />
        {/* Overlay para suavizar la imagen y dar contraste al texto */}
        <div className="auth-image-overlay" />
      </div>

    </div>
  );
};

export default RegisterForm;
