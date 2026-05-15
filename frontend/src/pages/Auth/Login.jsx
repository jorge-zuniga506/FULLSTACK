import React from 'react';
import LoginForm from '../../components/Auth/LoginForm'; // Formulario visual de login
import '../../styles/Login.css'; // Estilos de .auth-wrapper, .auth-form-panel, .auth-image-panel

/**
 * Login — Página de inicio de sesión
 *
 * Es una "wrapper page": solo configura el contenedor y sobreescribe
 * los estilos globales de #root para que esta página sea full-width
 * (sin el max-width de 1126px del ecosistema).
 *
 * El <style> inline usa !important para anular el #root del index.css
 * ya que no hay soporte de temas por ruta en la configuración actual.
 *
 * El formulario visual y la lógica de campos está en LoginForm.
 *
 * TODO: una vez integrado AuthContext, redirigir al dashboard si ya hay sesión activa
 */
const Login = () => {
  return (
    <div className="auth-container">
      {/*
        Override de estilos de #root para auth:
        - width/max-width al 100% para layout full-screen
        - sin margen ni borde lateral
        - display:block en vez de flex para evitar el layout de columna del ecosistema
      */}
      <style>{`#root{width:100%!important;max-width:100%!important;margin:0!important;border:none!important;display:block!important;}`}</style>

      {/* Formulario de login con split-panel (form izquierdo + imagen derecha) */}
      <LoginForm />
    </div>
  );
};

export default Login;
