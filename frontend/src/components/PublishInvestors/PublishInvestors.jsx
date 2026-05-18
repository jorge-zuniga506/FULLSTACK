import React, { useState, useRef, useEffect } from 'react';
import '../../styles/PublishGeneral.css';

// --- LIST OF OPTIONS ---
const investorTypes = [
  'Venture Capital',
  'Ángel Inversionista',
  'Corporate Venture Capital',
  'Family Office',
  'Aceleradora',
  'Otro'
];

const mockIndustries = [
  'Fintech',
  'Biotech',
  'AgroTech',
  'SaaS',
  'E-commerce',
  'HealthTech',
  'EdTech',
  'Artificial Intelligence',
  'CleanTech',
  'Logistics',
  'PropTech'
];

const countries = [
  { name: 'Costa Rica', code: '+506', flagUrl: 'https://flagcdn.com/w20/cr.png' },
  { name: 'Estados Unidos', code: '+1', flagUrl: 'https://flagcdn.com/w20/us.png' },
  { name: 'Canadá', code: '+1', flagUrl: 'https://flagcdn.com/w20/ca.png' },
  { name: 'México', code: '+52', flagUrl: 'https://flagcdn.com/w20/mx.png' },
  { name: 'Guatemala', code: '+502', flagUrl: 'https://flagcdn.com/w20/gt.png' },
  { name: 'El Salvador', code: '+503', flagUrl: 'https://flagcdn.com/w20/sv.png' },
  { name: 'Honduras', code: '+504', flagUrl: 'https://flagcdn.com/w20/hn.png' },
  { name: 'Nicaragua', code: '+505', flagUrl: 'https://flagcdn.com/w20/ni.png' },
  { name: 'Panamá', code: '+507', flagUrl: 'https://flagcdn.com/w20/pa.png' },
  { name: 'Colombia', code: '+57', flagUrl: 'https://flagcdn.com/w20/co.png' },
  { name: 'Venezuela', code: '+58', flagUrl: 'https://flagcdn.com/w20/ve.png' },
  { name: 'Ecuador', code: '+593', flagUrl: 'https://flagcdn.com/w20/ec.png' },
  { name: 'Perú', code: '+51', flagUrl: 'https://flagcdn.com/w20/pe.png' },
  { name: 'Chile', code: '+56', flagUrl: 'https://flagcdn.com/w20/cl.png' },
  { name: 'Argentina', code: '+54', flagUrl: 'https://flagcdn.com/w20/ar.png' },
  { name: 'Brasil', code: '+55', flagUrl: 'https://flagcdn.com/w20/br.png' },
  { name: 'Uruguay', code: '+598', flagUrl: 'https://flagcdn.com/w20/uy.png' },
  { name: 'Paraguay', code: '+595', flagUrl: 'https://flagcdn.com/w20/py.png' },
  { name: 'Bolivia', code: '+591', flagUrl: 'https://flagcdn.com/w20/bo.png' },
  { name: 'España', code: '+34', flagUrl: 'https://flagcdn.com/w20/es.png' },
  { name: 'Portugal', code: '+351', flagUrl: 'https://flagcdn.com/w20/pt.png' },
  { name: 'Francia', code: '+33', flagUrl: 'https://flagcdn.com/w20/fr.png' },
  { name: 'Alemania', code: '+49', flagUrl: 'https://flagcdn.com/w20/de.png' },
  { name: 'Italia', code: '+39', flagUrl: 'https://flagcdn.com/w20/it.png' },
  { name: 'Reino Unido', code: '+44', flagUrl: 'https://flagcdn.com/w20/gb.png' },
];

// --- SEARCHABLE DROPDOWN COMPONENT ---
const SearchableDropdown = ({
  options,
  selectedValue,
  onSelect,
  placeholder = "Buscar...",
  searchPlaceholder = "Buscar..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentObj = options.find(c => c.name === selectedValue) || options[0];

  return (
    <div className="ps-dropdown-container" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        className={`ps-dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch('');
        }}
        style={{ width: '100%', boxSizing: 'border-box' }}
      >
        <div className="ps-dropdown-trigger-content">
          <img src={currentObj.flagUrl} alt={currentObj.name} style={{ width: '18px', height: '12px', objectFit: 'cover', borderRadius: '2px' }} />
          <span>{currentObj.name}</span>
        </div>
        <span className="ps-dropdown-caret"></span>
      </button>

      {isOpen && (
        <div className="ps-dropdown-menu" style={{ width: '100%', left: '0', top: '105%', zIndex: 1000 }}>
          <div className="ps-dropdown-search-wrapper">
            <span className="ps-dropdown-search-icon">🔍</span>
            <input
              type="text"
              className="ps-dropdown-search-input"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              style={{ color: '#333333 !important' }}
            />
          </div>
          <ul className="ps-dropdown-options-list" style={{ maxHeight: '180px', overflowY: 'auto' }}>
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <li
                  key={c.name}
                  className={`ps-dropdown-option ${selectedValue === c.name ? 'selected' : ''}`}
                  onClick={() => {
                    onSelect(c);
                    setIsOpen(false);
                  }}
                >
                  <img src={c.flagUrl} alt={c.name} style={{ width: '18px', height: '12px', objectFit: 'cover', borderRadius: '2px' }} />
                  <span>{c.name}</span>
                </li>
              ))
            ) : (
              <li className="ps-dropdown-no-results">No se encontraron resultados</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// --- PUBLISH INVESTORS COMPONENT ---
const PublishInvestors = ({ activeTab, onTabChange }) => {
  const [activeStep, setActiveStep] = useState(1);

  // Form Fields State
  const [investorData, setInvestorData] = useState({
    email: '',
    investorName: '',
    investorType: '',
    minTicket: '',
    maxTicket: '',
    selectedIndustry: '',
    addedIndustries: [],
    hqCountry: 'Costa Rica',
    website: '',
    thesis: '',
  });

  const [logoFile, setLogoFile] = useState(null);
  const logoInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvestorData(prev => ({ ...prev, [name]: value }));
  };

  // Add industry to selected list
  const handleAddIndustry = () => {
    const { selectedIndustry, addedIndustries } = investorData;
    if (!selectedIndustry) {
      alert('Por favor, selecciona un sector de interés.');
      return;
    }
    if (addedIndustries.includes(selectedIndustry)) {
      alert('Este sector ya está agregado a tu lista.');
      return;
    }
    setInvestorData(prev => ({
      ...prev,
      addedIndustries: [...prev.addedIndustries, selectedIndustry],
      selectedIndustry: ''
    }));
  };

  // Remove industry from list
  const handleRemoveIndustry = (indToRemove) => {
    setInvestorData(prev => ({
      ...prev,
      addedIndustries: prev.addedIndustries.filter(item => item !== indToRemove)
    }));
  };

  // Step Navigation Validation
  const handleNextStep = (e) => {
    e.preventDefault();
    if (activeStep === 1) {
      // Validate Step 1
      if (!investorData.email || !investorData.investorName || !investorData.investorType) {
        alert('Por favor, complete todos los campos obligatorios (*).');
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      // Validate Step 2
      if (!investorData.minTicket || !investorData.maxTicket) {
        alert('Por favor, complete los rangos de ticket de inversión.');
        return;
      }
      if (investorData.addedIndustries.length === 0) {
        alert('Por favor, seleccione al menos un sector de interés y haga clic en "Agregar".');
        return;
      }
      setActiveStep(3);
    } else {
      // Validate Step 3
      if (!investorData.website || !investorData.thesis || !logoFile) {
        alert('Por favor, rellene todos los campos obligatorios, incluyendo la tesis de inversión y el logotipo.');
        return;
      }
      console.log('Final Investor Registry Submitted:', {
        ...investorData,
        logo: logoFile
      });
      alert('💼 ¡Perfil de Inversionista registrado exitosamente en el Ecosistema Nexus Cobalt!');
    }
  };

  return (
    <div className="publish-startup-page" style={{ padding: 0 }}>
      <div className="publish-startup-container" style={{ boxShadow: 'none', background: 'transparent', padding: 0 }}>

        {/* ─── 1. TABS SUPERIORES ─── */}
        {activeTab && onTabChange && (
          <div className="ps-tabs">
            <button
              type="button"
              className={`ps-tab ${activeTab === 'startup' ? 'active' : 'inactive'}`}
              onClick={() => onTabChange('startup')}
            >
              Registro Startup
            </button>
            <button
              type="button"
              className={`ps-tab ${activeTab === 'founder' ? 'active' : 'inactive'}`}
              onClick={() => onTabChange('founder')}
            >
              Registro Founder
            </button>
            <button
              type="button"
              className={`ps-tab ${activeTab === 'investor' ? 'active' : 'inactive'}`}
              onClick={() => onTabChange('investor')}
            >
              Registro Inversionista
            </button>
          </div>
        )}

        {/* ─── 2. TRACKER DE PASOS (STEP PROGRESS) ─── */}
        <div className="ps-steps-tracker">
          {/* Background gray line */}
          <div className="ps-step-line-bg"></div>
          {/* Active lime green line */}
          <div
            className="ps-step-line-active"
            style={{
              width: activeStep === 1 ? '0%' : activeStep === 2 ? '40%' : '80%',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          ></div>

          <div className="ps-step-nodes">
            <div className={`ps-step-node ${activeStep >= 1 ? 'active' : 'inactive'}`}>1</div>
            <div className={`ps-step-node ${activeStep >= 2 ? 'active' : 'inactive'}`}>2</div>
            <div className={`ps-step-node ${activeStep >= 3 ? 'active' : 'inactive'}`}>3</div>
          </div>
        </div>

        {/* ─── 3. FORMULARIO DE REGISTRO DE INVERSIONISTA ─── */}
        <form onSubmit={handleNextStep} className="ps-form-body" style={{ marginTop: '2rem' }}>
          <h2 className="ps-form-title">
            {activeStep === 1 && 'Información de Inversionista'}
            {activeStep === 2 && 'Tesis y Estrategia de Inversión'}
            {activeStep === 3 && 'Trayectoria y Logotipo de la Firma'}
          </h2>

          {/* PASO 1: INFORMACIÓN DE INVERSIONISTA (EXACTLY MATCHING MOCKUP IMAGE) */}
          {activeStep === 1 && (
            <div className="ps-form-grid">
              {/* Correo electrónico */}
              <div className="ps-input-group">
                <label className="ps-label" htmlFor="email">
                  Correo electrónico<span className="ps-required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={investorData.email}
                  onChange={handleInputChange}
                  placeholder="inversiones@firma.com"
                  className="ps-input"
                  required
                />
              </div>

              {/* Nombre inversionista */}
              <div className="ps-input-group">
                <label className="ps-label" htmlFor="investorName">
                  Nombre inversionista<span className="ps-required">*</span>
                </label>
                <input
                  type="text"
                  id="investorName"
                  name="investorName"
                  value={investorData.investorName}
                  onChange={handleInputChange}
                  placeholder="Nombre de la firma o inversor individual"
                  className="ps-input"
                  required
                />
              </div>

              {/* Tipo inversionista */}
              <div className="ps-input-group">
                <label className="ps-label" htmlFor="investorType">
                  Tipo inversionista<span className="ps-required">*</span>
                </label>
                <select
                  id="investorType"
                  name="investorType"
                  value={investorData.investorType}
                  onChange={handleInputChange}
                  className="ps-select"
                  required
                >
                  <option value="">Seleccionar</option>
                  {investorTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* PASO 2: TESIS Y ESTRATEGIA DE INVERSIÓN */}
          {activeStep === 2 && (
            <div className="ps-form-grid">
              {/* Ticket Mínimo */}
              <div className="ps-input-group">
                <label className="ps-label" htmlFor="minTicket">
                  Ticket Mínimo (USD)<span className="ps-required">*</span>
                </label>
                <input
                  type="number"
                  id="minTicket"
                  name="minTicket"
                  value={investorData.minTicket}
                  onChange={handleInputChange}
                  placeholder="Ej: 25000"
                  className="ps-input"
                  required
                />
              </div>

              {/* Ticket Máximo */}
              <div className="ps-input-group">
                <label className="ps-label" htmlFor="maxTicket">
                  Ticket Máximo (USD)<span className="ps-required">*</span>
                </label>
                <input
                  type="number"
                  id="maxTicket"
                  name="maxTicket"
                  value={investorData.maxTicket}
                  onChange={handleInputChange}
                  placeholder="Ej: 500000"
                  className="ps-input"
                  required
                />
              </div>

              {/* País de Sede */}
              <div className="ps-input-group">
                <label className="ps-label">
                  País de sede / HQ<span className="ps-required">*</span>
                </label>
                <SearchableDropdown
                  options={countries}
                  selectedValue={investorData.hqCountry}
                  onSelect={(c) => {
                    setInvestorData(prev => ({
                      ...prev,
                      hqCountry: c.name
                    }));
                  }}
                  placeholder="Seleccione el país"
                  searchPlaceholder="Buscar país..."
                />
              </div>

              {/* Sectores de Interés */}
              <div className="ps-input-group">
                <label className="ps-label" htmlFor="selectedIndustry">
                  Sectores de Interés / Foco<span className="ps-required">*</span>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    id="selectedIndustry"
                    name="selectedIndustry"
                    value={investorData.selectedIndustry}
                    onChange={handleInputChange}
                    className="ps-select"
                    style={{ flex: 1 }}
                  >
                    <option value="">Seleccionar sector</option>
                    {mockIndustries.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddIndustry}
                    style={{
                      backgroundColor: '#00d177',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.8rem 1.8rem',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    Agregar
                  </button>
                </div>

                {/* Added Industries Tag List */}
                {investorData.addedIndustries.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
                    {investorData.addedIndustries.map((ind) => (
                      <span
                        key={ind}
                        style={{
                          background: '#8b00dd',
                          color: '#ffffff',
                          borderRadius: '20px',
                          padding: '0.4rem 1rem',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {ind}
                        <button
                          type="button"
                          onClick={() => handleRemoveIndustry(ind)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ffffff',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0 2px'
                          }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 3: TRAYECTORIA Y LOGOTIPO DE LA FIRMA */}
          {activeStep === 3 && (
            <div className="ps-form-grid">
              {/* Sitio web / Perfil */}
              <div className="ps-input-group">
                <label className="ps-label" htmlFor="website">
                  Sitio web de la firma<span className="ps-required">*</span>
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={investorData.website}
                  onChange={handleInputChange}
                  placeholder="https://firmacapital.com"
                  className="ps-input"
                  required
                />
              </div>

              {/* Logotipo de la firma */}
              <div className="ps-input-group ps-file-upload-container">
                <label className="ps-label">
                  Logotipo de la firma / Avatar<span className="ps-required">*</span>
                </label>
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setLogoFile(e.target.files[0]);
                    }
                  }}
                  accept="image/png, image/jpeg"
                  style={{ display: 'none' }}
                />
                <div className="ps-file-uploader-box">
                  <button
                    type="button"
                    className="ps-file-button"
                    onClick={() => logoInputRef.current.click()}
                  >
                    Seleccionar archivo
                  </button>
                  <span className="ps-file-name">
                    {logoFile ? logoFile.name : 'Ningún archivo seleccionado'}
                  </span>
                </div>
                <span className="ps-file-subtext">
                  Tamaño recomendado 800x800 px. - PNG/JPG
                </span>
              </div>

              {/* Tesis de Inversión */}
              <div className="ps-input-group" style={{ gridRow: 'span 3' }}>
                <label className="ps-label" htmlFor="thesis">
                  Tesis de inversión / Enfoque estratégico<span className="ps-required">*</span>
                </label>
                <textarea
                  id="thesis"
                  name="thesis"
                  value={investorData.thesis}
                  onChange={handleInputChange}
                  placeholder="Describe la tesis de inversión de tu firma, mercados preferidos, el valor agregado que entregan a las startups y el perfil de fundadores que buscan apoyar."
                  className="ps-textarea"
                  required
                />
              </div>
            </div>
          )}

          {/* Form Actions / Navigation buttons */}
          <div className="ps-form-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
            {activeStep > 1 && (
              <button
                type="button"
                className="ps-btn-prev"
                onClick={() => setActiveStep(prev => prev - 1)}
                style={{
                  background: '#eef1f6',
                  color: '#444444',
                  padding: '0.85rem 3rem',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#e2e7f0'}
                onMouseOut={(e) => e.currentTarget.style.background = '#eef1f6'}
              >
                Atrás
              </button>
            )}

            <button
              type="submit"
              className="ps-btn-next"
              style={{
                backgroundColor: '#8b00dd',
                color: '#ffffff',
                padding: '0.85rem 3.5rem',
                border: 'none',
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(139, 0, 221, 0.3)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7900c2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8b00dd'}
            >
              {activeStep === 3 ? 'Registrarse' : 'Siguiente'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default PublishInvestors;
