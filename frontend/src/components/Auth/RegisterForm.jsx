import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import Swal from 'sweetalert2';
import authBg from '../../assets/auth_bg.png'; // Imagen decorativa del panel derecho

/**
 * RegisterForm — Formulario de registro de nuevos usuarios
 */
const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nombreHacienda, setNombreHacienda] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('2'); // Por defecto: Startup / Emprendedor (2)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isValidatingCedula, setIsValidatingCedula] = useState(false);

  // Mapeamos los roles para mostrar el badge dinámicamente en el formulario
  const roleNames = {
    '2': 'Startup / Emprendedor',
    '3': 'Aceleradora',
    '4': 'Inversionista'
  };

  const handleValidarCedula = async () => {
    if (!cedula) {
      setFormError('Por favor ingrese la cédula primero.');
      return;
    }
    // La cédula debe tener entre 9 y 12 dígitos según la validación del backend
    const cleanCedula = cedula.replace(/\D/g, '');
    if (cleanCedula.length < 9 || cleanCedula.length > 12) {
      setFormError('La cédula debe contener entre 9 y 12 dígitos numéricos.');
      return;
    }

    setFormError('');
    setIsValidatingCedula(true);

    try {
      // Usamos el token como null porque es una ruta pública
      const data = await apiService.getOne(`/api/identity/hacienda/${cleanCedula}`);
      if (data && data.nombreCompleto) {
        setNombreHacienda(data.nombreCompleto);
        Swal.fire({
          title: 'Cédula Validada',
          text: `Titular identificado: ${data.nombreCompleto}`,
          icon: 'success',
          confirmButtonColor: '#7900c2',
          background: '#111d2e',
          color: '#fff'
        });
      } else {
        setFormError('No se pudo encontrar información para esa cédula.');
      }
    } catch (err) {
      setFormError('No se pudo autocompletar el nombre. Detalle: ' + err.message + '. Por favor ingréselo manualmente.');
    } finally {
      setIsValidatingCedula(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setFormError('La contraseña debe tener mínimo 6 caracteres.');
      return;
    }

    setSubmitting(true);

    const cleanCedula = cedula.replace(/\D/g, '');
    const result = await register({
      cedula: cleanCedula,
      nombre_hacienda: nombreHacienda,
      email,
      password,
      role_id: roleId
    });

    setSubmitting(false);

    if (result.success) {
      Swal.fire({
        title: '⚠️ ¡AVISO MUY IMPORTANTE! ⚠️',
        html: `
          <div style="text-align: left; font-family: sans-serif; line-height: 1.5;">
            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; color: #f87171; padding: 12px; margin-bottom: 15px; font-weight: bold; font-size: 13px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span>🚨</span> ACCIÓN REQUERIDA OBLIGATORIA <span>🚨</span>
            </div>
            <p style="font-size: 14px; color: #e2e8f0; margin-bottom: 15px;">
              Tu cuenta ha sido creada. Para acceder a la plataforma <strong>debes validar el código de seguridad de doble factor (2FA)</strong> que el sistema te ha asignado a continuación.
            </p>
            
            <div style="margin-top: 15px; margin-bottom: 15px;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #8899aa; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Código de Doble Factor:</p>
              <div style="display: flex; gap: 10px;">
                <div id="swal-2fa-code" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px dashed #7900c2; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 20px; color: #b1f500; text-align: center; font-weight: bold; letter-spacing: 1px;">
                  ${result.verificationCode}
                </div>
                <button type="button" id="swal-copy-btn" style="background: #7900c2; color: white; border: none; border-radius: 8px; padding: 0 16px; font-size: 13px; font-weight: bold; cursor: pointer; transition: all 0.2s ease;">
                  Copiar
                </button>
              </div>
            </div>
            
            <p style="font-size: 12px; color: #f87171; font-weight: 600; margin-top: 10px;">
              ⚠️ ¡Guarda este código ahora mismo! Si lo pierdes, no podrás volver a entrar al sistema y tu acceso quedará revocado permanentemente.
            </p>
          </div>
        `,
        icon: 'warning',
        confirmButtonText: 'Entendido, ir a Verificación',
        confirmButtonColor: '#7900c2',
        background: '#0b1324',
        color: '#fff',
        allowOutsideClick: false,
        didOpen: () => {
          const copyBtn = document.getElementById('swal-copy-btn');
          if (copyBtn) {
            copyBtn.addEventListener('click', () => {
              navigator.clipboard.writeText(result.verificationCode);
              copyBtn.innerText = '¡Copiado!';
              copyBtn.style.background = '#059669';
              setTimeout(() => {
                copyBtn.innerText = 'Copiar';
                copyBtn.style.background = '#7900c2';
              }, 2000);
            });
          }
        }
      }).then(() => {
        navigate('/verify-role-code');
      });
    } else {
      setFormError(result.error || 'Ocurrió un error al registrar el usuario.');
    }
  };

  return (
    <div className="auth-wrapper">

      {/* PANEL IZQUIERDO */}
      <div className="auth-form-panel">
        <div className="auth-content">

          <div className="auth-role-badge">Rol: {roleNames[roleId]}</div>
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="auth-link">
              Inicia sesión
            </Link>
          </p>

          {/* Banner de error */}
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

          {/* Formulario de registro — animaciones escalonadas vía CSS --delay */}
          <form className="auth-form" onSubmit={handleSubmit}>
            
            {/* Campo Cédula de Identificación */}
            <div className="input-group" style={{ '--delay': '0.2s' }}>
              <label htmlFor="cedula">Cédula / Identificación Única</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  id="cedula"
                  placeholder="Ej: 112345678"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleValidarCedula}
                  disabled={isValidatingCedula}
                  style={{
                    padding: '0.65rem 1rem',
                    background: '#7900c2',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease'
                  }}
                  className="cedula-validate-btn"
                >
                  {isValidatingCedula ? 'Validando...' : 'Validar Cédula'}
                </button>
              </div>
            </div>

            {/* Campo Nombre completo */}
            <div className="input-group" style={{ '--delay': '0.3s' }}>
              <label htmlFor="nombre_hacienda">Nombre Completo (Autocompletado)</label>
              <input
                type="text"
                id="nombre_hacienda"
                placeholder="Nombre obtenido al validar cédula"
                value={nombreHacienda}
                onChange={(e) => setNombreHacienda(e.target.value)}
                required
              />
            </div>

            {/* Campo Email */}
            <div className="input-group" style={{ '--delay': '0.4s' }}>
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

            {/* Campo Dropdown para seleccionar el Rol */}
            <div className="input-group" style={{ '--delay': '0.45s' }}>
              <label htmlFor="role_id">Rol en la plataforma</label>
              <select
                id="role_id"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                  padding: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '4px',
                  fontFamily: 'inherit'
                }}
                required
              >
                <option value="2" style={{ background: '#16171d', color: '#f3f4f6' }}>🚀 Startup / Emprendedor</option>
                <option value="3" style={{ background: '#16171d', color: '#f3f4f6' }}>⚡ Aceleradora</option>
                <option value="4" style={{ background: '#16171d', color: '#f3f4f6' }}>💼 Inversionista</option>
              </select>
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                type="email"
                id="email"
                placeholder="example@gmail.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* PASSWORDS */}
            <div className="input-row">
              <div className="input-group" style={{ '--delay': '0.5s' }}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="@#*%"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* Campo de confirmación */}
              <div className="input-group" style={{ '--delay': '0.6s' }}>
                <label htmlFor="confirmPassword">Confirm</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="@#*%"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              className="auth-btn"
              style={{ '--delay': '0.7s' }}
              disabled={submitting}
            >
              {submitting ? 'Creando cuenta...' : 'Create account'}
            </button>

            {/* Separador visual */}
            <div className="auth-divider" style={{ '--delay': '0.8s' }}>
              <span>OR</span>
            </div>

            {/* Registro con Google */}
            <button type="button" className="social-btn" style={{ '--delay': '0.9s' }}>
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

      {/* PANEL DERECHO */}
      <div className="auth-image-panel">
        <img src={authBg} alt="Cybersecurity" className="auth-bg-image" />
        <div className="auth-image-overlay" />

      </div>

    </div>
  );
};

export default RegisterForm;

