import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Services from '../../services/Services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

function RegisterForm({ onSwitch }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cedula, setCedula] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    const re = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(pass);
  };

  const handleCedulaSearch = async (val) => {
    setCedula(val);
    if (val.length >= 9) {
      setIsSearching(true);
      try {
        const response = await fetch(`https://api.hacienda.go.cr/fe/ae?identificacion=${val}`);
        if (response.ok) {
          const data = await response.json();
          if (data.nombre) {
            setNombre(data.nombre);
          }
        }
      } catch (error) {
        console.error("Error buscando cédula:", error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!nombre || !correo || !contrasena) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (!validatePassword(contrasena)) {
      alert("La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula y un número.");
      return;
    }

    const objUsuario = {
      nombre,
      correo,
      contrasena,
      cedula,
      rol: 'inversor',
      tesis: "",
      sectoresInteres: [],
      portafolio: []
    };

    try {
      await Services.postInversores(objUsuario);
      alert("¡Registro exitoso! Bienvenido.");
      onSwitch(); // Switch to login side
    } catch (error) {
      console.error("Error al registrarse:", error);
      alert("Hubo un error en el registro.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="auth-title">Crear Cuenta</h1>
      <div className="social-container">
        <a href="#"><FontAwesomeIcon icon={faGoogle} /></a>
        <a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
      </div>
      <span className="auth-subtitle text-muted">o usa tu email para registrarte</span>
      <input
        type="text"
        className="auth-input"
        placeholder="Cédula (9 o 10 dígitos)"
        value={cedula}
        onChange={(e) => handleCedulaSearch(e.target.value)}
        required
      />
      <input
        type="text"
        className="auth-input"
        placeholder={isSearching ? "Buscando nombre..." : "Nombre Completo"}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="email"
        className="auth-input"
        placeholder="Email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
      <input
        type="password"
        className="auth-input"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        required
      />
      <button type="submit" className="auth-button">Registrarse</button>

      <div className="d-lg-none mt-4">
        <p className="text-muted small">
          ¿Ya tienes cuenta? <span className="text-primary cursor-pointer" onClick={onSwitch}>Inicia Sesión</span>
        </p>
      </div>
    </form>
  );
}

export default RegisterForm;
