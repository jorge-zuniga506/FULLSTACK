import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { ADMIN_SECRET_DASHBOARD_PATH } from '../../constants/adminRoute';

const VerifyRoleCodeForm = () => {
  const { verifyCode, resendRoleCode, logout, user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const [deliveryChannel, setDeliveryChannel] = useState(
    sessionStorage.getItem('twoFactorDelivery') || 'email'
  );
  const [deliveryDestination, setDeliveryDestination] = useState(
    sessionStorage.getItem('twoFactorDestination') || ''
  );

  const maskedEmail = useMemo(() => {
    const email = user?.email || '';
    if (!email.includes('@')) return 'tu correo de inicio de sesion';

    const [local, domain] = email.split('@');
    if (!local || !domain) return email;
    if (local.length <= 2) return `${local[0] || '*'}***@${domain}`;

    return `${local.slice(0, 2)}***@${domain}`;
  }, [user]);

  const isWhatsapp = deliveryChannel === 'whatsapp';
  const channelLabel = isWhatsapp ? 'WhatsApp' : 'correo';
  const fallbackDestination = isWhatsapp ? 'tu numero de WhatsApp' : maskedEmail;
  const destinationText = deliveryDestination || fallbackDestination;

  const getRedirectPathByRole = () => {
    if (!user) return '/dashboard';
    if (user.role_id === 1) return ADMIN_SECRET_DASHBOARD_PATH;
    if (user.role_id === 2) return '/dashboard/startup';
    if (user.role_id === 3) return '/dashboard/aceleradora';
    if (user.role_id === 4) return '/dashboard/inversor';
    return '/dashboard';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!code.trim()) {
      setErrorMsg(`Por favor, ingresa el codigo temporal que llego por ${channelLabel}.`);
      return;
    }

    setSubmitting(true);
    const result = await verifyCode(code.trim());
    setSubmitting(false);

    if (result.success) {
      Swal.fire({
        title: 'Acceso autorizado',
        text: 'Verificacion completada correctamente.',
        icon: 'success',
        timer: 1400,
        showConfirmButton: false,
        background: '#111d2e',
        color: '#fff'
      }).then(() => {
        navigate(getRedirectPathByRole());
      });
      return;
    }

    const msg = result.error || 'Codigo invalido o expirado.';
    setErrorMsg(msg);
    Swal.fire({
      title: 'No se pudo validar',
      text: msg,
      icon: 'error',
      confirmButtonColor: '#7900c2',
      background: '#111d2e',
      color: '#fff'
    });
  };

  const handleResend = async () => {
    setErrorMsg('');
    setResending(true);

    const result = await resendRoleCode();
    setResending(false);

    if (result.success) {
      const newChannel = result.twoFactorDelivery || deliveryChannel;
      const newDestination = result.twoFactorDestination || destinationText;

      setDeliveryChannel(newChannel);
      setDeliveryDestination(newDestination);

      Swal.fire({
        title: 'Codigo reenviado',
        text: `Te enviamos un nuevo codigo a ${newDestination}.`,
        icon: 'success',
        confirmButtonColor: '#7900c2',
        background: '#111d2e',
        color: '#fff'
      });
      return;
    }

    const msg = result.error || 'No se pudo reenviar el codigo.';
    setErrorMsg(msg);
    Swal.fire({
      title: 'Error al reenviar',
      text: msg,
      icon: 'error',
      confirmButtonColor: '#7900c2',
      background: '#111d2e',
      color: '#fff'
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <div style={styles.neonOrbit}></div>

        <div style={styles.header}>
          <div style={styles.shieldIcon}>[SEC]</div>
          <h2 style={styles.title}>Verificacion Obligatoria</h2>
          <p style={styles.subtitle}>
            Enviamos un codigo temporal al {channelLabel} con el que intentaste iniciar sesion:
            <br />
            <strong style={styles.email}>{destinationText}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrapper}>
            <label style={styles.label}>Codigo temporal ({channelLabel})</label>
            <input
              type="text"
              maxLength={8}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\s+/g, ''))}
              style={styles.input}
              disabled={submitting}
              autoFocus
            />
            <span style={styles.hint}>
              {isWhatsapp
                ? 'Revisa tu chat de WhatsApp.'
                : 'Revisa bandeja principal, spam y promociones.'}
            </span>
          </div>

          {errorMsg && (
            <div style={styles.errorBanner}>
              <span>[!]</span>
              <div style={{ marginLeft: '8px' }}>{errorMsg}</div>
            </div>
          )}

          <button
            type="submit"
            style={submitting ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? 'Validando...' : 'Validar Identidad'}
          </button>

          <button
            type="button"
            onClick={handleResend}
            style={resending ? { ...styles.secondaryBtn, ...styles.submitBtnDisabled } : styles.secondaryBtn}
            disabled={resending || submitting}
          >
            {resending ? 'Reenviando codigo...' : `Reenviar codigo por ${channelLabel}`}
          </button>
        </form>

        <div style={styles.footer}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Cancelar y Cerrar Sesion
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
    boxSizing: 'border-box'
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
    overflow: 'hidden'
  },
  neonOrbit: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    background: 'radial-gradient(circle, rgba(121, 0, 194, 0.25) 0%, transparent 70%)',
    top: '-30px',
    right: '-30px',
    borderRadius: '50%',
    pointerEvents: 'none'
  },
  header: {
    marginBottom: '26px'
  },
  shieldIcon: {
    fontSize: '44px',
    marginBottom: '14px',
    filter: 'drop-shadow(0 0 10px rgba(121, 0, 194, 0.6))'
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 10px 0',
    letterSpacing: '0.5px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#8899aa',
    lineHeight: '1.6',
    margin: 0
  },
  email: {
    color: '#b1f500'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '8px'
  },
  label: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#8899aa',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    textAlign: 'left'
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '16px',
    background: '#111d2e',
    border: '1px solid rgba(0, 120, 255, 0.2)',
    borderRadius: '12px',
    color: '#b1f500',
    fontSize: '20px',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: '3px',
    fontFamily: '"Courier New", Courier, monospace',
    outline: 'none'
  },
  hint: {
    fontSize: '11px',
    color: '#445566',
    alignSelf: 'center',
    marginTop: '4px'
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
    textAlign: 'left'
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
    boxShadow: '0 4px 15px rgba(121, 0, 194, 0.4)'
  },
  secondaryBtn: {
    padding: '13px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.04)',
    color: '#3b82f6',
    fontSize: '14px',
    fontWeight: '700',
    border: '1px solid rgba(59,130,246,0.35)',
    cursor: 'pointer'
  },
  submitBtnDisabled: {
    opacity: 0.65,
    cursor: 'not-allowed'
  },
  footer: {
    marginTop: '24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '20px'
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: '#f87171',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};

export default VerifyRoleCodeForm;

