import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ADMIN_SECRET_DASHBOARD_PATH } from '../constants/adminRoute';

/**
 * RoleRouteGuard — Enforces:
 * 1. Authentication (valid token)
 * 2. Mandatory 2FA Validation (isRoleVerified must be true)
 * 3. Role authorization (role_id match)
 */
const RoleRouteGuard = ({ children, allowedRoles }) => {
  const { token, user, isRoleVerified, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
        <span>Verificando credenciales de seguridad...</span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 1. Not authenticated -> Redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Authenticated but 2FA is not yet verified -> Redirect to code verification page
  if (!isRoleVerified) {
    return <Navigate to="/verify-role-code" replace />;
  }

  // 3. 2FA verified, check role authorizations
  if (user && allowedRoles && !allowedRoles.includes(user.role_id)) {
    return (
      <div style={styles.deniedContainer}>
        <div style={styles.card}>
          <div style={styles.shieldIcon}>🚫</div>
          <h2 style={styles.title}>Acceso Denegado</h2>
          <p style={styles.message}>
            Tu rol actual ({getRoleName(user.role_id)}) no dispone de los permisos criptográficos necesarios para ver este canal privado.
          </p>
          <button
            onClick={() => window.location.href = getRoleDashboard(user.role_id)}
            style={styles.backBtn}
          >
            Volver a mi Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
};

const getRoleName = (roleId) => {
  if (roleId === 1) return 'Administrador';
  if (roleId === 2) return 'Startup';
  if (roleId === 3) return 'Aceleradora';
  if (roleId === 4) return 'Inversor';
  return 'Usuario';
};

const getRoleDashboard = (roleId) => {
  if (roleId === 1) return ADMIN_SECRET_DASHBOARD_PATH;
  if (roleId === 2) return '/dashboard/startup';
  if (roleId === 3) return '/dashboard/aceleradora';
  if (roleId === 4) return '/dashboard/inversor';
  return '/dashboard';
};

const styles = {
  loadingScreen: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#060d1a',
    color: '#b1f500',
    fontFamily: '"Outfit", sans-serif',
    fontSize: '16px',
  },
  spinner: {
    border: '4px solid rgba(177, 245, 0, 0.1)',
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    borderLeftColor: '#b1f500',
    animation: 'spin 1s linear infinite',
    marginBottom: '18px',
  },
  deniedContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '100vh',
    background: '#060d1a',
    fontFamily: '"Outfit", sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
  },
  card: {
    background: 'rgba(11, 19, 36, 0.8)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '20px',
    padding: '40px 30px',
    maxWidth: '440px',
    textAlign: 'center',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
  },
  shieldIcon: {
    fontSize: '54px',
    marginBottom: '20px',
    filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.4))',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#f87171',
    margin: '0 0 12px 0',
  },
  message: {
    fontSize: '14px',
    color: '#8899aa',
    lineHeight: '1.6',
    margin: '0 0 25px 0',
  },
  backBtn: {
    padding: '12px 24px',
    background: '#7900c2',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default RoleRouteGuard;
