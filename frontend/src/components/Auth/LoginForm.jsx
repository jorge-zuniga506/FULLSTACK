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

<<<<<<< HEAD
      if (startupLogueada.length > 0 || inversorLogueado.length > 0 || aceleradoraLogueada.length > 0 || adminLogueado.length > 0) {
        if (startupLogueada.length > 0) {
          if (startupLogueada[0].rol === "startup") {
            localStorage.setItem("usuarioLogueado", JSON.stringify(startupLogueada[0]))
            navigate("/PerfilPrivadoStartup");
          }
        } else if (inversorLogueado.length > 0) {
          if (inversorLogueado[0].rol === "inversor") {
            localStorage.setItem("usuarioLogueado", JSON.stringify(inversorLogueado[0]))
            navigate("/Mapa");
          }
        } else if (aceleradoraLogueada.length > 0) {
          if (aceleradoraLogueada[0].rol === "aceleradora") {
            localStorage.setItem("usuarioLogueado", JSON.stringify(aceleradoraLogueada[0]))
            navigate("/PerfilPrivadoAceleradora");
          }
        } else if (adminLogueado.length > 0) {
          if (adminLogueado[0].rol === "admin") {
            localStorage.setItem("usuarioLogueado", JSON.stringify(adminLogueado[0]))
            localStorage.setItem("token", "token")
            navigate("/DashboardAdmin");
          }
        }
=======
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
>>>>>>> b5c27e0cbba049050b9e43a54ef914b97272dc9f
      } else {
        alert("Credenciales incorrectas o usuario no encontrado");
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      alert("Hubo un problema al intentar iniciar sesión.");
    }
  }

  return (
<<<<<<< HEAD
    <main className="login-main-container">
      <div className="login-glass-card animate-fade-in shadow-2xl">
        {/* Brand/Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 border border-primary/20">
            <span className="material-symbols-outlined text-primary text-4xl">lock</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Nexus Cobalt</h1>
          <p className="text-slate-400 text-sm mt-1">Plataforma de Ecosistemas Startup</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="login-label" htmlFor="email">Correo Electr³nico</label>
            <input
              id="email"
              type="email"
              className="login-input"
              placeholder="nombre@ejemplo.com"
              value={correoUsuario}
              onChange={(e) => setCorreoUsuario(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="login-label" htmlFor="password">Contrasena</label>
              <a href="#" className="text-xs text-primary hover:text-primary-light transition-colors font-medium">
                ¿Olvidaste tu contrasena?
              </a>
            </div>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              value={contrasenaUsuario}
              onChange={(e) => setContrasenaUsuario(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-neon mt-4 active:scale-95 transition-transform" onClick={handleLogin}>
            Iniciar Sesi³n
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#111827] px-2 text-slate-500 font-medium">O continuar con</span>
            </div>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="btn-social-auth">
              <i className="fa-brands fa-google text-red-500"></i>
              <span>Google</span>
            </button>
            <button type="button" className="btn-social-auth">
              <i className="fa-brands fa-linkedin text-blue-500"></i>
              <span>LinkedIn</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-slate-400 text-sm">
            ¿No tienes una cuenta?{" "}
            <Link to="/Register" className="text-primary hover:underline font-semibold decoration-2 underline-offset-4 transition-all">
              Reg­strate ahora
            </Link>
          </p>
        </div>

        {/* Security badges */}
        <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-800/50">
          <div className="flex items-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            <span className="material-symbols-outlined text-xs mr-1">security</span>
            AES-256
          </div>
          <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
          <div className="flex items-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            <span className="material-symbols-outlined text-xs mr-1">verified_user</span>
            ISO 27001
          </div>
        </div>
=======
    <form onSubmit={handleLogin}>
      <h1 className="auth-title">Iniciar Sesión</h1>
      <div className="social-container">
        <a href="#"><FontAwesomeIcon icon={faGoogle} /></a>
        <a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
>>>>>>> b5c27e0cbba049050b9e43a54ef914b97272dc9f
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
