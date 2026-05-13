import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import '../../styles/Auth.css';

function AuthContainer({ initialMode = 'signin' }) {
  const [isRightPanelActive, setIsRightPanelActive] = useState(initialMode === 'signup');

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  return (
    <div className="auth-page">
      {/* Background elements */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
        
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <RegisterForm onSwitch={handleSignInClick} />
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <LoginForm onSwitch={handleSignUpClick} />
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <div className="auth-brand-inline mb-5">
                <div className="auth-logo-icon-sm">⚡</div>
                <span className="auth-brand-name-sm">Nexus<span className="text-primary">Cobalt</span></span>
              </div>
              <h1 className="auth-title">¡Bienvenido de nuevo!</h1>
              <p className="auth-subtitle">Para mantenerte conectado con nosotros, por favor inicia sesión con tu información personal</p>
              <button className="auth-button ghost" id="signIn" onClick={handleSignInClick}>Iniciar Sesión</button>
            </div>
            <div className="overlay-panel overlay-right">
              <div className="auth-brand-inline mb-5">
                <div className="auth-logo-icon-sm">⚡</div>
                <span className="auth-brand-name-sm">Nexus<span className="text-primary">Cobalt</span></span>
              </div>
              <h1 className="auth-title">¿Hola, Amigo!</h1>
              <p className="auth-subtitle">Introduce tus datos personales y comienza tu viaje con nosotros</p>
              <button className="auth-button ghost" id="signUp" onClick={handleSignUpClick}>Registrarse</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthContainer;
