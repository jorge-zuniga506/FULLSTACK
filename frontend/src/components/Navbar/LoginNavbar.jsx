import React from 'react';
import { Link } from 'react-router-dom';
import './LoginNavbar.css';

const LoginNavbar = () => {
  return (
    <nav className="login-navbar">
      <Link to="/" className="back-link">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="back-icon"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Volver al inicio</span>
      </Link>
    </nav>
  );
};

export default LoginNavbar;