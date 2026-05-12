import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import Services from '../../services/Services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

function LoginForm({ onSwitch }) {
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [contrasenaUsuario, setContrasenaUsuario] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    if (e) e.preventDefault();
    if (!correoUsuario || !contrasenaUsuario) {
      alert("Por favor ingrese todos los campos");
      return;
    }

    try {
      const administradores = (await Services.getAdministradores()) || [];
      const startups = (await Services.getStartups()) || [];
      const inversores = (await Services.getInversores()) || [];
      const aceleradoras = (await Services.getAceleradoras()) || [];
      
      const findUser = (list) => list.find(u => u.correo === correoUsuario && u.contrasena === contrasenaUsuario);

      const admin = findUser(administradores);
      const startup = findUser(startups);
      const inversor = findUser(inversores);
      const aceleradora = findUser(aceleradoras);

      if (admin) {
        localStorage.setItem("usuarioLogueado", JSON.stringify(admin));
        localStorage.setItem("token", "token");
        navigate("/DashboardAdmin");
      } else if (startup) {
        localStorage.setItem("usuarioLogueado", JSON.stringify(startup));
        navigate("/PerfilPrivadoStartup");
      } else if (inversor) {
        localStorage.setItem("usuarioLogueado", JSON.stringify(inversor));
        navigate("/Mapa");
      } else if (aceleradora) {
        localStorage.setItem("usuarioLogueado", JSON.stringify(aceleradora));
        navigate("/PerfilPrivadoAceleradora");
      } else {
        alert("Credenciales incorrectas o usuario no encontrado");
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      alert("Hubo un problema al intentar iniciar sesión.");
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h1 className="auth-title">Iniciar Sesión</h1>
      <div className="social-container">
        <a href="#"><FontAwesomeIcon icon={faGoogle} /></a>
        <a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
      </div>
      <span className="auth-subtitle text-muted">o usa tu cuenta</span>
      <input
        type="email"
        className="auth-input"
        placeholder="Email"
        value={correoUsuario}
        onChange={(e) => setCorreoUsuario(e.target.value)}
        required
      />
      <input
        type="password"
        className="auth-input"
        placeholder="Contraseña"
        value={contrasenaUsuario}
        onChange={(e) => setContrasenaUsuario(e.target.value)}
        required
      />
      <a href="#" className="auth-link">¿Olvidaste tu contraseña?</a>
      <button type="submit" className="auth-button">Entrar</button>
      
      <div className="d-lg-none mt-4">
        <p className="text-muted small">
          ¿No tienes cuenta? <span className="text-primary cursor-pointer" onClick={onSwitch}>Regístrate</span>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;
