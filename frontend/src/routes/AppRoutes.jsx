import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ─── Layouts ──────────────────────────────────────────────────────────────────
// DashboardLayout: envuelve las páginas del ecosistema con el sidebar lateral
import DashboardLayout from '../components/Layout/DashboardLayout';

// ─── Páginas Standalone (sin sidebar) ─────────────────────────────────────────
// Estas páginas tienen su propio layout completo (navbar propia o auth)
import Landpage           from '../pages/Landpage/Landpage';
import Login              from '../pages/Auth/Login';
import Register           from '../pages/Auth/Register';
import PublishGeneral     from '../pages/PublishGeneral/PublishGeneral';
import AboutPage          from '../pages/About/AboutPage';



// ─── Páginas del Ecosistema (con sidebar via DashboardLayout) ─────────────────
// Todas estas rutas comparten el sidebar de navegación
import Dashboard          from '../pages/Dashboard/Dashboard';
import Explorer           from '../pages/Explorer/Explorer';
import Startups           from '../pages/Startups/Startups';
import Investors          from '../pages/Investors/Investors';
import Accelerators       from '../pages/Accelerators/Accelerators';
import Profile            from '../pages/Profile/Profile';

/**
 * AppRoutes — Configuración central del enrutamiento
 *
 * Dos tipos de rutas:
 * 1. STANDALONE: Páginas sin sidebar (landing, auth, perfiles de entidad)
 * 2. CON SIDEBAR: Páginas del ecosistema envueltas en <DashboardLayout>
 *
 * Rutas de perfil de entidad:
 *   /startup/:slug      → perfil de una startup por su slug (ej: "agrotech-cr")
 *   /investor/:slug     → perfil de un inversor
 *   /accelerator/:slug  → perfil de una aceleradora
 *
 * Catch-all: cualquier ruta no definida redirige al dashboard
 */
const AppRoutes = () => {
  return (
    <Routes>

      {/* ── 1. PÁGINAS STANDALONE (SIN SIDEBAR) ─────────────────────────── */}

      {/* Landing page pública */}
      <Route path="/"        element={<Landpage />} />

      {/* Autenticación */}
      <Route path="/login"   element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/PublishGeneral" element={<PublishGeneral />} />
      <Route path="/about"          element={<AboutPage />} />


      {/* ── 2. PÁGINAS DEL ECOSISTEMA (CON SIDEBAR) ─────────────────────── */}

      {/* Dashboard principal: estadísticas globales del ecosistema */}
      <Route path="/dashboard"    element={<DashboardLayout><Dashboard /></DashboardLayout>} />

      {/* Explorador interactivo: mapa de nodos SVG con filtros */}
      <Route path="/explorer"     element={<DashboardLayout><Explorer /></DashboardLayout>} />

      {/* Listas de entidades con búsqueda y filtros */}
      <Route path="/startups"     element={<DashboardLayout><Startups /></DashboardLayout>} />
      <Route path="/investors"    element={<DashboardLayout><Investors /></DashboardLayout>} />
      <Route path="/accelerators" element={<DashboardLayout><Accelerators /></DashboardLayout>} />

      {/* Perfil del usuario autenticado */}
      <Route path="/profile"      element={<DashboardLayout><Profile /></DashboardLayout>} />


      {/* ── CATCH-ALL: redirige rutas desconocidas al dashboard ───────────── */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  );
};

export default AppRoutes;
