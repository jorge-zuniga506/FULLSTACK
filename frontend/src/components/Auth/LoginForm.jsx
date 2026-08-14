import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authBg from '../../assets/auth_bg.png';
import LoginNavbar from '../Navbar/LoginNavbar';
import { useGoogleLogin } from '@react-oauth/google';

/**
 * LoginForm - Formulario de inicio de sesion
 */
const LoginForm = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [otpChannel, setOtpChannel] = useState('email');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappApiKey, setWhatsappApiKey] = useState('');

  const googleLoginTrigger = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setFormError('');
      setSubmitting(true);

      const result = await loginWithGoogle(tokenResponse.access_token, '2');
      setSubmitting(false);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setFormError(result.error || 'Error al iniciar sesion con Google.');
      }
    },
    onError: () => {
      setFormError('El inicio de sesion con Google fallo.');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (otpChannel === 'whatsapp') {
      if (!whatsappPhone.trim()) {
        setFormError('Ingresa tu numero de WhatsApp para recibir el codigo OTP.');
        return;
      }
      if (!whatsappApiKey.trim()) {
        setFormError('Ingresa tu API Key gratis de CallMeBot para usar OTP por WhatsApp.');
        return;
      }
    }

    setSubmitting(true);

    const result = await login(email, password, {
      otpChannel,
      whatsappPhone,
      whatsappApiKey
    });

    setSubmitting(false);

    if (result.success) {
      navigate('/verify-role-code');
    } else {
      setFormError(result.error || 'Credenciales incorrectas o problemas al conectar con el servidor.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-form-panel">
        <LoginNavbar />

        <div className="auth-content">
          <div className="auth-role-badge">Rol: Emprendedor</div>
          <h1 className="auth-title">Iniciar Sesion</h1>
          <p className="auth-subtitle">
            No tienes una cuenta?{' '}
            <Link to="/register" className="auth-link">Registrate ahora</Link>
          </p>

          {formError && (
            <div
              className="form-error-banner"
              style={{
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
              }}
            >
              <span>[!]</span>
              <div>{formError}</div>
            </div>
          )}

          {/* ── PANEL INTERACTIVO DE CREDENCIALES DE PRUEBA ─────────────────── */}
          <div style={{
            background: 'rgba(11, 19, 36, 0.85)',
            border: '1px solid rgba(139, 0, 221, 0.35)',
            borderRadius: '16px',
            padding: '14px 16px',
            marginBottom: '22px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 20px rgba(139, 0, 221, 0.12)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⚡ Credenciales de Prueba (Clic para rellenar)
              </span>
              <span style={{ fontSize: '10px', background: 'rgba(177,245,0,0.15)', color: '#b1f500', padding: '2px 8px', borderRadius: '50px', fontWeight: '700' }}>
                100% LocalStorage
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[
                { role: 'Admin', email: 'admin@nexuscobalt.com', pass: 'admin123', icon: '👑', color: '#c084fc' },
                { role: 'Startup', email: 'startup@nexuscobalt.com', pass: 'startup123', icon: '🚀', color: '#00aaff' },
                { role: 'Aceleradora', email: 'aceleradora@nexuscobalt.com', pass: 'aceleradora123', icon: '⚡', color: '#b1f500' },
                { role: 'Inversor', email: 'inversor@nexuscobalt.com', pass: 'inversor123', icon: '💼', color: '#eab308' }
              ].map(acc => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword(acc.pass);
                  }}
                  style={{
                    padding: '8px 10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${acc.color}40`,
                    borderRadius: '10px',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = `${acc.color}15`}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                >
                  <span style={{ fontSize: '11px', fontWeight: '700', color: acc.color }}>
                    {acc.icon} {acc.role}
                  </span>
                  <span style={{ fontSize: '10px', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {acc.email}
                  </span>
                  <span style={{ fontSize: '9px', color: '#8899aa', fontFamily: 'monospace' }}>
                    Clave: {acc.pass}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input type="hidden" id="role" name="role" value="emprendedor" />

            <div className="input-group" style={{ '--delay': '0.3s' }}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group" style={{ '--delay': '0.4s' }}>
              <label htmlFor="password">Password</label>
              <div className="input-icon-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="@#*%"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>

            <div className="input-group" style={{ '--delay': '0.45s' }}>
              <label>Canal OTP</label>
              <div className="otp-channel-row">
                <button
                  type="button"
                  className={`otp-channel-option ${otpChannel === 'email' ? 'active' : ''}`}
                  onClick={() => setOtpChannel('email')}
                >
                  Correo (Gmail)
                </button>
                <button
                  type="button"
                  className={`otp-channel-option ${otpChannel === 'whatsapp' ? 'active' : ''}`}
                  onClick={() => setOtpChannel('whatsapp')}
                >
                  WhatsApp (Gratis)
                </button>
              </div>
            </div>

            {otpChannel === 'whatsapp' && (
              <>
                <div className="input-group" style={{ '--delay': '0.48s' }}>
                  <label htmlFor="whatsappPhone">Numero de WhatsApp</label>
                  <input
                    id="whatsappPhone"
                    type="tel"
                    placeholder="+50688887777"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group" style={{ '--delay': '0.49s' }}>
                  <label htmlFor="whatsappApiKey">API Key de WhatsApp (CallMeBot o TextMeBot)</label>
                  <input
                    id="whatsappApiKey"
                    type="text"
                    placeholder="Ej: 1234567 o 5DqBxMesLcfu"
                    value={whatsappApiKey}
                    onChange={(e) => setWhatsappApiKey(e.target.value)}
                    required
                  />
                  <span className="otp-help-text">
                    Si tu key es numerica usa CallMeBot. Si es alfanumerica (como 5DqBxMesLcfu), el sistema usara TextMeBot automaticamente.
                  </span>
                </div>
              </>
            )}

            <button
              type="submit"
              className="auth-btn"
              style={{ '--delay': '0.5s' }}
              disabled={submitting}
            >
              {submitting ? 'Iniciando sesion...' : 'Sign in'}
            </button>

            <div className="auth-divider" style={{ '--delay': '0.6s' }}>
              <span>OR</span>
            </div>

            <button
              type="button"
              className="social-btn"
              style={{ '--delay': '0.7s', marginTop: '15px' }}
              onClick={() => googleLoginTrigger()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar con Google
            </button>
          </form>
        </div>
      </div>

      <div className="auth-image-panel">
        <img src={authBg} alt="Cybersecurity" className="auth-bg-image" />
        <div className="auth-image-overlay" />
      </div>
    </div>
  );
};

export default LoginForm;
