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

// Monta la aplicación en el div#root del index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter habilita la navegación con URLs reales (sin hash) */}
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>,
);
