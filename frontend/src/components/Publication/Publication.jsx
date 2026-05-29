import React from 'react';
import { useNavigate } from 'react-router-dom';
import startupImg from '../../assets/startup_publish_bg.png';
import founderImg from '../../assets/founder_publish_bg.png';
import investorImg from '../../assets/investor_publish_bg.png';
import './Publication.css';

const Publication = ({ onSelectCard }) => {
  const navigate = useNavigate();

  const handleCardClick = (tabName) => {
    if (onSelectCard) {
      onSelectCard(tabName);
    } else {
      navigate('/PublishGeneral', { state: { activeTab: tabName } });
    }
  };

  return (
    <div className="publication-section">
      {/* Barra de cabecera superior con borde lima */}
      <div className="pub-header-bar">
        <h2>¡Inscríbete en la vitrina más importante del ecosistema latino!</h2>
      </div>

      {/* Grid de 3 Columnas/Tarjetas */}
      <div className="pub-grid">
        {/* Tarjeta 1: Publica tu Startup */}
        <div 
          className="pub-card" 
          onClick={() => handleCardClick('startup')}
          role="button"
          tabIndex={0}
        >
          <div className="pub-card-img-wrapper">
            <img src={startupImg} alt="Publica tu Startup" className="pub-card-img" />
            <div className="pub-card-overlay" />
          </div>
          <div className="pub-card-content">
            <h3 className="pub-card-title">
              Publica tu <br />
              <span className="pub-highlight">Startup</span>
            </h3>
          </div>
          <div className="pub-card-bottom-line" />
        </div>

        {/* Tarjeta 2: Publícate como Founder */}
        <div 
          className="pub-card" 
          onClick={() => handleCardClick('founder')}
          role="button"
          tabIndex={0}
        >
          <div className="pub-card-img-wrapper">
            <img src={founderImg} alt="Publícate como Founder" className="pub-card-img" />
            <div className="pub-card-overlay" />
          </div>
          <div className="pub-card-content">
            <h3 className="pub-card-title">
              Publícate <br />
              como <span className="pub-highlight">Founder</span>
            </h3>
          </div>
          <div className="pub-card-bottom-line" />
        </div>

        {/* Tarjeta 3: Publícate como Inversionista */}
        <div 
          className="pub-card" 
          onClick={() => handleCardClick('investor')}
          role="button"
          tabIndex={0}
        >
          <div className="pub-card-img-wrapper">
            <img src={investorImg} alt="Publícate como Inversionista" className="pub-card-img" />
            <div className="pub-card-overlay" />
          </div>
          <div className="pub-card-content">
            <h3 className="pub-card-title">
              Publícate <br />
              como <span className="pub-highlight">Inversionista</span>
            </h3>
          </div>
          <div className="pub-card-bottom-line" />
        </div>
      </div>
    </div>
  );
};

export default Publication;
