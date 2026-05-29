import React, { useState, useEffect } from 'react';

/**
 * CookieConsent — Banner premium de consentimiento de cookies.
 * Cumple con los requisitos legales antes del lanzamiento del sitio web.
 */
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent_accepted');
    if (!consent) {
      // Retraso de entrada elegante
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent_accepted', 'true');
    triggerClose();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent_accepted', 'false');
    triggerClose();
  };

  const triggerClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
    }, 500);
  };

  if (!visible) return null;

  return (
    <div className={`cookie-consent-banner ${fadeOut ? 'fade-out' : ''}`}>
      <div className="cookie-consent-header">
        <span className="cookie-consent-icon">🍪</span>
        <h4 className="cookie-consent-title">Preferencia de Cookies</h4>
      </div>
      <p className="cookie-consent-text">
        Utilizamos cookies de sesión seguras (HttpOnly) y tecnologías de almacenamiento local para garantizar el funcionamiento del inicio de sesión, mantener tu sesión activa y mejorar tu experiencia en Nexus Cobalt.
      </p>
      <div className="cookie-consent-actions">
        <button onClick={handleAccept} className="cookie-btn cookie-btn-primary">
          Aceptar
        </button>
        <button onClick={handleDecline} className="cookie-btn cookie-btn-secondary">
          Rechazar
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
