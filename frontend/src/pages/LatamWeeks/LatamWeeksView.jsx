import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './LatamWeeksView.css';

// Importar imágenes de assets
import bannerImg from '../../assets/latam_weeks_banner.png';
import imgColombia from '../../assets/latam_colombia.png';
import imgMiami from '../../assets/latam_miami.png';
import imgChile from '../../assets/latam_chile.png';
import imgBolivia from '../../assets/latam_bolivia.png';
import imgPeru from '../../assets/latam_peru.png';
import imgMexico from '../../assets/latam_mexico.png';
import imgArgentina from '../../assets/latam_argentina.png';

/**
 * LatamWeeksView — Vista premium interactiva para los eventos de Startups Latam Weeks
 */
const LatamWeeksView = () => {

  const handleRegisterInterest = () => {
    Swal.fire({
      title: '¡Postulación Recibida, señor!',
      text: 'Tu solicitud para ser parte de Startups Latam Weeks 2024 como sponsor, speaker o asistente prioritario ha sido cargada con éxito.',
      icon: 'success',
      confirmButtonText: 'Entendido, Jarvis',
      confirmButtonColor: '#8b00dd',
      background: '#040d18',
      color: '#ffffff',
      backdrop: `rgba(139,0,221,0.15)`
    });
  };

  const handleCountryClick = (countryName) => {
    Swal.fire({
      title: `Startups Latam Week - ${countryName}`,
      html: `<p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.5;">
              ¡El punto de encuentro tecnológico del año está llegando a <b>${countryName}</b>!
              <br/><br/>
              Pronto abriremos el registro de charlas, paneles VIP y rondas de negocios privadas.
             </p>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Quiero Postularme',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#00d17c',
      cancelButtonColor: '#3085d6',
      background: '#040d18',
      color: '#ffffff'
    }).then((result) => {
      if (result.isConfirmed) {
        handleRegisterInterest();
      }
    });
  };

  // Datos para los 7 países con sus respectivas imágenes individuales de alta calidad
  const countries = [
    { id: 1, name: 'Colombia', img: imgColombia, color: '#8b00dd' },
    { id: 2, name: 'Miami', img: imgMiami, color: '#eab308' },
    { id: 3, name: 'Chile', img: imgChile, color: '#06b6d4' },
    { id: 4, name: 'Bolivia', img: imgBolivia, color: '#84cc16' },
    { id: 5, name: 'Perú', img: imgPeru, color: '#a855f7' },
    { id: 6, name: 'México', img: imgMexico, color: '#ec4899' },
    { id: 7, name: 'Argentina', img: imgArgentina, color: '#3b82f6' }
  ];

  return (
    <div className="latam-weeks-page-wrapper">
      <div className="latam-weeks-container">
        
        {/* ─── BOTÓN VOLVER E INICIATIVAS H1 ─── */}
        <div className="weeks-header-nav">
          <Link to="/" className="back-to-landing-btn" aria-label="Volver a Iniciativas">
            <span className="back-arrow-icon">‹</span>
            <span className="back-text">Iniciativas</span>
          </Link>
        </div>

        {/* ─── BANNER PRINCIPAL + ¿QUÉ ES? CARD ─── */}
        <div className="weeks-hero-grid">
          
          {/* Tarjeta de Banner Izquierdo */}
          <div className="weeks-banner-card">
            <img src={bannerImg} alt="Startups Latam Weeks Astronaut Banner" className="weeks-banner-img" />
          </div>

          {/* Tarjeta Informativa Derecha "¿Qué es?" */}
          <div className="weeks-info-card">
            <h2 className="info-card-title">¿Qué es?</h2>
            
            <div className="info-card-body">
              <p>
                Startups Latam Weeks vienen a reemplazar a los eventos monótonos locales, y buscan internacionalizar los eventos más pequeños, hacerlos más relevantes en el calendario anual, ya que son en estos donde se generan los mejores lazos.
              </p>
              <p>
                En distintos países y con distintos speakers, paneles, charlas y rondas de negocio, generamos estos puntos de encuentro a lo largo de cada año.
              </p>
              <p>
                Participa como speaker y/o sponsor y posiciónate en el ecosistema startups de Latinoamérica.
              </p>
            </div>

            <button 
              className="register-interest-btn"
              onClick={handleRegisterInterest}
            >
              Quiero ser parte de los Startups Latam Week 2024
            </button>
          </div>

        </div>

        {/* ─── SECCIÓN PAÍSES QUE VISITAREMOS ─── */}
        <div className="weeks-countries-section">
          
          <h2 className="countries-section-title">Países que visitaremos en 2024</h2>
          
          <div className="countries-row-grid">
            {countries.map((country) => (
              <div 
                key={country.id} 
                className="country-character-card"
                onClick={() => handleCountryClick(country.name)}
                style={{ '--accent-glow': country.color }}
              >
                <div className="character-img-wrapper">
                  <img 
                    src={country.img} 
                    alt={`Avatar de ${country.name}`} 
                    className="country-avatar-img"
                  />
                  <div className="vertical-label-overlay" style={{ borderRight: `4px solid ${country.color}` }}>
                    <span className="vertical-country-name">{country.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

export default LatamWeeksView;
