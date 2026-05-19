import React from 'react';
import RegisterForm from '../../components/Auth/RegisterForm'; // Formulario visual de registro
import '../../styles/Register.css'; // Estilos de .auth-wrapper, .auth-form-panel, .auth-image-panel

/**
 * Register — Página de registro de nuevos usuarios
 *
 * Es una "wrapper page": solo configura el contenedor y sobreescribe
 * los estilos globales de #root para layout full-width (igual que Login).
 *
 * El <style> inline anula el max-width de 1126px del index.css
 * para que la pantalla de auth ocupe el 100% del viewport.
 *
 * El formulario visual y los campos están en RegisterForm.
 *
 * TODO: una vez integrado AuthContext, redirigir al dashboard si ya hay sesión activa
 * TODO: conectar el submit de RegisterForm al endpoint POST /api/auth/register
 */
const Register = () => {
  return (
    <div className="auth-container">
      {/*
        Override de estilos de #root para auth:
        - width/max-width al 100% para layout full-screen
        - sin margen ni borde lateral
        - display:block en vez de flex para evitar el layout de columna del ecosistema
      */}
      <style>{`#root{width:100%!important;max-width:100%!important;margin:0!important;border:none!important;display:block!important;}`}</style>

      {/* Formulario de registro con split-panel (form izquierdo + imagen derecha) */}
      <RegisterForm />
    </div>
  );
};

export default Register;
