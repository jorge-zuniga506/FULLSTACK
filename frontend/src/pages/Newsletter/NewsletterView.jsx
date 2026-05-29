import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './NewsletterView.css';

// Importar el banner de newsletter oficial
import newsletterBanner from '../../assets/newsletter_banner.png';

/**
 * NewsletterView — Vista premium interactiva para los boletines de Startups Latam News
 */
const NewsletterView = () => {
  const [email, setEmail] = useState('');

  const handleRegisterSponsor = () => {
    Swal.fire({
      title: '¡Postulación de Sponsorship Recibida, señor!',
      html: `<p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.5;">
              Gracias por tu interés en patrocinar nuestro boletín semanal.
              <br/><br/>
              Nuestro equipo revisará tu perfil de marca y te presentará las opciones de banner publicitario o patrocinio de edición completa en menos de 24 horas, señor.
             </p>`,
      icon: 'success',
      confirmButtonText: 'Excelente, Jarvis',
      confirmButtonColor: '#00d17c',
      background: '#040d18',
      color: '#ffffff'
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      Swal.fire({
        title: 'Error, señor',
        text: 'Por favor, ingrese una dirección de correo electrónico válida.',
        icon: 'error',
        confirmButtonColor: '#8b00dd',
        background: '#040d18',
        color: '#ffffff'
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire({
        title: 'Formato inválido, señor',
        text: 'Por favor, introduzca una dirección de correo electrónico correcta.',
        icon: 'warning',
        confirmButtonColor: '#8b00dd',
        background: '#040d18',
        color: '#ffffff'
      });
      return;
    }

    Swal.fire({
      title: '¡Suscripción exitosa, señor!',
      html: `<p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.5;">
              El correo <b>${email}</b> ha sido registrado en nuestra base de datos.
              <br/><br/>
              Recibirá la próxima edición de los martes y jueves directamente en su bandeja de entrada, señor.
             </p>`,
      icon: 'success',
      confirmButtonText: 'Perfecto, Jarvis',
      confirmButtonColor: '#8b00dd',
      background: '#040d18',
      color: '#ffffff'
    });
    setEmail('');
  };

  return (
    <div className="newsletter-page-wrapper">
      <div className="newsletter-container">
        
        {/* ─── BOTÓN VOLVER E INICIATIVAS H1 ─── */}
        <div className="newsletter-header-nav">
          <Link to="/" className="back-to-landing-btn" aria-label="Volver a Iniciativas">
            <span className="back-arrow-icon">‹</span>
            <span className="back-text">Iniciativas</span>
          </Link>
        </div>

        {/* ─── BANNER PRINCIPAL + ¿QUÉ ES? CARD ─── */}
        <div className="newsletter-hero-grid">
          
          {/* Tarjeta de Banner Izquierdo */}
          <div className="newsletter-banner-card">
            <img src={newsletterBanner} alt="Boletín Startups Latam" className="newsletter-banner-img" />
          </div>

          {/* Tarjeta Informativa Derecha "¿Qué es?" */}
          <div className="newsletter-info-card">
            <h2 className="info-card-title">¿Qué es?</h2>
            
            <div className="info-card-body">
              <p>
                El Startups Latam News, es como ir a la fiesta sin expectativas y terminar llegando a tu casa al día siguiente por haberlo pasado tan bien. Todo empezó con una prueba y con tan solo 6 meses tenemos más de 29.000 suscritos y sumando, con una tasa de apertura de 41% que se ha sostenido en el tiempo.
              </p>
              <p>
                Dado su éxito, estamos constantemente innovando en el contenido y lanzamos una segunda edición en la semana. Los martes es el resumen de la semana anterior sobre el ecosistema startup en Latam y los jueves un punteo en promedio de 20 noticias relacionadas con la tecnología e innovación a nivel global + una columna de opinión de un invitado distinto en cada edición.
              </p>
              <p>
                Puedes ser sponsor del una edición completa, o también comprar un banner publicitario.
              </p>
            </div>

            <button 
              className="newsletter-sponsor-btn-emerald"
              onClick={handleRegisterSponsor}
            >
              Quiero ser sponsor
            </button>
          </div>

        </div>

        {/* ─── SECCIÓN INTERACTIVA DE SUSCRIPCIÓN AL NEWSLETTER ─── */}
        <div className="newsletter-subscription-box">
          <div className="subscription-box-content">
            <h2 className="subscription-box-title">Únete al Boletín del Ecosistema</h2>
            <p className="subscription-box-subtitle">
              Recibe los mejores insights, noticias corporativas, rondas de financiamiento y columnas de opinión exclusivas todos los martes y jueves, señor.
            </p>
            
            <form className="subscription-form" onSubmit={handleSubscribe} noValidate>
              <div className="input-group-glass">
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico, señor..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                <button type="submit" className="subscribe-submit-btn-purple">
                  Suscribirse ⚡
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewsletterView;
