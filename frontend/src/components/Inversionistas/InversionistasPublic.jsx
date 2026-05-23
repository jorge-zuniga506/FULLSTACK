import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar/NavbarLandpage";
import Footer from "../Footer/Footer";
import "../../styles/LandPage.css";
import "../../styles/Inversionistas.css";

const INVERSIONISTAS = [
  {
    id: 1,
    name: 'Francisco Marin',
    role: 'Ángel Inversionista',
    fund: 'Independiente',
    country: 'Chile',
    industry: 'Fintech',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
    description: 'Emprendedor serial con más de 20 años de experiencia en el mundo financiero. Francisco apoya activamente a startups en etapas tempranas con mentoría estratégica y capital.',
    email: 'francisco@marin.cl',
    linkedin: 'https://linkedin.com',
    ticketMin: '$10K',
    ticketMax: '$150K',
    stage: 'Pre-seed / Seed',
    portfolio: 12,
    bannerStyle: 'linear-gradient(135deg, #0d1b2a, #1b3a5c)',
  },
  {
    id: 2,
    name: 'Isidora Oyarzún',
    role: 'Venture Partner',
    fund: 'Southern Ventures',
    country: 'Chile',
    industry: 'EdTech',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    description: 'Especialista en EdTech y economía del conocimiento. Isidora lidera inversiones en soluciones educativas de alto impacto para mercados emergentes latinoamericanos.',
    email: 'isidora@southernventures.cl',
    linkedin: 'https://linkedin.com',
    ticketMin: '$50K',
    ticketMax: '$500K',
    stage: 'Seed / Serie A',
    portfolio: 8,
    bannerStyle: 'linear-gradient(135deg, #1a0533, #3d0a7a)',
  },
  {
    id: 3,
    name: 'Tytus Cytowski',
    role: 'Managing Partner',
    fund: 'C+Ventures',
    country: 'México',
    industry: 'SaaS / IA',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256&q=80',
    description: 'Inversor especializado en SaaS B2B y aplicaciones de inteligencia artificial. Tytus co-lidera un fondo de $30M con foco en la próxima generación de software empresarial en LATAM.',
    email: 'tytus@cventures.mx',
    linkedin: 'https://linkedin.com',
    ticketMin: '$100K',
    ticketMax: '$2M',
    stage: 'Serie A / B',
    portfolio: 21,
    bannerStyle: 'linear-gradient(135deg, #001a0d, #003d1f)',
  },
  {
    id: 4,
    name: 'üFund',
    role: 'Fondo de Capital',
    fund: 'üFund VC',
    country: 'Argentina',
    industry: 'Healthtech',
    avatar: null,
    avatarLogo: 'üfund',
    description: 'Fondo de capital de riesgo especializado en healthtech y biotech. üFund invierte en startups que democratizan el acceso a la salud en toda América Latina.',
    email: 'hola@ufund.vc',
    linkedin: 'https://linkedin.com',
    ticketMin: '$200K',
    ticketMax: '$3M',
    stage: 'Seed / Serie A',
    portfolio: 15,
    bannerStyle: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)',
  },
];

const InversionistasPublic = () => {
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('- Todos -');
  const [selectedInversionista, setSelectedInversionista] = useState(null);

  // Valida y asegura el scroll al inicio de la página al renderizar el componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const industries = ['- Todos -', ...new Set(INVERSIONISTAS.map(i => i.industry))];

  const filtered = INVERSIONISTAS.filter((inv) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [inv.name, inv.role, inv.fund, inv.industry, inv.country]
      .some(f => f.toLowerCase().includes(query));
    const matchesIndustry = selectedIndustry === '- Todos -' || inv.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="landpage-container">
      <Navbar />

      <main className="inv-main">
        {/* Encabezado */}
        <div className="inv-header">
          <span className="inv-badge">💼 Red de Inversionistas</span>
          <h1 className="inv-title">
            <span className="inv-title-inner">Inversionistas</span>
          </h1>
          <p className="inv-subtitle">
            Conecta con los principales inversores del ecosistema que están impulsando startups innovadoras en toda la región.
          </p>
        </div>

        {/* Filtros */}
        <div className="inv-filters-row">
          <div className="inv-filter-field search-field">
            <label className="inv-filter-label">Inversionistas</label>
            <input
              type="text"
              className="inv-filter-input"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="inv-filter-field select-field">
            <label className="inv-filter-label">Industria</label>
            <select
              className="inv-filter-select"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid de cards */}
        <div className="inv-grid">
          {filtered.length > 0 ? filtered.map((inv, index) => (
            <motion.article
              className="inv-card"
              key={inv.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Banner */}
              <div className="inv-card-banner" style={{ background: inv.bannerStyle }}>
                <span className="inv-card-banner-text">{inv.fund}</span>
              </div>

              {/* Avatar */}
              <div className="inv-avatar-container">
                {inv.avatar ? (
                  <img src={inv.avatar} alt={inv.name} className="inv-avatar-img" />
                ) : (
                  <div className="inv-avatar-logo">
                    <span>{inv.avatarLogo}</span>
                  </div>
                )}
              </div>

              {/* Cuerpo */}
              <div className="inv-card-body">
                <h3 className="inv-card-name">{inv.name}</h3>
                <p className="inv-card-role">{inv.role}</p>
                <button
                  className="inv-card-btn"
                  onClick={() => setSelectedInversionista(inv)}
                >
                  Ver Perfil
                </button>
              </div>
            </motion.article>
          )) : (
            <div className="inv-empty">
              <p>No se encontraron inversionistas con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal detalle */}
      {selectedInversionista && (
        <div className="inv-modal-overlay" onClick={() => setSelectedInversionista(null)}>
          <div className="inv-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="inv-modal-close" onClick={() => setSelectedInversionista(null)}>&times;</button>

            <div className="inv-modal-banner" style={{ background: selectedInversionista.bannerStyle }}>
              <span className="inv-modal-banner-text">{selectedInversionista.fund}</span>
            </div>

            <div className="inv-modal-header">
              <div className="inv-modal-avatar-wrap">
                {selectedInversionista.avatar ? (
                  <img src={selectedInversionista.avatar} alt={selectedInversionista.name} className="inv-modal-avatar" />
                ) : (
                  <div className="inv-modal-avatar inv-modal-avatar-logo">
                    <span>{selectedInversionista.avatarLogo}</span>
                  </div>
                )}
              </div>
              <h2 className="inv-modal-name">{selectedInversionista.name}</h2>
              <p className="inv-modal-role">
                {selectedInversionista.role} · <span className="inv-highlight">{selectedInversionista.fund}</span>
              </p>
              <div className="inv-modal-badges">
                <span className="inv-modal-badge">📍 {selectedInversionista.country}</span>
                <span className="inv-modal-badge">🏭 {selectedInversionista.industry}</span>
                <span className="inv-modal-badge">📈 {selectedInversionista.stage}</span>
              </div>
            </div>

            <div className="inv-modal-stats">
              <div className="inv-stat-box">
                <span className="inv-stat-val">{selectedInversionista.ticketMin} – {selectedInversionista.ticketMax}</span>
                <span className="inv-stat-key">Ticket de inversión</span>
              </div>
              <div className="inv-stat-box">
                <span className="inv-stat-val">{selectedInversionista.portfolio}</span>
                <span className="inv-stat-key">Portfolio</span>
              </div>
            </div>

            <div className="inv-modal-body">
              <h3 className="inv-section-title">Sobre el inversionista</h3>
              <p className="inv-modal-desc">{selectedInversionista.description}</p>
            </div>

            <div className="inv-modal-actions">
              <a href={`mailto:${selectedInversionista.email}`} className="inv-action-btn email-btn">
                ✉️ Enviar Correo
              </a>
              <a href={selectedInversionista.linkedin} target="_blank" rel="noopener noreferrer" className="inv-action-btn linkedin-btn">
                🔗 Perfil Profesional
              </a>
            </div>
          </div>
        </div>
      )}
      {/* Universal Footer */}
      <Footer />
    </div>
  );
};

export default InversionistasPublic;
