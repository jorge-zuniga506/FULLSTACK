import React, { useState, useRef, useEffect } from 'react';
import '../../styles/PublishGeneral.css';
import PublishFounders from '../PublishFounders/PublishFounders';
import PublishInvestors from '../PublishInvestors/PublishInvestors';

const PublishStartup = ({ isSubcomponent = false }) => {
  // Tabs state - "Registro Startup" is active
  const [activeTab, setActiveTab] = useState('startup'); // 'startup', 'founder', 'investor'

  // Steps state - Step 1 is active
  const [activeStep, setActiveStep] = useState(1);

  // Form Fields State
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    industry: '',
    foundationCountry: 'Chile',
    presentCountries: '',
    foundationYear: '',
    website: '',
    phoneCode: '+56',
    phoneNumber: '',
    linkedin: '',
    description: '',
  });

  const [logoFile, setLogoFile] = useState(null);
  const fileInputRef = useRef(null);

  // Custom Searchable Dropdowns state
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryDropdownRef = useRef(null);

  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState('');
  const phoneDropdownRef = useRef(null);

  // Handle click outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryOpen(false);
      }
      if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(event.target)) {
        setIsPhoneOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Lists of options
  const industries = [
    'Agrotech',
    'Fintech',
    'Healthtech / eHealth',
    'Edtech',
    'E-commerce / Retailtech',
    'Biotech / Deeptech',
    'Inteligencia Artificial / Software',
    'Cleantech / Energía',
    'Logística / Proptech',
    'Otro'
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

  // Handle inputs changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle country changes (which updates foundational country flag and phone prefix)
  const handleCountryChange = (e) => {
    const selectedCountryName = e.target.value;
    const matchedCountry = countries.find(c => c.name === selectedCountryName);

    setFormData((prev) => ({
      ...prev,
      foundationCountry: selectedCountryName,
      phoneCode: matchedCountry ? matchedCountry.code : prev.phoneCode
    }));
  };

  // Handle custom file upload triggers
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Form Submission / Next step handler
  const handleNextStep = (e) => {
    e.preventDefault();

    // Quick frontend validation for step 1
    const { email, name, industry, foundationCountry, presentCountries, foundationYear, website, phoneNumber, description } = formData;
    if (!email || !name || !industry || !foundationCountry || !presentCountries || !foundationYear || !website || !phoneNumber || !description || !logoFile) {
      alert('Por favor, rellene todos los campos obligatorios (*) y cargue el logotipo.');
      return;
    }

    console.log('Sending Step 1 Data:', { ...formData, logo: logoFile });
    alert('¡Información de Startup validada con éxito! Pasando al paso 2...');
  };

  // Find the selected country for flag rendering
  const currentCountryObj = countries.find(c => c.name === formData.foundationCountry) || countries[0];
  const currentPhoneCountryObj = countries.find(c => c.code === formData.phoneCode) || countries[0];

  // Filtering for custom searchable dropdowns
  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredPhoneCountries = countries.filter(c =>
    c.name.toLowerCase().includes(phoneSearch.toLowerCase()) ||
    c.code.includes(phoneSearch)
  );

  return (
    <>
      {!isSubcomponent && activeTab === 'founder' ? (
        <PublishFounders activeTab={activeTab} onTabChange={setActiveTab} />
      ) : !isSubcomponent && activeTab === 'investor' ? (
        <PublishInvestors activeTab={activeTab} onTabChange={setActiveTab} />
      ) : (
        <div className="publish-startup-page" style={isSubcomponent ? { padding: 0 } : {}}>
          <div className="publish-startup-container" style={isSubcomponent ? { boxShadow: 'none', background: 'transparent', padding: 0 } : {}}>

            {/* ─── 1. TABS SUPERIORES ─── */}
            {!isSubcomponent && (
              <div className="ps-tabs">
                <button
                  type="button"
                  className={`ps-tab ${activeTab === 'startup' ? 'active' : 'inactive'}`}
                  onClick={() => setActiveTab('startup')}
                >
                  Registro Startup
                </button>
                <button
                  type="button"
                  className={`ps-tab ${activeTab === 'founder' ? 'active' : 'inactive'}`}
                  onClick={() => setActiveTab('founder')}
                >
                  Registro Founder
                </button>
                <button
                  type="button"
                  className={`ps-tab ${activeTab === 'investor' ? 'active' : 'inactive'}`}
                  onClick={() => setActiveTab('investor')}
                >
                  Registro Inversionista
                </button>
              </div>
            )}

            {(isSubcomponent || activeTab === 'startup') && (
              <>
                {/* ─── 2. TRACKER DE PASOS (STEP PROGRESS) ─── */}
                <div className="ps-steps-tracker">
                  {/* Background gray line */}
                  <div className="ps-step-line-bg"></div>
                  {/* Active lime green line */}
                  <div className="ps-step-line-active"></div>

                  <div className="ps-step-nodes">
                    <div className="ps-step-node active">1</div>
                    <div className="ps-step-node inactive">2</div>
                    <div className="ps-step-node inactive">3</div>
                  </div>
                </div>

                {/* ─── 3. FORMULARIO DE REGISTRO DE STARTUP ─── */}
                <form onSubmit={handleNextStep} className="ps-form-body">
                  <h2 className="ps-form-title">Información Startup</h2>

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
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Correo de la startup"
                        className="ps-input"
                        required
                      />
                    </div>

                    {/* Nombre de Startup */}
                    <div className="ps-input-group">
                      <label className="ps-label" htmlFor="name">
                        Nombre de Startup<span className="ps-required">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nombre de la startup"
                        className="ps-input"
                        required
                      />
                    </div>

                    {/* Industria */}
                    <div className="ps-input-group">
                      <label className="ps-label" htmlFor="industry">
                        Industria<span className="ps-required">*</span>
                      </label>
                      <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="ps-select"
                        required
                      >
                        <option value="" disabled>Seleccione la industria</option>
                        {industries.map((ind) => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    {/* País de fundación */}
                    <div className="ps-input-group">
                      <label className="ps-label" htmlFor="foundationCountry">
                        País de fundación<span className="ps-required">*</span>
                      </label>
                      <div className="ps-dropdown-container" ref={countryDropdownRef}>
                        <button
                          type="button"
                          className={`ps-dropdown-trigger ${isCountryOpen ? 'open' : ''}`}
                          onClick={() => {
                            setIsCountryOpen(!isCountryOpen);
                            setCountrySearch('');
                          }}
                        >
                          <div className="ps-dropdown-trigger-content">
                            <img src={currentCountryObj.flagUrl} alt={currentCountryObj.name} style={{ width: '18px', height: '12px', objectFit: 'cover', borderRadius: '2px' }} />
                            <span>{currentCountryObj.name}</span>
                          </div>
                          <span className="ps-dropdown-caret"></span>
                        </button>

                        {isCountryOpen && (
                          <div className="ps-dropdown-menu">
                            <div className="ps-dropdown-search-wrapper">
                              <span className="ps-dropdown-search-icon">🔍</span>
                              <input
                                type="text"
                                className="ps-dropdown-search-input"
                                placeholder="Buscar país..."
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                autoFocus
                              />
                            </div>
                            <ul className="ps-dropdown-options-list">
                              {filteredCountries.length > 0 ? (
                                filteredCountries.map((c) => (
                                  <li
                                    key={c.name}
                                    className={`ps-dropdown-option ${formData.foundationCountry === c.name ? 'selected' : ''}`}
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        foundationCountry: c.name,
                                        phoneCode: c.code,
                                      }));
                                      setIsCountryOpen(false);
                                    }}
                                  >
                                    <img src={c.flagUrl} alt={c.name} style={{ width: '18px', height: '12px', objectFit: 'cover', borderRadius: '2px' }} />
                                    <span>{c.name}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="ps-dropdown-no-results">No se encontraron países</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Países presentes */}
                    <div className="ps-input-group">
                      <label className="ps-label" htmlFor="presentCountries">
                        Países presentes<span className="ps-required">*</span>
                      </label>
                      <input
                        type="text"
                        id="presentCountries"
                        name="presentCountries"
                        value={formData.presentCountries}
                        onChange={handleChange}
                        placeholder="Seleccione uno o varios paises"
                        className="ps-input"
                        required
                      />
                    </div>

                    {/* Año de fundación */}
                    <div className="ps-input-group">
                      <label className="ps-label" htmlFor="foundationYear">
                        Año de fundación<span className="ps-required">*</span>
                      </label>
                      <input
                        type="number"
                        id="foundationYear"
                        name="foundationYear"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={formData.foundationYear}
                        onChange={handleChange}
                        placeholder="Año de fundación (ej: 2026)"
                        className="ps-input"
                        required
                      />
                    </div>

                    {/* Sitio web */}
                    <div className="ps-input-group">
                      <label className="ps-label" htmlFor="website">
                        Sitio web<span className="ps-required">*</span>
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://ejemplo.com"
                        className="ps-input"
                        required
                      />
                    </div>

                    {/* Teléfono de contacto */}
                    <div className="ps-input-group">
                      <label className="ps-label" htmlFor="phoneNumber">
                        Teléfono de contacto<span className="ps-required">*</span>
                      </label>
                      <div className="ps-flag-select-wrapper" ref={phoneDropdownRef} style={{ position: 'relative' }}>
                        <button
                          type="button"
                          className="ps-phone-dropdown-trigger"
                          onClick={() => {
                            setIsPhoneOpen(!isPhoneOpen);
                            setPhoneSearch('');
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
                          onMouseOver={(e) => e.currentTarget.style.background = '#eef1f6'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#f3f5f8'}
                        >
                          <img src={currentPhoneCountryObj.flagUrl} alt={currentPhoneCountryObj.name} style={{ width: '18px', height: '12px', objectFit: 'cover', borderRadius: '2px' }} />
                          <span>{formData.phoneCode}</span>
                          <span style={{ fontSize: '0.65rem', color: '#888888', marginLeft: '2px' }}>▼</span>
                        </button>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="9 1234 5678"
                          className="ps-input ps-input-with-flag"
                          style={{ paddingLeft: '96px' }}
                          required
                        />

                        {isPhoneOpen && (
                          <div className="ps-dropdown-menu" style={{ width: '280px', left: '0', top: '105%' }}>
                            <div className="ps-dropdown-search-wrapper">
                              <span className="ps-dropdown-search-icon">🔍</span>
                              <input
                                type="text"
                                className="ps-dropdown-search-input"
                                placeholder="Buscar por país o prefijo..."
                                value={phoneSearch}
                                onChange={(e) => setPhoneSearch(e.target.value)}
                                autoFocus
                              />
                            </div>
                            <ul className="ps-dropdown-options-list">
                              {filteredPhoneCountries.length > 0 ? (
                                filteredPhoneCountries.map((c) => (
                                  <li
                                    key={c.name}
                                    className={`ps-dropdown-option ${formData.phoneCode === c.code && formData.foundationCountry === c.name ? 'selected' : ''}`}
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        phoneCode: c.code,
                                      }));
                                      setIsPhoneOpen(false);
                                    }}
                                    style={{ justifyContent: 'space-between' }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <img src={c.flagUrl} alt={c.name} style={{ width: '18px', height: '12px', objectFit: 'cover', borderRadius: '2px' }} />
                                      <span>{c.name}</span>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{c.code}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="ps-dropdown-no-results">No se encontraron resultados</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div className="ps-input-group">
                      <label className="ps-label" htmlFor="linkedin">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="Link del perfil de la Startup"
                        className="ps-input"
                      />
                    </div>

                    {/* Descripción de la startup (Spans the height of inputs in column 2) */}
                    <div className="ps-input-group" style={{ gridRow: 'span 3' }}>
                      <label className="ps-label" htmlFor="description">
                        Descripción de la startup<span className="ps-required">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe tu startup (cuéntanos qué hace tu startup, un poco de su historia, el mercado al que apuntan, sus objetivos, planificación estratégica, etc)"
                        className="ps-textarea"
                        required
                      />
                    </div>

                    {/* Logotipo */}
                    <div className="ps-input-group ps-file-upload-container">
                      <label className="ps-label">
                        Logotipo<span className="ps-required">*</span>
                      </label>
                      <input
                        type="file"
                        id="logo"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg"
                        style={{ display: 'none' }}
                        required
                      />
                      <div className="ps-file-uploader-box">
                        <button
                          type="button"
                          className="ps-file-button"
                          onClick={triggerFileInput}
                        >
                          Seleccionar archivo
                        </button>
                        <span className="ps-file-name">
                          {logoFile ? logoFile.name : 'Ningún archivo seleccionado'}
                        </span>
                      </div>
                      <span className="ps-file-subtext">
                        Tamaño recomendado 1200x800 px. - PNG/JPG
                      </span>
                    </div>

                  </div>

                  {/* Siguiente Button */}
                  <div className="ps-form-actions">
                    <button type="submit" className="ps-btn-next">
                      Siguiente
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Investor placeholder removed - rendered natively via component */}

          </div>
        </div>
      )}
    </>
  );
};

export default PublishStartup;
