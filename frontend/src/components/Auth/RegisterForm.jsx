import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authBg from '../../assets/auth_bg.png';

const RegisterForm = () => {

  const navigate = useNavigate();

  // ─────────────────────────────────────────────
  // ESTADOS
  // ─────────────────────────────────────────────
  const [formData, setFormData] = useState({
    cedula: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'emprendedor'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ─────────────────────────────────────────────
  // HANDLE CHANGE
  // ─────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // ─────────────────────────────────────────────
  // HANDLE SUBMIT
  // ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'http://localhost:3007/api/usuarios/crear-usuario',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cedula: formData.cedula,
            nombre_hacienda: formData.name,
            email: formData.email,
            password_hash: formData.password,
            role_id: 2
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        throw new Error(
          data.message ||
          data.errors?.[0]?.msg ||
          'Error al crear usuario'
        );
      }

      setMessage('Usuario creado exitosamente');

      // Limpiar formulario
      setFormData({
        cedula: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'emprendedor'
      });

      // Redireccionar
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">

      {/* PANEL IZQUIERDO */}
      <div className="auth-form-panel">
        <div className="auth-content">

          <div className="auth-role-badge">
            Rol: Emprendedor
          </div>

          <h1 className="auth-title">
            Crear Cuenta
          </h1>

          <p className="auth-subtitle">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="auth-link">
              Inicia sesión
            </Link>
          </p>

          {/* MENSAJE ÉXITO */}
          {message && (
            <div
              style={{
                backgroundColor: '#d4edda',
                color: '#155724',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '15px'
              }}
            >
              {message}
            </div>
          )}

          {/* MENSAJE ERROR */}
          {error && (
            <div
              style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '15px'
              }}
            >
              {error}
            </div>
          )}

          {/* FORMULARIO */}
          <form className="auth-form" onSubmit={handleSubmit}>

            {/* CÉDULA */}
            <div className="input-group">
              <label htmlFor="cedula">
                Cédula
              </label>

              <input
                type="text"
                id="cedula"
                placeholder="Ingrese su cédula"
                required
                value={formData.cedula}
                onChange={handleChange}
              />
            </div>

            {/* NOMBRE */}
            <div className="input-group">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                type="text"
                id="name"
                placeholder="Your full name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                type="email"
                id="email"
                placeholder="example@gmail.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* PASSWORDS */}
            <div className="input-row">

              <div className="input-group">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  placeholder="@#*%"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">
                  Confirm
                </label>

                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="@#*%"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* BOTÓN */}
            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading
                ? 'Creando cuenta...'
                : 'Create account'}
            </button>

          </form>

        </div>
      </div>

      {/* PANEL DERECHO */}
      <div className="auth-image-panel">

        <img
          src={authBg}
          alt="Cybersecurity"
          className="auth-bg-image"
        />

        <div className="auth-image-overlay" />

      </div>

    </div>
  );
};

export default RegisterForm;