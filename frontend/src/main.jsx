/**
 * main.jsx — Punto de entrada de la aplicación React
 *
 * Responsabilidades:
 * - Monta el árbol de componentes en el elemento #root del DOM
 * - Envuelve la app en StrictMode para detectar problemas en desarrollo
 * - Provee el BrowserRouter para que react-router-dom gestione la navegación
 * - Carga los estilos globales (index.css)
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '953112545969536-mockclientid.apps.googleusercontent.com';

// Monta la aplicación en el div#root del index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter habilita la navegación con URLs reales (sin hash) */}
    <BrowserRouter>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

