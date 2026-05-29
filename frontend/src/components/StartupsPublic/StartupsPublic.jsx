import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/NavbarLandpage";
import Footer from "../Footer/Footer";
import Pagination from "../Common/Pagination";
import "../../styles/StartupsPublic.css";

// ─── Datos Mock ───────────────────────────────────────────────────────────────
const STARTUPS = [
  {
    id: 1,
    name: 'Examedi',
    sector: 'Healthtech',
    stage: 'Serie A',
    amount: '$17.0M',
    year: 2021,
    country: 'Chile',
    logo: 'examedi',
    status: 'Activa',
    description: 'Examedi es una startup chilena fundada con el objetivo de transformar el acceso a la atención médica en América Latina, ofreciendo servicios de laboratorio a domicilio y telemedicina de alta calidad.'
  },
  {
    id: 3,
    name: 'Codlylabs',
    sector: 'AI & Software',
    stage: 'Seed',
    amount: '$600K',
    year: 2023,
    country: 'Costa Rica',
    logo: 'codlylabs',
    status: 'Activa',
    description: 'Codlylabs es una plataforma de automatización del desarrollo de software que permite a las empresas ejecutar agentes de inteligencia artificial autónomos para acelerar sus ciclos de desarrollo.'
  },
  {
    id: 4,
    name: 'Kusco.ai',
    sector: 'AI Conversational',
    stage: 'Pre-seed',
    amount: '$120K',
    year: 2024,
    country: 'México',
    logo: 'kusco',
    status: 'Activa',
    description: 'Kusco.ai es una herramienta conversacional de networking inteligente. Kusco es tu aliado conversacional empático y proactivo que te ayuda a conectar de manera efectiva con profesionales de tu sector.'
  },
  {
    id: 5,
    name: 'Hi Fenix',
    sector: 'AI & Automation',
    stage: 'Seed',
    amount: '$320K',
    year: 2024,
    country: 'Argentina',
    logo: 'hi-fenix',
    status: 'Activa',
    description: 'Hi Fenix es una startup argentina que impulsa la transformación digital de los negocios en Latinoamérica con inteligencia artificial y automatización inteligente.'
  },
  {
    id: 6,
    name: 'AJAW.AI',
    sector: 'IA Comercial',
    stage: 'Early Stage',
    amount: '$250K',
    year: 2024,
    country: 'Chile',
    logo: 'ajaw',
    status: 'Activa',
    description: 'AJAW.AI es la primera plataforma de inteligencia comercial con IA diseñada para mercados hispanohablantes, que automatiza la generación de leads y la conversión comercial.'
  },
  {
    id: 7,
    name: 'Tincadia',
    sector: 'Inclusión Tech',
    stage: 'Seed',
    amount: '$380K',
    year: 2024,
    country: 'México',
    logo: 'tincadia',
    status: 'Activa',
    description: 'Tincadia es una empresa de tecnología inclusiva centrada en accesibilidad y discapacidad, impulsando soluciones con inteligencia artificial para la inclusión laboral.'
  },
  {
    id: 8,
    name: 'Callbook.ai',
    sector: 'Voice AI',
    stage: 'Pre-seed',
    amount: '$190K',
    year: 2024,
    country: 'Colombia',
    logo: 'callbook',
    status: 'Activa',
    description: 'Callbook.ai es una agencia de llamadas con inteligencia artificial que suena exactamente como una persona real y automatiza procesos clave de atención y ventas.'
  }
];

/**
 * Renderizado de logotipos vectoriales de alta fidelidad para las startups clave,
 * y fallback estilizado para el resto.
 */
const getLogoWrapperStyle = (logoKey) => {
  const sizes = {
    examedi: { width: '100%', maxWidth: '180px', height: '100%' },
    parkgo: { width: '100%', height: '100%' },
    codlylabs: { width: '100%', maxWidth: '140px', height: '100%' },
    kusco: { width: '100%', maxWidth: '130px', height: '100%' },
    'hi-fenix': { width: '100%', maxWidth: '120px', height: '100%' },
    ajaw: { width: '50%', maxWidth: '100px', height: '50%' },
    tincadia: { width: '100%', maxWidth: '130px', height: '100%' },
    callbook: { width: '50%', maxWidth: '100px', height: '50%' },
  };
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...sizes[logoKey],
  };
};

const getModalTitleColor = (logoKey) => {
  switch (logoKey) {
    case 'examedi':
      return '#0056ff';
    case 'parkgo':
      return '#2563eb';
    case 'codlylabs':
      return '#c026d3';
    case 'kusco':
      return '#8b00dd';
    case 'hi-fenix':
      return '#ff6a00';
    case 'ajaw':
      return '#6b5bff';
    case 'tincadia':
      return '#ffffff';
    case 'callbook':
      return '#4f46e5';
    default:
      return '#ffffff';
  }
};

const renderLogo = (logoKey, name) => {
  const wrapperStyle = getLogoWrapperStyle(logoKey);

  if (logoKey === 'examedi') {
    return (
      <div style={wrapperStyle}>
        <svg viewBox="0 0 140 35" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }}>
          <path d="M14 22 L24 12 L34 22" stroke="#0056ff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 18 V28 M19 23 H29" stroke="#0056ff" strokeWidth="3" strokeLinecap="round" />
          <text x="44" y="27" fill="#0056ff" fontSize="21" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif">examedi</text>
          <text x="131" y="16" fill="#0056ff" fontSize="7" fontWeight="bold">®</text>
        </svg>
      </div>
    );
  }
  if (logoKey === 'parkgo') {
    return (
      <div style={{ ...wrapperStyle, position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1838a3, #2563eb)' }}>
        <svg style={{ position: 'absolute', opacity: 0.12, width: '100%', height: '100%' }}>
          <path d="M0 20 H300 M0 60 H300 M0 100 H300 M0 140 H300 M40 0 V180 M120 0 V180 M200 0 V180 M280 0 V180" stroke="#ffffff" strokeWidth="1" />
          <path d="M-50 0 L350 200 M-50 200 L350 0" stroke="#ffffff" strokeWidth="1" />
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: '800', fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.5px' }}>ParkGO</span>
        </div>
      </div>
    );
  }
  if (logoKey === 'codlylabs') {
    return (
      <div style={{ ...wrapperStyle, flexDirection: 'column', gap: '2px' }}>
        <span style={{ color: '#c026d3', fontSize: '32px', fontWeight: '900', fontFamily: 'monospace', lineHeight: 1 }}>&gt;_</span>
        <span style={{ color: '#c026d3', fontSize: '18px', fontWeight: '800', fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '1px', lineHeight: 1 }}>CODLYLABS</span>
        <span style={{ color: '#ec4899', fontSize: '8px', fontWeight: '700', fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '1.5px', marginTop: '2px' }}>AI CODLY AGENT</span>
      </div>
    );
  }
  if (logoKey === 'kusco') {
    return (
      <div style={wrapperStyle}>
        <span style={{ color: '#ffffff', fontSize: '26px', fontWeight: '900', fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.5px' }}>Kusco<span style={{ color: '#8b00dd' }}>.ai</span></span>
      </div>
    );
  }

  if (logoKey === 'hi-fenix') {
    return (
      <div style={{ ...wrapperStyle, flexDirection: 'column', gap: '6px' }}>
        <span style={{ color: '#ff6a00', fontSize: '3rem', fontWeight: '900', fontFamily: 'system-ui, sans-serif' }}>hf</span>
        <span style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '800', letterSpacing: '0.1em' }}>Hi Fenix</span>
      </div>
    );
  }

  if (logoKey === 'ajaw') {
    return (
      <div style={{ ...wrapperStyle, flexDirection: 'column', gap: '6px' }}>
        <span style={{ color: '#6b5bff', fontSize: '1.95rem', fontWeight: '900', fontFamily: 'system-ui, sans-serif' }}>AJAW</span>
        <span style={{ color: '#c4c2ff', fontSize: '0.88rem', fontWeight: '700', letterSpacing: '0.1em' }}>AI</span>
      </div>
    );
  }

  if (logoKey === 'tincadia') {
    return (
      <div style={{ ...wrapperStyle, flexDirection: 'column', gap: '6px' }}>
        <span style={{ color: '#111111', background: '#ffffff', padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '1.1rem', fontWeight: '800' }}>TIN</span>
        <span style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', letterSpacing: '0.06em' }}>cadia</span>
      </div>
    );
  }

  if (logoKey === 'callbook') {
    return (
      <div style={{ ...wrapperStyle, maxWidth: '170px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
          <div style={{ width: 56, height: 56, minWidth: 56, minHeight: 56, borderRadius: 12, background: '#4f46e5', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <span style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: '800' }}>C</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', overflow: 'hidden' }}>
            <span style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '800', letterSpacing: '0.02em', whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}>callbook.ai</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', marginTop: '2px' }}>Voice AI</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback para emojis
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '2.4rem' }}>{logoKey}</span>
      <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'Inter, sans-serif', color: '#ffffff' }}>{name}</span>
    </div>
  );
};

const StartupsPublic = () => {
  const [search, setSearch] = useState(''); // Filtro de búsqueda
  const [country, setCountry] = useState('Todos'); // Filtro de país
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStartup, setActiveStartup] = useState(null);

  // Paginación local para datos mock
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const openStartupModal = (startup) => {
    setActiveStartup(startup);
    setIsModalOpen(true);
  };

  const closeStartupModal = () => {
    setIsModalOpen(false);
    setActiveStartup(null);
  };

  // Lista dinámica de países disponibles
  const countries = ['Todos', ...new Set(STARTUPS.map(s => s.country))];

  // Filtra startups por nombre y país
  const filtered = STARTUPS.filter(s => {
    if (country !== 'Todos' && s.country !== country) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Cálculos de paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="public-startups-container">
      {/* ── NAVBAR PÚBLICA ── */}
      <Navbar />

      {/* ── MAIN SECTION ── */}
      <main className="public-startups-main">
        {/* Encabezado */}
        <div className="public-startups-header">
          <span className="public-badge">🚀 Directorio del Ecosistema</span>
          <h1 className="public-title"><span className="public-title-inner">Startups</span></h1>
          <p className="public-subtitle">
            Conoce las startups de tecnología y emprendimientos que están liderando la innovación y transformación digital en la región.
          </p>
        </div>

        {/* ── FILTROS (Buscador y País) ── */}
        <div className="public-filters-row">
          {/* Campo de búsqueda (Startup) */}
          <div className="public-filter-field">
            <label className="public-filter-label">Startup</label>
            <input
              type="text"
              className="public-filter-input"
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Campo selector (País) */}
          <div className="public-filter-field">
            <label className="public-filter-label">País</label>
            <select
              className="public-filter-select"
              value={country}
              onChange={e => setCountry(e.target.value)}
            >
              {countries.map(c => (
                <option key={c} value={c}>
                  {c === 'Todos' ? '- Todos -' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── GRID DE TARJETAS ── */}
        <div className="public-startups-grid">
          {paginatedItems.map(s => (
            <div className="public-startup-card" key={s.id}>
              <div className="public-startup-card-top">
                {renderLogo(s.logo, s.name)}
              </div>
              <div className="public-startup-card-body">
                <h3 className="public-startup-card-title">{s.name}</h3>
                <p className="public-startup-card-desc">{s.description}</p>

                <div className="public-startup-card-action">
                  <button
                    type="button"
                    className="public-startup-btn-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      openStartupModal(s);
                    }}
                  >
                    Ver Startup
                  </button>
                </div>

                <div className="public-startup-card-meta">
                  <div className="public-startup-meta-left">
                    <span className="public-startup-stage-badge">{s.stage}</span>
                    <span>· {s.country}</span>
                  </div>
                  <span className="public-startup-sector">{s.sector}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PAGINACIÓN ── */}
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
        {isModalOpen && activeStartup && (
          <div className="public-startup-modal-overlay" onClick={closeStartupModal}>
            <div className="public-startup-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="public-startup-modal-close"
                onClick={closeStartupModal}
                aria-label="Cerrar modal"
              >
                ×
              </button>

              <div className="public-startup-modal-header" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span className="public-startup-modal-badge">Startup</span>
                <h2 className="public-startup-modal-title" style={{ marginBottom: '0.25rem', color: getModalTitleColor(activeStartup.logo) }}>{activeStartup.name}</h2>
                <p className="public-startup-modal-subtitle" style={{ marginTop: 0 }}>{activeStartup.sector} · {activeStartup.stage} · {activeStartup.country}</p>
              </div>

              <div className="public-startup-modal-body">
                <div className="public-startup-modal-section">
                  <h3>Descripción</h3>
                  <p>{activeStartup.description}</p>
                </div>

                <div className="public-startup-modal-section public-startup-modal-grid">
                  <div>
                    <strong>Financiamiento:</strong>
                    <p>{activeStartup.amount}</p>
                  </div>
                  <div>
                    <strong>Año de fundación:</strong>
                    <p>{activeStartup.year}</p>
                  </div>
                  <div>
                    <strong>Estado:</strong>
                    <p>{activeStartup.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      {/* Universal Footer */}
      <Footer />
    </div>
  );
};

export default StartupsPublic;
