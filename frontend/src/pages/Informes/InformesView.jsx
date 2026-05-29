import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './InformesView.css';

// Importar portadas de los informes generados
import img2024 from '../../assets/informe_latam_2024.png';
import img2023 from '../../assets/informe_latam_2023.png';
import img2022 from '../../assets/informe_latam_2022.png';

/**
 * InformesView — Vista de alta fidelidad que muestra los informes del ecosistema startup Latam
 */
const InformesView = () => {

  const handleDownload = (year, isParticipate = false) => {
    if (isParticipate) {
      Swal.fire({
        title: '¡Gracias por tu interés!',
        text: `Te estás registrando para participar en la elaboración de nuestro ${year}. Un asesor se pondrá en contacto contigo, señor.`,
        icon: 'success',
        confirmButtonColor: '#8b00dd',
        background: '#16171d',
        color: '#ffffff'
      });
    } else {
      Swal.fire({
        title: 'Iniciando descarga',
        text: `Descargando el ${year} en formato PDF de forma segura, señor.`,
        icon: 'info',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: '#16171d',
        color: '#ffffff',
        willClose: () => {
          // Abrir el documento oficial en una nueva pestaña como descarga real
          window.open('https://drive.google.com/file/d/1UPa3Yucdlnth10KL3IR03mtv39G-kusW/view?usp=sharing', '_blank');
        }
      });
    }
  };

  return (
    <div className="informes-page-wrapper">
      <div className="informes-container">
        
        {/* ─── BOTÓN VOLVER E INICIATIVAS H1 ─── */}
        <div className="informes-header-nav">
          <Link to="/" className="back-to-landing-btn" aria-label="Volver a Iniciativas">
            <span className="back-arrow-icon">‹</span>
            <span className="back-text">Iniciativas</span>
          </Link>
        </div>

        {/* ─── BANNER PRINCIPAL + ¿QUÉ ES? CARD ─── */}
        <div className="informes-hero-grid">
          
          {/* Tarjeta de Banner Izquierdo */}
          <div className="informes-banner-card">
            <img src={img2024} alt="Informe Startups Latam 2024" className="informes-banner-img" />
          </div>

          {/* Tarjeta Informativa Derecha "¿Qué es?" */}
          <div className="informes-info-card">
            <h2 className="info-card-title">¿Qué es?</h2>
            
            <div className="info-card-body">
              <p>
                Reporte anual del ecosistema startup de Latam, donde revisamos lo ocurrido el año anterior y lo que viene para este año.
              </p>
              <p>
                Trabajamos en conjunto con los referentes de cada país para resumir cada uno de los ecosistemas.
              </p>
              <p>
                Aquí podrás encontrar resúmenes por industria, consejo de referentes, rankings de startups, fichas de VC y CVCs y los próximos unicornios.
              </p>
            </div>

            <button 
              className="download-btn-green"
              onClick={() => handleDownload('Informe Startups Latam 2024')}
            >
              Descargar
            </button>
          </div>

        </div>

        {/* ─── SECCIÓN HISTÓRICO DE REPORTES ─── */}
        <div className="informes-history-section">
          
          <div className="informes-grid-row">
            
            {/* Tarjeta Informe 2022 */}
            <div className="report-history-card">
              <div className="history-card-img-wrapper">
                <img src={img2022} alt="Informe 2022" />
              </div>
              <div className="history-card-info">
                <h3>Informe 2022</h3>
                <button 
                  className="download-btn-purple"
                  onClick={() => handleDownload('Informe Startups Latam 2022')}
                >
                  Descargar
                </button>
              </div>
            </div>

            {/* Tarjeta Informe 2023 */}
            <div className="report-history-card">
              <div className="history-card-img-wrapper">
                <img src={img2023} alt="Informe 2023" />
              </div>
              <div className="history-card-info">
                <h3>Informe 2023</h3>
                <button 
                  className="download-btn-purple"
                  onClick={() => handleDownload('Informe Startups Latam 2023')}
                >
                  Descargar
                </button>
              </div>
            </div>

            {/* Tarjeta Informe 2024 */}
            <div className="report-history-card">
              <div className="history-card-img-wrapper">
                <img src={img2024} alt="Informe 2024" />
              </div>
              <div className="history-card-info">
                <h3>Informe 2024</h3>
                <button 
                  className="download-btn-purple-active"
                  onClick={() => handleDownload('Informe Startups Latam 2024 (Convocatoria)', true)}
                >
                  Participa
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default InformesView;
