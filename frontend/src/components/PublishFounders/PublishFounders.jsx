import React, { useState, useRef, useEffect } from 'react';
import '../../styles/PublishGeneral.css';

// --- LIST OF OPTIONS ---
const mockStartups = [
  'AgroTech CR',
  'BioSustain Technologies',
  'Fintech Flow',
  'HealthQuest',
  'EduLearn Solutions',
  'EcoEnergy Labs',
  'Quantum AI',
  'SaaS Central'
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
  { name: 'Irlanda', code: '+353', flagUrl: 'https://flagcdn.com/w20/ie.png' },
  { name: 'Países Bajos', code: '+31', flagUrl: 'https://flagcdn.com/w20/nl.png' },
  { name: 'Bélgica', code: '+32', flagUrl: 'https://flagcdn.com/w20/be.png' },
  { name: 'Suiza', code: '+41', flagUrl: 'https://flagcdn.com/w20/ch.png' },
  { name: 'Suecia', code: '+46', flagUrl: 'https://flagcdn.com/w20/se.png' },
  { name: 'Noruega', code: '+47', flagUrl: 'https://flagcdn.com/w20/no.png' },
  { name: 'Dinamarca', code: '+45', flagUrl: 'https://flagcdn.com/w20/dk.png' },
  { name: 'Finlandia', code: '+358', flagUrl: 'https://flagcdn.com/w20/fi.png' },
  { name: 'Polonia', code: '+48', flagUrl: 'https://flagcdn.com/w20/pl.png' },
  { name: 'Rusia', code: '+7', flagUrl: 'https://flagcdn.com/w20/ru.png' },
  { name: 'Ucrania', code: '+380', flagUrl: 'https://flagcdn.com/w20/ua.png' },
  { name: 'Turquía', code: '+90', flagUrl: 'https://flagcdn.com/w20/tr.png' },
  { name: 'China', code: '+86', flagUrl: 'https://flagcdn.com/w20/cn.png' },
  { name: 'Japón', code: '+81', flagUrl: 'https://flagcdn.com/w20/jp.png' },
  { name: 'Corea del Sur', code: '+82', flagUrl: 'https://flagcdn.com/w20/kr.png' },
  { name: 'India', code: '+91', flagUrl: 'https://flagcdn.com/w20/in.png' },
  { name: 'Pakistán', code: '+92', flagUrl: 'https://flagcdn.com/w20/pk.png' },
  { name: 'Indonesia', code: '+62', flagUrl: 'https://flagcdn.com/w20/id.png' },
  { name: 'Tailandia', code: '+66', flagUrl: 'https://flagcdn.com/w20/th.png' },
  { name: 'Vietnam', code: '+84', flagUrl: 'https://flagcdn.com/w20/vn.png' },
  { name: 'Filipinas', code: '+63', flagUrl: 'https://flagcdn.com/w20/ph.png' },
  { name: 'Singapur', code: '+65', flagUrl: 'https://flagcdn.com/w20/sg.png' },
  { name: 'Malasia', code: '+60', flagUrl: 'https://flagcdn.com/w20/my.png' },
  { name: 'Australia', code: '+61', flagUrl: 'https://flagcdn.com/w20/au.png' },
  { name: 'Nueva Zelanda', code: '+64', flagUrl: 'https://flagcdn.com/w20/nz.png' },
  { name: 'Sudáfrica', code: '+27', flagUrl: 'https://flagcdn.com/w20/za.png' },
  { name: 'Egipto', code: '+20', flagUrl: 'https://flagcdn.com/w20/eg.png' },
  { name: 'Nigeria', code: '+234', flagUrl: 'https://flagcdn.com/w20/ng.png' },
  { name: 'Marruecos', code: '+212', flagUrl: 'https://flagcdn.com/w20/ma.png' },
  { name: 'Arabia Saudita', code: '+966', flagUrl: 'https://flagcdn.com/w20/sa.png' },
  { name: 'Emiratos Árabes Unidos', code: '+971', flagUrl: 'https://flagcdn.com/w20/ae.png' },
  { name: 'Israel', code: '+972', flagUrl: 'https://flagcdn.com/w20/il.png' },
];

// --- SEARCHABLE DROPDOWN COMPONENT ---
const SearchableDropdown = ({
  options,
  selectedValue,
  onSelect,
  placeholder = "Buscar...",
  searchPlaceholder = "Buscar...",
  isPhoneDial = false
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
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (isPhoneDial && c.code.includes(search))
  );

  const currentObj = isPhoneDial
    ? options.find(c => c.code === selectedValue) || options[0]
    : options.find(c => c.name === selectedValue) || options[0];

  return (
    <div className="ps-dropdown-container" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {isPhoneDial ? (
        <button
          type="button"
          className="ps-phone-dropdown-trigger"
          onClick={() => {
            setIsOpen(!isOpen);
            setSearch('');
          }}
          style={{
            position: 'absolute',
            left: '6px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '85px',
            height: '32px',
            background: '#f3f5f8',
            border: '1px solid #dddddd',
            borderRadius: '4px',
            padding: '0 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: '#444444',
            zIndex: 10,
            transition: 'all 0.2s',
            boxSizing: 'border-box',
          }}
        >
          <img src={currentObj.flagUrl} alt={currentObj.name} style={{ width: '18px', height: '12px', objectFit: 'cover', borderRadius: '2px' }} />
          <span>{selectedValue}</span>
          <span style={{ fontSize: '0.65rem', color: '#888888', marginLeft: '2px' }}>▼</span>
        </button>
      ) : (
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
      )}

      {isOpen && (
        <div
          className="ps-dropdown-menu"
          style={isPhoneDial ? { width: '280px', left: '0', top: '105%', zIndex: 1000 } : { width: '100%', left: '0', top: '105%', zIndex: 1000 }}
        >
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
                  className={`ps-dropdown-option ${
                    isPhoneDial
                      ? (selectedValue === c.code ? 'selected' : '')
                      : (selectedValue === c.name ? 'selected' : '')
                  }`}
                  onClick={() => {
                    onSelect(c);
                    setIsOpen(false);
                  }}
                  style={isPhoneDial ? { justifyContent: 'space-between', display: 'flex', alignItems: 'center' } : {}}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={c.flagUrl} alt={c.name} style={{ width: '18px', height: '12px', objectFit: 'cover', borderRadius: '2px' }} />
                    <span>{c.name}</span>
                  </div>
                  {isPhoneDial && <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{c.code}</span>}
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

// --- PUBLISH FOUNDERS COMPONENT ---
const PublishFounders = ({ activeTab, onTabChange }) => {
  const [activeStep, setActiveStep] = useState(1);

  // Form Fields State
  const [founderData, setFounderData] = useState({
    email: '',
    fullName: '',
    role: '',
    selectedStartup: '',
    addedStartups: [],
    country: 'Costa Rica',
    phoneCode: '+506',
    phoneNumber: '',
    linkedin: '',
    bio: '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const avatarInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFounderData(prev => ({ ...prev, [name]: value }));
  };

  // Add startup to selected list
  const handleAddStartup = () => {
    const { selectedStartup, addedStartups } = founderData;
    if (!selectedStartup) {
      alert('Por favor, selecciona una startup de la lista.');
      return;
    }
    if (addedStartups.includes(selectedStartup)) {
      alert('Esta startup ya está agregada a tu lista.');
      return;
    }
    setFounderData(prev => ({
      ...prev,
      addedStartups: [...prev.addedStartups, selectedStartup],
      selectedStartup: ''
    }));
  };

  // Remove startup from list
  const handleRemoveStartup = (startupToRemove) => {
    setFounderData(prev => ({
      ...prev,
      addedStartups: prev.addedStartups.filter(item => item !== startupToRemove)
    }));
  };

  // Step Navigation Validation
  const handleNextStep = (e) => {
    e.preventDefault();
    if (activeStep === 1) {
      // Validate Step 1
      if (!founderData.email) {
        alert('Por favor, ingresa tu correo electrónico corporativo.');
        return;
      }
      if (founderData.addedStartups.length === 0) {
        alert('Por favor, selecciona al menos una startup y haz clic en "Agregar".');
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      // Validate Step 2
      if (!founderData.fullName || !founderData.role || !founderData.phoneNumber) {
        alert('Por favor, rellene todos los campos obligatorios (*).');
        return;
      }
      setActiveStep(3);
    } else {
      // Validate Step 3
      if (!founderData.bio || !avatarFile) {
        alert('Por favor, rellene su biografía y cargue su fotografía de perfil.');
        return;
      }
      console.log('Final Founder Registry Submitted:', {
        ...founderData,
        avatar: avatarFile
      });
      alert('👑 ¡Perfil de Founder registrado exitosamente en Nexus Cobalt!');
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

        {/* ─── 3. FORMULARIO DE REGISTRO DE FOUNDER ─── */}
        <form onSubmit={handleNextStep} className="ps-form-body" style={{ marginTop: '2rem' }}>
          <h2 className="ps-form-title">
            {activeStep === 1 && 'Información General'}
            {activeStep === 2 && 'Datos Profesionales y Contacto'}
            {activeStep === 3 && 'Biografía y Perfil Visual'}
          </h2>

          {/* PASO 1: INFORMACIÓN GENERAL (EXACTLY MATCHING MOCKUP IMAGE) */}
          {activeStep === 1 && (
            <div className="ps-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', maxWidth: '800px', margin: '0 auto' }}>
              {/* Tu correo electrónico */}
              <div className="ps-input-group">
                <label className="ps-label" htmlFor="email">
                  Tu correo electrónico<span className="ps-required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={founderData.email}
                  onChange={handleInputChange}
                  placeholder="ejemplo@correo.com"
                  className="ps-input"
                  required
                  style={{ borderRadius: '8px', border: '1px solid #cccccc', padding: '0.8rem 1rem' }}
                />
              </div>

              {/* Selecciona tu Startup */}
              <div className="ps-input-group">
                <label className="ps-label">
                  Selecciona tu Startup<span className="ps-required">*</span>
                </label>
                <div className="pf-startup-row" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', width: '100%' }}>
                  <div className="pf-select-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1', minWidth: '280px' }}>
                    <select
                      name="selectedStartup"
                      value={founderData.selectedStartup}
                      onChange={handleInputChange}
                      className="ps-select"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #cccccc',
                        padding: '0.8rem 1rem',
                        background: '#ffffff',
                        cursor: 'pointer',
                        flex: '1'
                      }}
                    >
                      <option value="">Startups registradas</option>
                      {mockStartups.map(item => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="pf-btn-add"
                      onClick={handleAddStartup}
                      style={{
                        backgroundColor: '#00d177',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.8rem 2rem',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Agregar
                    </button>
                  </div>

                  <button
                    type="button"
                    className="pf-btn-register-startup"
                    onClick={() => onTabChange('startup')}
                    style={{
                      backgroundColor: '#cccccc',
                      color: '#333333',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.8rem 1.8rem',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      marginLeft: 'auto'
                    }}
                  >
                    Registrar mi Startup
                  </button>
                </div>

                {/* Added Startups Tag List */}
                {founderData.addedStartups.length > 0 && (
                  <div className="pf-tags-list" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
                    {founderData.addedStartups.map((st) => (
                      <span
                        key={st}
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
                        {st}
                        <button
                          type="button"
                          onClick={() => handleRemoveStartup(st)}
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

          {/* PASO 2: DATOS PROFESIONALES Y CONTACTO */}
          {activeStep === 2 && (
            <div className="ps-form-grid">
              {/* Nombre completo */}
              <div className="ps-input-group">
                <label className="ps-label" htmlFor="fullName">
                  Nombre completo<span className="ps-required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={founderData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nombre y Apellidos"
                  className="ps-input"
                  required
                />
              </div>

              {/* Cargo / Rol */}
              <div className="ps-input-group">
                <label className="ps-label" htmlFor="role">
                  Cargo / Rol en la empresa<span className="ps-required">*</span>
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={founderData.role}
                  onChange={handleInputChange}
                  placeholder="CEO, CTO, Co-Founder, Socio..."
                  className="ps-input"
                  required
                />
              </div>

              {/* País de residencia */}
              <div className="ps-input-group">
                <label className="ps-label">
                  País de residencia<span className="ps-required">*</span>
                </label>
                <SearchableDropdown
                  options={countries}
                  selectedValue={founderData.country}
                  onSelect={(c) => {
                    setFounderData(prev => ({
                      ...prev,
                      country: c.name,
                      phoneCode: c.code
                    }));
                  }}
                  placeholder="Seleccione el país"
                  searchPlaceholder="Buscar país..."
                />
              </div>

              {/* Teléfono de contacto */}
              <div className="ps-input-group">
                <label className="ps-label" htmlFor="phoneNumber">
                  Teléfono de contacto<span className="ps-required">*</span>
                </label>
                <div className="ps-flag-select-wrapper" style={{ position: 'relative' }}>
                  <SearchableDropdown
                    options={countries}
                    selectedValue={founderData.phoneCode}
                    onSelect={(c) => {
                      setFounderData(prev => ({ ...prev, phoneCode: c.code }));
                    }}
                    isPhoneDial={true}
                    searchPlaceholder="Buscar prefijo..."
                  />
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={founderData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="9 1234 5678"
                    className="ps-input ps-input-with-flag"
                    style={{ paddingLeft: '96px' }}
                    required
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div className="ps-input-group">
                <label className="ps-label" htmlFor="linkedin">
                  Perfil de LinkedIn
                </label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={founderData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/usuario"
                  className="ps-input"
                />
              </div>
            </div>
          )}

          {/* PASO 3: BIOGRAFÍA Y FOTO DE PERFIL */}
          {activeStep === 3 && (
            <div className="ps-form-grid">
              {/* Fotografía de perfil */}
              <div className="ps-input-group ps-file-upload-container">
                <label className="ps-label">
                  Fotografía de perfil<span className="ps-required">*</span>
                </label>
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setAvatarFile(e.target.files[0]);
                    }
                  }}
                  accept="image/png, image/jpeg"
                  style={{ display: 'none' }}
                />
                <div className="ps-file-uploader-box">
                  <button
                    type="button"
                    className="ps-file-button"
                    onClick={() => avatarInputRef.current.click()}
                  >
                    Seleccionar archivo
                  </button>
                  <span className="ps-file-name">
                    {avatarFile ? avatarFile.name : 'Ningún archivo seleccionado'}
                  </span>
                </div>
                <span className="ps-file-subtext">
                  Tamaño recomendado 400x400 px. - PNG/JPG
                </span>
              </div>

              {/* Biografía / Trayectoria */}
              <div className="ps-input-group" style={{ gridRow: 'span 3' }}>
                <label className="ps-label" htmlFor="bio">
                  Biografía / Trayectoria profesional<span className="ps-required">*</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={founderData.bio}
                  onChange={handleInputChange}
                  placeholder="Describe tu rol actual, metas del startup, experiencia previa u otros logros en la industria."
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

export default PublishFounders;
