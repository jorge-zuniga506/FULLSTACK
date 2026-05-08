import React, { useState } from 'react';
import '../styles/Register.css';
import Services from '../services/Services';
import { Link, useNavigate } from 'react-router-dom';

function RegistroForm() {

  const [nombre, setNombre] = useState ("")
  const [correo, setCorreo] = useState ("")
  const [contraseña, setContraseña] = useState ("")
  const [rol, setRol] = useState("inversor")
  const [tesis, setTesis] = useState("")
  const [sectoresInteres, setSectoresInteres] = useState([])
  const [portafolio, setPortafolio] = useState([])
  const navigate = useNavigate();


  const validatePassword = (pass) => {
    const re = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(pass);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!nombre || !correo || !contraseña) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (!validatePassword(contraseña)) {
      alert("La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula y un número.");
      return;
    }

    const objUsuario = {
      nombre,
      correo,
      contraseña,
      rol: 'inversor',
      tesis,
      sectoresInteres,
      portafolio
    };

    try {
      await Services.postInversores(objUsuario);
      alert("¡Registro exitoso! Bienvenido.");
      navigate('/Login');
    } catch (error) {
      console.error("Error al registrarse:", error);
      alert("Hubo un error en el registro. Inténtalo de nuevo.");
    }
  };

  return (
    <div className='container'>
    <main className="registration-container" data-purpose="registration-container">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Crear una cuenta de inversor</h1>
        <p className="text-slate-400">Únete a la red más grande de inversión y aceleración tecnológica.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8" id="registration-form">
        {/* Role Selection */}
        <section data-purpose="role-selection">
          <label className="block text-sm font-medium text-slate-400 mb-4 text-center">Introduce tus datos</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Investor Option */}
          </div>
        </section>
        {/* Form Fields */}
        <section className="space-y-4" data-purpose="user-details">
          <div className="flex flex-col gap-4">
            {/* Name Field */}
            <div>
              <label className="form-label" htmlFor="name">Nombre Completo</label>
              <input
                className="custom-input"
                id="name"
                name="name"
                type="text"
                placeholder="Ej: Juan Pérez"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            {/* Email Field */}
            <div>
              <label className="form-label" htmlFor="email">Correo Electrónico</label>
              <input
                className="custom-input"
                id="email"
                name="email"
                type="email"
                placeholder="nombre@empresa.com"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
            {/* Password Field */}
            <div>
              <label className="form-label" htmlFor="password">Contraseña</label>
              <input
                className="custom-input"
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
              />
              <p className="text-[10px] text-slate-500 mt-2 italic">Mínimo 8 caracteres, incluyendo una mayúscula y un número.</p>
            </div>
          </div>
        </section>
        {/* Submit Button */}
        <footer className="pt-4 space-y-4">
          <button className="w-full neon-button transition-all transform active:scale-[0.98]" type="submit">
            Crear Cuenta
          </button>
          
          <div className="text-center">
            <Link 
              to="/SolicitudStartup" 
              className="text-primary hover:text-primary-light text-sm font-medium transition-colors duration-200 decoration-2 underline-offset-4"
            >
              Solicitud de creación de cuenta Startup
            </Link>
          </div>

          <div className="text-center">
            <Link 
              to="/SolicitudAceleradora" 
              className="text-primary hover:text-primary-light text-sm font-medium transition-colors duration-200 decoration-2 underline-offset-4"
            >
              Solicitud de creación de cuenta Aceleradora
            </Link>
          </div>
          
          <p className="text-center text-sm text-slate-500">
            ¿Ya tienes una cuenta? <Link to="/Login" className="text-primary hover:underline">Inicia sesión aquí</Link>
          </p>
        </footer>
      </form>
    </main>
    </div>
  );
};

export default RegistroForm;