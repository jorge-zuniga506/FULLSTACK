import React from 'react';
import { Link } from 'react-router-dom';
import './EcosystemNews.css';
import founderNewsImg from '../../assets/startup_founder_news.png';

const EcosystemNews = () => {
  return (
    <section className="eco-news-section">
      {/* ─── HIGHLIGHT NEWS GRID ─── */}
      <div className="eco-news-grid">
        {/* Left card - Big Double Card */}
        <div className="eco-card-big">
          <div className="eco-card-image-wrapper">
            <img src={founderNewsImg} alt="Erebor Bank" className="eco-card-img" />
            <div className="eco-card-gradient-overlay"></div>
          </div>
          <div className="eco-card-arrow-top">↗</div>
          
          <div className="eco-card-bottom-content">
            <h2 className="eco-card-big-title">
              Erebor Bank busca reconectar a Venezuela con el sistema financiero de EE.UU.
            </h2>
            <div className="eco-card-badges">
              <span className="eco-badge-item text-badge">startups latam</span>
              <span className="eco-badge-item flag-badge">🇻🇪</span>
            </div>
          </div>
        </div>

        {/* Right cards container */}
        <div className="eco-news-right-col">
          {/* Top Right Card - Lime Green */}
          <div className="eco-card-lime">
            <div className="eco-card-arrow-top dark-arrow">↗</div>
            <div className="eco-card-lime-content">
              <h3>
                Global66 convierte a Colombia en su segundo mercado regional más grande de Latinoamérica
              </h3>
            </div>
          </div>

          {/* Bottom Right Card - Dark Grey */}
          <div className="eco-card-grey">
            <div className="eco-card-arrow-top">↗</div>
            <div className="eco-card-grey-content">
              <h3>
                Beepay levanta US$400 mil para escalar su tecnología de checkout autónomo en el retail brasileño
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* ─── INICIATIVAS SECTION ─── */}
      <div className="initiatives-header">
        <h3 className="initiatives-section-title">Iniciativas</h3>
        <div className="initiatives-line"></div>
      </div>

      <div className="initiatives-row">
        {/* Card 1: Informe */}
        <Link to="/informes" className="initiative-item-card">
          <div className="initiative-icon-circle">
            <span className="initiative-emoji-icon">📄</span>
          </div>
          <span className="initiative-name">Informe</span>
          <span className="initiative-arrow-right">→</span>
        </Link>

        {/* Card 2: Latam Weeks */}
        <Link to="/latam-weeks" className="initiative-item-card">
          <div className="initiative-icon-circle">
            <span className="initiative-emoji-icon">📅</span>
          </div>
          <span className="initiative-name">Latam Weeks</span>
          <span className="initiative-arrow-right">→</span>
        </Link>

        {/* Card 3: Cápsulas y RRSS */}
        <Link to="/capsulas" className="initiative-item-card">
          <div className="initiative-icon-circle">
            <span className="initiative-emoji-icon">🎙️</span>
          </div>
          <span className="initiative-name">Cápsulas y RRSS</span>
          <span className="initiative-arrow-right">→</span>
        </Link>

        {/* Card 4: Newsletter */}
        <Link to="/newsletter" className="initiative-item-card">
          <div className="initiative-icon-circle">
            <span className="initiative-emoji-icon">📖</span>
          </div>
          <span className="initiative-name">Newsletter</span>
          <span className="initiative-arrow-right">→</span>
        </Link>
      </div>
    </section>
  );
};

export default EcosystemNews;
