import React, { useState } from 'react';
import './AboutContact.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3007';

const extractErrorMessage = (payload) => {
  if (!payload) return '';
  if (typeof payload.message === 'string' && payload.message.trim()) return payload.message;
  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    return payload.errors[0].msg || payload.errors[0].message || '';
  }
  if (payload.data && typeof payload.data.message === 'string') return payload.data.message;
  return '';
};
const AboutContact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateField = (name, value) => {
    let error = '';
    if (!value.trim()) {
      error = 'Este campo es obligatorio';
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = 'Introduce un correo electrónico válido';
      }
    } else if (name === 'mensaje' && value.trim().length < 10) {
      error = 'El mensaje debe tener al menos 10 caracteres';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const endpoints = [
        `${API_BASE_URL}/api/communication/contacto-publico`,
        `${API_BASE_URL}/api/v1/communication/contacto-publico`
      ];

      let sent = false;
      let lastError = null;

      for (const endpoint of endpoints) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const raw = await response.json().catch(() => ({}));
        const payload = raw?.data || raw;

        if (response.ok) {
          sent = true;
          break;
        }

        if (response.status === 404) {
          continue;
        }

        lastError = new Error(
          extractErrorMessage(payload) ||
          extractErrorMessage(raw) ||
          'Error al enviar el mensaje. Intente de nuevo mas tarde.'
        );
        break;
      }

      if (!sent) {
        throw (lastError || new Error('No se encontro el endpoint del formulario de contacto en el backend.'));
      }

      setIsSuccess(true);
      setErrors({});
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'No se pudo establecer conexion con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="about-contact-section" id="contact">
      <div className="about-contact-glow-bg"></div>
      <div className="about-contact-container">
        
        {/* Left Side: Contact Information & Socials */}
        <div className="about-contact-info">
          <span className="contact-badge">✉️ CONECTA CON NOSOTROS</span>
          <h2 className="contact-title">¿Tienes alguna pregunta o propuesta?</h2>
          <p className="contact-subtitle">
            Estamos aquí para ayudarte a impulsar tu startup o conectarte con los mejores inversionistas de América Latina. 
            Escríbenos y nuestro equipo te atenderá a la brevedad.
          </p>

          <div className="contact-methods">
            <div className="contact-method-item">
              <div className="contact-method-icon">📍</div>
              <div className="contact-method-content">
                <h4>Nuestra Oficina</h4>
                <p>Tech District, Ciudad de México, MX</p>
              </div>
            </div>

            <div className="contact-method-item">
              <div className="contact-method-icon">📧</div>
              <div className="contact-method-content">
                <h4>Correo Electrónico</h4>
                <a href="mailto:soporte@nexuscobalt.com">soporte@nexuscobalt.com</a>
              </div>
            </div>

            <div className="contact-method-item">
              <div className="contact-method-icon">🌐</div>
              <div className="contact-method-content">
                <h4>Comunidad Global</h4>
                <p>Canal oficial de Discord y Telegram activo 24/7</p>
              </div>
            </div>
          </div>

          <div className="contact-socials-wrapper">
            <h4>Síguenos en redes</h4>
            <div className="contact-social-icons">
              <a href="#twitter" className="social-icon-btn">𝕏</a>
              <a href="#linkedin" className="social-icon-btn">in</a>
              <a href="#github" className="social-icon-btn">git</a>
              <a href="#discord" className="social-icon-btn">👾</a>
            </div>
          </div>
        </div>

        {/* Right Side: Glassmorphic Interactive Form */}
        <div className="about-contact-form-wrapper">
          <div className="about-contact-card">
            
            {isSuccess ? (
              <div className="contact-success-state">
                <div className="success-icon-animation">
                  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                <h3>¡Mensaje enviado con éxito!</h3>
                <p>
                  Gracias por comunicarte con Nexus Cobalt. Hemos registrado tu consulta, 
                  nuestros asesores (y J.A.R.V.I.S.) la procesarán a la brevedad.
                </p>
                <button 
                  className="contact-success-btn" 
                  onClick={() => setIsSuccess(false)}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <>
                <div className="contact-form-header">
                  <h3>Enviar un Mensaje</h3>
                  <p>Completa el formulario a continuación para ponerte en contacto.</p>
                </div>

                {submitError && (
                  <div className="contact-submit-error">
                    <span className="error-icon">⚠️</span>
                    <p>{submitError}</p>
                  </div>
                )}

                <form className="contact-main-form" onSubmit={handleSubmit} noValidate>
                  
                  {/* Nombre Input */}
                  <div className={`form-group-custom ${errors.nombre ? 'has-error' : ''}`}>
                    <label htmlFor="nombre">Nombre Completo</label>
                    <div className="input-with-icon">
                      <span className="input-icon">👤</span>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        placeholder="Ej. Juan Pérez"
                        value={formData.nombre}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                    {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                  </div>

                  {/* Email Input */}
                  <div className={`form-group-custom ${errors.email ? 'has-error' : ''}`}>
                    <label htmlFor="email">Correo Electrónico</label>
                    <div className="input-with-icon">
                      <span className="input-icon">✉️</span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="juan@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  {/* Asunto Input (Styled custom select or text input) */}
                  <div className={`form-group-custom ${errors.asunto ? 'has-error' : ''}`}>
                    <label htmlFor="asunto">Asunto</label>
                    <div className="input-with-icon">
                      <span className="input-icon">📌</span>
                      <select
                        id="asunto"
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="" disabled>Selecciona el motivo de tu contacto</option>
                        <option value="Soporte Técnico">Soporte Técnico</option>
                        <option value="Registro de Startup">Registro de Startup / Aceleradora</option>
                        <option value="Propuesta de Inversión">Oportunidad de Inversión</option>
                        <option value="Alianza Comercial">Alianza Comercial</option>
                        <option value="Prensa o Medios">Prensa o Medios</option>
                        <option value="Otro">Otro Motivo</option>
                      </select>
                    </div>
                    {errors.asunto && <span className="error-message">{errors.asunto}</span>}
                  </div>

                  {/* Mensaje Textarea */}
                  <div className={`form-group-custom ${errors.mensaje ? 'has-error' : ''}`}>
                    <label htmlFor="mensaje">Mensaje</label>
                    <div className="textarea-with-icon">
                      <span className="input-icon textarea-icon">💬</span>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        rows="4"
                        placeholder="Escribe los detalles de tu consulta aquí..."
                        value={formData.mensaje}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      ></textarea>
                    </div>
                    {errors.mensaje && <span className="error-message">{errors.mensaje}</span>}
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className={`contact-submit-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="btn-loader">
                        <span className="loader-dot"></span>
                        <span className="loader-dot"></span>
                        <span className="loader-dot"></span>
                      </span>
                    ) : (
                      <>
                        <span>Enviar Mensaje</span>
                        <span className="btn-arrow">⚡</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutContact;
