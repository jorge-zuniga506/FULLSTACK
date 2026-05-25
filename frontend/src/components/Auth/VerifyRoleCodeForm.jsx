import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

/**
 * VerifyRoleCodeForm — Formulario premium de verificación de doble factor (2FA)
 * Estilo dark sci-fi con efectos de resplandor de neón, tipografía espaciada y micro-animaciones.
 * Ahora incluye una opción para restablecer el código 2FA usando la contraseña actual de la cuenta.
 */
const VerifyRoleCodeForm = () => {
  const { verifyCode, resetRoleCode, logout, user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!code.trim()) {
      setErrorMsg('Por favor, ingrese el código de verificación.');
      return;
    }

    setSubmitting(true);
    const result = await verifyCode(code.trim().toUpperCase());
    setSubmitting(false);

    if (result.success) {
      // Éxito: redirección según el rol del usuario
      let redirectPath = '/dashboard';
      if (user) {
        if (user.role_id === 1) redirectPath = '/dashboard/admin';
        else if (user.role_id === 2) redirectPath = '/dashboard/startup';
        else if (user.role_id === 3) redirectPath = '/dashboard/aceleradora';
        else if (user.role_id === 4) redirectPath = '/dashboard/inversor';
      }

      Swal.fire({
        title: 'Acceso Autorizado',
        text: 'Identidad doble factor validada correctamente.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#111d2e',
        color: '#fff'
      }).then(() => {
        navigate(redirectPath);
      });
    } else {
      setErrorMsg(result.error || 'Código inválido o expirado. Verifique e intente nuevamente.');
      Swal.fire({
        title: 'Error de Validación',
        text: result.error || 'El código no es correcto o ya expiró.',
        icon: 'error',
        confirmButtonColor: '#7900c2',
        background: '#111d2e',
        color: '#fff'
      });
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!password) {
      setErrorMsg('Por favor, ingrese su contraseña actual.');
      return;
    }

    setSubmitting(true);
    const result = await resetRoleCode(password);
    setSubmitting(false);

    if (result.success) {
      setPassword('');
      setIsResetting(false);
      setCode(result.verificationCode); // Autocompletar el código en el input

      Swal.fire({
        title: '¡Código Restablecido!',
        html: `Se ha generado un nuevo código de seguridad para tu rol:<br/><br/>
               <strong style="font-size: 24px; color: #b1f500; font-family: monospace; letter-spacing: 2px; text-shadow: 0 0 10px rgba(177,245,0,0.4);">${result.verificationCode}</strong><br/><br/>
               El campo de entrada ha sido autocompletado con este nuevo código.`,
        icon: 'success',
        confirmButtonText: 'Copiar y Continuar',
        confirmButtonColor: '#7900c2',
        background: '#111d2e',
        color: '#fff'
      });
    } else {
      setErrorMsg(result.error || 'Contraseña incorrecta. Inténtelo nuevamente.');
      Swal.fire({
        title: 'Error de Verificación',
        text: result.error || 'La contraseña no coincide con nuestros registros.',
        icon: 'error',
        confirmButtonColor: '#7900c2',
        background: '#111d2e',
        color: '#fff'
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        {/* Decorativo circular de neón */}
        <div style={styles.neonOrbit}></div>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.shieldIcon}>🛡️</div>
          <h2 style={styles.title}>Verificación Obligatoria</h2>
          {isResetting ? (
            <p style={styles.subtitle}>
              Ingresa la contraseña actual de tu cuenta para verificar tu identidad y generar un nuevo código 2FA de seguridad.
            </p>
          ) : (
            <p style={styles.subtitle}>
              Se ha activado la verificación de doble factor para proteger tu rol. Ingresa el código asignado a tu cuenta.
            </p>
          )}
        </div>

        {/* Formularios Condicionales */}
        {!isResetting ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Código de Seguridad (2FA)</label>
              <input
                type="text"
                maxLength={20}
                placeholder="STARTUPSAA99"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={styles.input}
                disabled={submitting}
                autoFocus
              />
              <span style={styles.hint}>Ejemplo: STARTUPXXXX, ADMINXXXX, etc.</span>
              
              <button 
                type="button" 
                onClick={() => { setIsResetting(true); setErrorMsg(''); setPassword(''); }} 
                style={styles.forgotBtn}
              >
                🔑 ¿Olvidaste tu código? Restablécelo con contraseña
              </button>
            </div>

            {errorMsg && (
              <div style={styles.errorBanner}>
                <span>⚠️</span>
                <div style={{ marginLeft: '8px' }}>{errorMsg}</div>
              </div>
            )}

            <button
              type="submit"
              style={submitting ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
              disabled={submitting}
            >
              {submitting ? 'Verificando firma...' : 'Validar Identidad'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} style={styles.form}>
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Confirmar Contraseña Actual</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputPassword}
                disabled={submitting}
                autoFocus
              />
              <span style={styles.hint}>Por motivos de seguridad, confirma tu clave.</span>
            </div>

            {errorMsg && (
              <div style={styles.errorBanner}>
                <span>⚠️</span>
                <div style={{ marginLeft: '8px' }}>{errorMsg}</div>
              </div>
            )}

            <button
              type="submit"
              style={submitting ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
              disabled={submitting}
            >
              {submitting ? 'Verificando clave...' : 'Generar Nuevo Código'}
            </button>

            <button 
              type="button" 
              onClick={() => { setIsResetting(false); setErrorMsg(''); setPassword(''); }} 
              style={styles.backBtn}
            >
              ⬅️ Volver a ingresar código
            </button>
          </form>
        )}

        {/* Acciones del pie */}
        <div style={styles.footer}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Cancelar y Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '100vh',
    background: 'radial-gradient(circle at center, #0b1324 0%, #060d1a 100%)',
    fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
  },
  glassCard: {
    position: 'relative',
    width: '100%',
    maxWidth: '460px',
    background: 'rgba(11, 19, 36, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 120, 255, 0.15)',
    borderRadius: '24px',
    padding: '40px 30px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    textAlign: 'center',
    overflow: 'hidden',
    animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
  },
  neonOrbit: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    background: 'radial-gradient(circle, rgba(121, 0, 194, 0.25) 0%, transparent 70%)',
    top: '-30px',
    right: '-30px',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  header: {
    marginBottom: '30px',
  },
  shieldIcon: {
    fontSize: '44px',
    marginBottom: '15px',
    filter: 'drop-shadow(0 0 10px rgba(121, 0, 194, 0.6))',
    animation: 'pulse 2s infinite alternate',
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 10px 0',
    letterSpacing: '0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#8899aa',
    lineHeight: '1.6',
    margin: 0,
    minHeight: '45px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '8px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#8899aa',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '16px',
    background: '#111d2e',
    border: '1px solid rgba(0, 120, 255, 0.2)',
    borderRadius: '12px',
    color: '#b1f500', // Neon lime color for sci-fi accent
    fontSize: '18px',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: '2px',
    fontFamily: '"Courier New", Courier, monospace',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  inputPassword: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '16px',
    background: '#111d2e',
    border: '1px solid rgba(0, 120, 255, 0.2)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  hint: {
    fontSize: '11px',
    color: '#445566',
    alignSelf: 'center',
    marginTop: '4px',
  },
  forgotBtn: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    textDecoration: 'underline',
    alignSelf: 'center',
    transition: 'color 0.3s ease',
    outline: 'none',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#8899aa',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '5px',
    alignSelf: 'center',
    transition: 'color 0.3s ease',
    outline: 'none',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '10px',
    color: '#f87171',
    padding: '12px 16px',
    fontSize: '13px',
    textAlign: 'left',
  },
  submitBtn: {
    padding: '16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #7900c2 0%, #4c0082 100%)',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(121, 0, 194, 0.4)',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  footer: {
    marginTop: '25px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '20px',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: '#f87171',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'color 0.3s ease',
  },
};

export default VerifyRoleCodeForm;
