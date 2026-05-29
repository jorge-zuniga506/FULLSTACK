import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './CapsulasView.css';

// Importar imágenes de assets
import bannerImg from '../../assets/capsulas_banner.png';
import imgBiotech from '../../assets/podcast_biotech.png';
import imgJose from '../../assets/podcast_jose.png';
import imgAfterOffice from '../../assets/podcast_afteroffice.png';

/**
 * CapsulasView — Vista premium interactiva para los Video Podcasts y Cápsulas de Ecosistema
 */
const CapsulasView = () => {

  const handleRegisterSponsor = () => {
    Swal.fire({
      title: '¡Postulación de Sponsorship Recibida, señor!',
      html: `<p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.5;">
              Gracias por tu interés en patrocinar nuestras cápsulas y video podcast.
              <br/><br/>
              Un asesor de nuestra mesa de enlace del ecosistema se pondrá en contacto para presentarte las métricas de audiencia y los planes de auspicios para toda Latinoamérica.
             </p>`,
      icon: 'success',
      confirmButtonText: 'Excelente, Jarvis',
      confirmButtonColor: '#8b00dd',
      background: '#040d18',
      color: '#ffffff'
    });
  };

  const handlePlayVideo = (episodeTitle, youtubeUrl) => {
    Swal.fire({
      title: episodeTitle,
      html: `<p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.5;">
              Iniciando la transmisión del episodio en una nueva pestaña...
             </p>`,
      icon: 'info',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
      background: '#040d18',
      color: '#ffffff',
      willClose: () => {
        window.open(youtubeUrl, '_blank');
      }
    });
  };

  const episodes = [
    {
      id: 1,
      title: 'Biotech | Pitch Perfect',
      subtitle: 'Startups Biotech',
      img: imgBiotech,
      url: 'https://www.youtube.com/watch?v=1UPa3Yucdlnth10KL3IR03mtv39G-kusW'
    },
    {
      id: 2,
      title: 'José García - Managing Partner',
      subtitle: 'Entrevista Exclusiva',
      img: imgJose,
      url: 'https://www.youtube.com/watch?v=1UPa3Yucdlnth10KL3IR03mtv39G-kusW'
    },
    {
      id: 3,
      title: 'After Office Startups Latam - CAP11',
      subtitle: 'Insights de Semestre',
      img: imgAfterOffice,
      url: 'https://www.youtube.com/watch?v=1UPa3Yucdlnth10KL3IR03mtv39G-kusW'
    }
  ];

  return (
    <div className="capsulas-page-wrapper">
      <div className="capsulas-container">
        
        {/* ─── BOTÓN VOLVER E INICIATIVAS H1 ─── */}
        <div className="capsulas-header-nav">
          <Link to="/" className="back-to-landing-btn" aria-label="Volver a Iniciativas">
            <span className="back-arrow-icon">‹</span>
            <span className="back-text">Iniciativas</span>
          </Link>
        </div>

        {/* ─── BANNER PRINCIPAL + ¿QUÉ ES? CARD ─── */}
        <div className="capsulas-hero-grid">
          
          {/* Tarjeta de Banner Izquierdo */}
          <div className="capsulas-banner-card">
            <img src={bannerImg} alt="Video Podcast Astronaut Banner" className="capsulas-banner-img" />
          </div>

          {/* Tarjeta Informativa Derecha "¿Qué es?" */}
          <div className="capsulas-info-card">
            <h2 className="info-card-title">¿Qué es?</h2>
            
            <div className="info-card-body">
              <p>
                Explora nuestros video podcast que profundizan en el dinámico mundo de las startups y los inversionistas de América Latina. Sumérgete en conversaciones interesantes que revelan el espíritu emprendedor, la innovación y el panorama de inversión de la región.
              </p>
              <p>
                Desde ideas innovadoras hasta financiación estratégica, estos episodios muestran los viajes de fundadores visionarios y los VC inteligentes que creen en ellos.
              </p>
              <p>
                Obtén información valiosa sobre los desafíos, los triunfos y las tendencias en evolución que dan forma al ecosistema de startups de América Latina.
              </p>
            </div>
          </div>

        </div>

        {/* ─── SECCIÓN DE EPISODIOS DE VIDEO PODCAST ─── */}
        <div className="capsulas-episodes-section">
          
          <div className="episodes-row-grid">
            {episodes.map((ep) => (
              <div 
                key={ep.id} 
                className="episode-video-card"
                onClick={() => handlePlayVideo(ep.title, ep.url)}
              >
                <div className="video-thumbnail-wrapper">
                  <img src={ep.img} alt={ep.title} className="video-thumbnail-img" />
                  
                  {/* Botón de reproducción estilo YouTube */}
                  <div className="youtube-play-btn-overlay">
                    <svg viewBox="0 0 68 48" className="youtube-play-icon">
                      <path className="youtube-play-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,0.13,34,0.13,34,0.13s-21.79,0-27.1,1.42c-2.93,0.78-4.64,3.26-5.42,6.19C0.06,13.05,0.06,24,0.06,24s0,10.95,1.42,16.26c0.78,2.93,2.49,5.41,5.42,6.19C12.21,47.87,34,47.87,34,47.87s21.79,0,27.1-1.42c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,67.94,24,67.94,24S67.94,13.05,66.52,7.74z" fill="#FF0000" />
                      <polygon points="27.42,14.67 44.82,24 27.42,33.33" fill="#FFFFFF" />
                    </svg>
                  </div>
                </div>
                
                <div className="episode-card-info">
                  <h3>{ep.title}</h3>
                  <p>{ep.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ─── LLAMADO A LA ACCIÓN: SPONSOR ─── */}
        <div className="capsulas-sponsor-cta-block">
          <p className="sponsor-cta-pitch">
            Sé sponsor de nuestros video podcast para que toda Latinoamérica conozca tu marca
          </p>
          
          <button 
            className="sponsor-action-btn-lime"
            onClick={handleRegisterSponsor}
          >
            Quiero ser sponsor
          </button>
        </div>

      </div>
    </div>
  );
};

export default CapsulasView;
