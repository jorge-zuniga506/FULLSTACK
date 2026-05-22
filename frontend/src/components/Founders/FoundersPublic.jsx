import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Navbar from "../Navbar/NavbarLandpage";
import "../../styles/LandPage.css";
import "../../styles/FoundersPublic.css";

const FOUNDERS = [
  {
    id: 1,
    name: 'Felipe Morales',
    role: 'Founder',
    venture: 'ES.BUENISIMO',
    country: 'Chile',
    area: 'Marketing',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&h=256&q=80',
    description: 'Especialista en crecimiento digital y branding. Felipe ha liderado el desarrollo de estrategias omnicanal para marcas emergentes en Latinoamérica.',
    email: 'felipe@esbuenisimo.cl',
    linkedin: 'https://linkedin.com',
    bannerStyle: 'linear-gradient(135deg, #111111, #333333)'
  },
  {
    id: 2,
    name: 'Pablo Ignacio Zuñiga Castro',
    role: 'Co-founder',
    venture: 'altoke',
    country: 'México',
    area: 'SaaS',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80',
    description: 'Ingeniero de software con pasión por crear herramientas ágiles. Co-fundador de altoke, una plataforma SaaS de automatización logística en tiempo real.',
    email: 'pablo@altoke.mx',
    linkedin: 'https://linkedin.com',
    bannerStyle: 'linear-gradient(135deg, #222222, #444444)'
  },
  {
    id: 3,
    name: 'Pablo Surazsky',
    role: 'Other',
    venture: 'Telefonos',
    country: 'Argentina',
    area: 'Telecomunicaciones',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    description: 'Con más de 15 años de experiencia en infraestructura de telecomunicaciones, redes corporativas de alto rendimiento y consultoría de conectividad.',
    email: 'pablo@telefonos.com.ar',
    linkedin: 'https://linkedin.com',
    bannerStyle: 'linear-gradient(135deg, #1f2d3d, #3c4f66)'
  },
  {
    id: 4,
    name: 'Nelson Jacobo González Arenas',
    role: 'Co-founder',
    venture: 'LA MÁQUINA',
    country: 'Colombia',
    area: 'Inteligencia Artificial',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    description: 'Diseñador y desarrollador de IA. Nelson enfoca su trabajo en crear experiencias interactivas que combinan arte y algoritmos avanzados.',
    email: 'nelson@lamaquina.co',
    linkedin: 'https://linkedin.com',
    bannerStyle: 'linear-gradient(135deg, #1b002a, #4a0072)'
  }
];

const FoundersPublic = () => {
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('- Todos -');
  const [selectedFounder, setSelectedFounder] = useState(null);

  // Extraer valores únicos dinámicamente para los filtros
  const areas = ['- Todos -', ...new Set(FOUNDERS.map(f => f.area))];

  const filteredFounders = FOUNDERS.filter((founder) => {
    // Filtro de búsqueda textual
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [founder.name, founder.role, founder.venture, founder.area]
      .some((field) => field.toLowerCase().includes(query));

    // Filtro de área de trabajo
    const matchesArea = selectedArea === '- Todos -' || founder.area === selectedArea;

    return matchesSearch && matchesArea;
  });

  return (
    <div className="landpage-container">
      <Navbar />

      <main className="public-founders-main">
        {/* Encabezado Principal */}
        <div className="public-founders-header">
          <span className="public-badge">👑 Red de Innovadores</span>
          <h1 className="public-title">
            <span className="public-title-inner">Founders</span>
          </h1>
          <p className="public-subtitle">
            Conecta, inspira y descubre a los líderes del ecosistema que están construyendo las próximas grandes soluciones de la región.
          </p>
        </div>

        {/* Fila de Filtros Premium */}
        <div className="public-filters-row">
          {/* Input de Búsqueda */}
          <div className="public-filter-field search-field">
            <label className="public-filter-label">Founder</label>
            <input
              type="text"
              className="public-filter-input"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Select de Áreas de Trabajo */}
          <div className="public-filter-field select-field">
            <label className="public-filter-label">Áreas de trabajo</label>
            <select
              className="public-filter-select"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              {areas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Grid de Tarjetas de Founders */}
        <div className="public-founders-grid">
          {filteredFounders.length > 0 ? (
            filteredFounders.map((founder) => (
              <article className="public-founder-card" key={founder.id}>
                {/* Banner de la empresa */}
                <div className="public-founder-banner" style={{ background: founder.bannerStyle }}>
                  <span className="public-founder-banner-text">{founder.venture}</span>
                </div>

                {/* Contenedor de la foto del avatar */}
                <div className="public-founder-avatar-container">
                  <img
                    src={founder.avatar}
                    alt={founder.name}
                    className="public-founder-avatar-img"
                  />
                </div>

                {/* Cuerpo de la tarjeta */}
                <div className="public-founder-card-body">
                  <h3 className="public-founder-name">{founder.name}</h3>
                  <p className="public-founder-role">{founder.role}</p>
                  
                  {/* Botón de Perfil */}
                  <button
                    className="public-founder-profile-btn"
                    onClick={() => setSelectedFounder(founder)}
                  >
                    Ver Perfil
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="public-founders-empty">
              <p>No se encontraron founders que coincidan con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </main>

      {/* ── MODAL DETALLES DEL FOUNDER ────────────────────────────────────── */}
      {selectedFounder && (
        <div className="public-founder-modal-overlay" onClick={() => setSelectedFounder(null)}>
          <div className="public-founder-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="public-founder-modal-close" onClick={() => setSelectedFounder(null)}>
              &times;
            </button>

            <div className="public-founder-modal-banner" style={{ background: selectedFounder.bannerStyle }}>
              <span className="public-founder-modal-banner-text">{selectedFounder.venture}</span>
            </div>

            <div className="public-founder-modal-header">
              <div className="public-founder-modal-avatar-wrap">
                <img
                  src={selectedFounder.avatar}
                  alt={selectedFounder.name}
                  className="public-founder-modal-avatar"
                />
              </div>
              <h2 className="public-founder-modal-name">{selectedFounder.name}</h2>
              <p className="public-founder-modal-role">
                {selectedFounder.role} · <span className="highlight-text">{selectedFounder.venture}</span>
              </p>
              <div className="public-founder-modal-badges">
                <span className="modal-badge">📍 {selectedFounder.country}</span>
                <span className="modal-badge">💻 {selectedFounder.area}</span>
              </div>
            </div>

            <div className="public-founder-modal-body">
              <h3 className="section-title">Sobre mí</h3>
              <p className="public-founder-modal-desc">{selectedFounder.description}</p>
            </div>

            <div className="public-founder-modal-actions">
              <a href={`mailto:${selectedFounder.email}`} className="modal-action-btn email-btn">
                ✉️ Enviar Correo
              </a>
              <a href={selectedFounder.linkedin} target="_blank" rel="noopener noreferrer" className="modal-action-btn linkedin-btn">
                🔗 Perfil Profesional
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoundersPublic;
