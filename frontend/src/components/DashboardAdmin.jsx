import React, { useState, useEffect} from 'react'
import '../styles/DashboardAdminStyle.css'
import Services from '../services/Services'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
function DashboardAdmin() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [totalStartups, setTotalStartups] = useState(0);
  const [totalInversores, setTotalInversores] = useState(0);
  const [totalAceleradoras, setTotalAceleradoras] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
  async function cargarDatosIniciales() {
    // Obtener solicitudes (lo que ya tenías)
    const dataSolicitudes = await Services.getSolicitudes();
    setSolicitudes(dataSolicitudes);

    // Obtener startups y contar
    const dataStartups = await Services.getStartups(); 
    if (dataStartups) {
      setTotalStartups(dataStartups.length);
    }
  }
  
  cargarDatosIniciales();
}, []);

useEffect(() => {
  async function cargarDatosInversores() {
    // Obtener solicitudes (lo que ya tenías)
    const dataSolicitudes = await Services.getSolicitudes();
    setSolicitudes(dataSolicitudes);

    // Obtener inversores y contar
    const dataInversores = await Services.getInversores(); 
    if (dataInversores) {
      setTotalInversores(dataInversores.length);
    }
  }
  
  cargarDatosInversores();
}, []);

useEffect(() => {
  async function cargarDatosAceleradoras() {
    // Obtener solicitudes (lo que ya tenías)
    const dataSolicitudes = await Services.getSolicitudes();
    setSolicitudes(dataSolicitudes);

    // Obtener aceleradoras y contar
    const dataAceleradoras = await Services.getAceleradoras(); 
    if (dataAceleradoras) {
      setTotalAceleradoras(dataAceleradoras.length);
    }
  }
  
  cargarDatosAceleradoras();
}, []);

  useEffect(() => {
    async function obtenerSolicitudes() {
      const data = await Services.getSolicitudes();
      setSolicitudes(data);
    }
    obtenerSolicitudes();
  }, []);

  async function aceptarSolicitud(solicitudStartup) {
    const objStartup = {
      nombre: solicitudStartup.nombre,
      miembros: solicitudStartup.miembros,
      url: solicitudStartup.url,
      region: solicitudStartup.region,
      latitud: solicitudStartup.latitud,
      longitud: solicitudStartup.longitud,
      año: solicitudStartup.año,
      correo: solicitudStartup.correo,
      contraseña: solicitudStartup.contraseña,
      logotipo: solicitudStartup.logotipo,
      arr: solicitudStartup.arr,
      usuarios: solicitudStartup.usuarios,
      crecimiento: solicitudStartup.crecimiento,
      sector: solicitudStartup.sector,
      etapa: solicitudStartup.etapa,
      modelo: solicitudStartup.modelo,
      raise: solicitudStartup.raise,
      pitch: solicitudStartup.pitch,
      descripcion: solicitudStartup.descripcion,
      rol: solicitudStartup.rol
    };

    await Services.postStartups(objStartup);
    await Services.deleteSolicitudes(solicitudStartup.id);
    setSolicitudes(prev => prev.filter(s => s.id !== solicitudStartup.id));
  };

  const denegarSolicitud = async (solicitudStartup) => {
    await Services.deleteSolicitudes(solicitudStartup.id);
    setSolicitudes(prev => prev.filter(s => s.id !== solicitudStartup.id));
  };

  useEffect(() => {
    console.log('Dashboard updated to StartupHub Neon Cyber-Premium Style');
  }, []);
  function ir () {
    navigate('/Notificaciones');
  }
  return (
    <div className="dark h-screen overflow-hidden bg-[#0f172a] text-slate-100 font-sans flex w-full">
      {/* BEGIN: Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col transition-all duration-300" id="sidebar">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00d4ff] flex items-center justify-center rounded-theme glow-primary">
            <svg className="h-6 w-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="logo-box">⚡</div>
            <span className="logo-text">
              Nexxus<span className="text-primary">Cobalt</span>
            </span>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          <a className="flex items-center gap-3 px-4 py-3 bg-[#00d4ff] text-slate-950 rounded-theme transition-all glow-primary" href="#">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            <span className="font-bold">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-[#00d4ff] rounded-theme transition-all" href="/">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            <span className="font-medium">Inicio</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-[#00d4ff] rounded-theme transition-all" href="/GestionarUsuarios">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            <span className="font-medium">Usuarios</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-[#00d4ff] rounded-theme transition-all" href="/PrincipalAdmin">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l5-2.5 5.553 2.776a1 1 0 01.447.894v10.764a1 1 0 01-1.447.894L14 17l-5 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            <span className="font-medium">Mapa</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-[#00d4ff] rounded-theme transition-all" href="/SolicitudesPendientesAceleradoras">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            <span className="font-medium">Solicitudes Aceleradoras</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-[#00d4ff] rounded-theme transition-all" href="/SolicitudesPendientes">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            <span className="font-medium">Solicitudes Pendientes</span>
          </a>
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 bg-slate-800/40 rounded-theme border border-white/5">
            <img alt="Admin" className="w-10 h-10 rounded-full border border-[#00d4ff]/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPJxZ6QMKlQIQxQNl1gur9AlgpK30o6UQq2LgOD1yKcz-cLdtDdjETZ8LFY0O3qZ6EUuAjnaXi3AWSfZnE7zuxf68NBipj2TJvqaXmW2fOhsHZYr-pRp4V0eJSMvGtbr026qELCb2dKmZ2GrWOHxyMOA6QCc6K6DXjI8jBbpgpsvQ_9Eg9LB3GHaXyvEsFZWA_v33iaRJhwTW0vl2wFYpId2Erh35cIeeprXarsn0tYFuEV3SrzH8tUlbIBhoX0qBhXgh-9KY5Ka94" />
            <div>
              <p className="text-sm font-semibold text-white">Bienvenido</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
          </div>
        </div>
      </aside>
      {/* END: Sidebar */}

      {/* BEGIN: Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-slate-950/20">
        {/* BEGIN: Header */}
        <header className="h-16 border-b border-white/5 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-10 px-8 flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-white">Resumen de Plataforma</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-full transition-all border border-white/5" onClick={ir}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </button>
          </div>
        </header>
        {/* END: Header */}

        <div className="p-8 space-y-8">
          {/* BEGIN: KPI Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-premium p-6 rounded-theme flex items-center justify-between group" data-purpose="kpi-card">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Startups</p>
                <h3 className="text-3xl font-display font-bold mt-1 text-white glow-text-primary">{totalStartups}</h3>
                <p className="text-emerald-400 text-xs mt-2 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full glow-accent"></span> ↑ 12% vs mes ant.
                </p>
              </div>
              <div className="p-3 bg-[#00d4ff]/10 rounded-theme group-hover:bg-[#00d4ff]/20 transition-colors border border-[#00d4ff]/20">
                <svg className="w-8 h-8 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
            </div>
            <div className="card-premium p-6 rounded-theme flex items-center justify-between group" data-purpose="kpi-card">
              <div>
                <p className="text-slate-400 text-sm font-medium">Inversores Activos</p>
                <h3 className="text-3xl font-display font-bold mt-1 text-white glow-text-primary">{totalInversores}</h3>
                <p className="text-emerald-400 text-xs mt-2 font-semibold">↑ 5% vs mes ant.</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-theme group-hover:bg-purple-500/20 transition-colors border border-purple-500/20">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
            </div>
            <div className="card-premium p-6 rounded-theme flex items-center justify-between group" data-purpose="kpi-card">
              <div>
                <p className="text-slate-400 text-sm font-medium">Aceleradoras</p>
                <h3 className="text-3xl font-display font-bold mt-1 text-white glow-text-primary">{totalAceleradoras}</h3>
                <p className="text-slate-500 text-xs mt-2 font-semibold">Sin cambios</p>
              </div>
              <div className="p-3 bg-[#ff8c00]/10 rounded-theme group-hover:bg-[#ff8c00]/20 transition-colors border border-[#ff8c00]/20">
                <svg className="w-8 h-8 text-[#ff8c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
            </div>
            <div className="card-premium p-6 rounded-theme flex items-center justify-between group" data-purpose="kpi-card">
              <div>
                <p className="text-slate-400 text-sm font-medium">Capital Total</p>
                <h3 className="text-3xl font-display font-bold mt-1 text-white glow-text-primary">$42.8M</h3>
                <p className="text-emerald-400 text-xs mt-2 font-semibold">↑ 18% vs mes ant.</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-theme group-hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
            </div>
          </section>
          {/* END: KPI Grid */}

          {/* BEGIN: Charts & Activity */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Growth Chart Mockup */}
            <div className="lg:col-span-2 card-premium p-6 rounded-theme">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-display font-semibold text-white">Crecimiento Mensual</h2>
                <select className="bg-slate-800 border border-white/5 text-xs rounded-theme py-1 px-3 focus:ring-1 focus:ring-[#00d4ff] text-slate-300">
                  <option>Últimos 6 meses</option>
                  <option>Último año</option>
                </select>
              </div>
              <div className="h-64 relative flex items-end gap-3 px-4">
                <div className="flex-1 bg-slate-800/50 h-1/4 rounded-t-md relative group">
                  <div className="absolute inset-x-0 bottom-0 bg-[#00d4ff]/40 h-full rounded-t-md group-hover:bg-[#00d4ff] group-hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all"></div>
                </div>
                <div className="flex-1 bg-slate-800/50 h-2/4 rounded-t-md relative group">
                  <div className="absolute inset-x-0 bottom-0 bg-[#00d4ff]/40 h-full rounded-t-md group-hover:bg-[#00d4ff] group-hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all"></div>
                </div>
                <div className="flex-1 bg-slate-800/50 h-2/5 rounded-t-md relative group">
                  <div className="absolute inset-x-0 bottom-0 bg-[#00d4ff]/40 h-full rounded-t-md group-hover:bg-[#00d4ff] group-hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all"></div>
                </div>
                <div className="flex-1 bg-slate-800/50 h-3/5 rounded-t-md relative group">
                  <div className="absolute inset-x-0 bottom-0 bg-[#00d4ff]/40 h-full rounded-t-md group-hover:bg-[#00d4ff] group-hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all"></div>
                </div>
                <div className="flex-1 bg-slate-800/50 h-4/5 rounded-t-md relative group">
                  <div className="absolute inset-x-0 bottom-0 bg-[#00d4ff]/40 h-full rounded-t-md group-hover:bg-[#00d4ff] group-hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all"></div>
                </div>
                <div className="flex-1 bg-slate-800/50 h-full rounded-t-md relative group">
                  <div className="absolute inset-x-0 bottom-0 bg-[#00d4ff]/40 h-full rounded-t-md group-hover:bg-[#00d4ff] group-hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all"></div>
                </div>
              </div>
              <div className="flex justify-between mt-4 text-xs text-slate-500 font-medium px-4">
                <span>ENE</span><span>FEB</span><span>MAR</span><span>ABR</span><span>MAY</span><span>JUN</span>
              </div>
            </div>
            {/* Quick Stats */}
            <div className="card-premium p-6 rounded-theme">
              <h2 className="text-lg font-display font-semibold mb-6 text-white">Distribución de Capital</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Fintech</span>
                    <span className="font-semibold text-white">42%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00d4ff] h-full w-[42%] shadow-[0_0_10px_rgba(0,212,255,0.6)]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">HealthTech</span>
                    <span className="font-semibold text-white">28%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#ff8c00] h-full w-[28%] shadow-[0_0_10px_rgba(255,140,0,0.6)]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">SaaS</span>
                    <span className="font-semibold text-white">20%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-[20%] shadow-[0_0_10px_rgba(168,85,247,0.6)]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Otros</span>
                    <span className="font-semibold text-white">10%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-500 h-full w-[10%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* END: Charts & Activity */}

          {/* BEGIN: Recent Startups Table */}
          <section className="card-premium rounded-theme overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-display font-semibold text-white">Startups Recientes para Aprobación</h2>
              <button className="text-sm text-[#00d4ff] font-semibold hover:glow-text-primary transition-colors">Ver todas</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800/40 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">Startup</th>
                    <th className="px-6 py-4 font-medium">Ronda</th>
                    <th className="px-6 py-4 font-medium">Detalles</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {solicitudes.length > 0 ? solicitudes.map((solicitud) => (
                    <tr key={solicitud.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-800 rounded-theme flex items-center justify-center font-bold text-[#00d4ff] border border-white/5 group-hover:border-[#00d4ff]/40 transition-all">
                            {solicitud.nombre ? solicitud.nombre.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{solicitud.nombre}</p>
                            <p className="text-xs text-slate-500">{solicitud.correo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{solicitud.pitch || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        <button
                          className="text-[#00d4ff] hover:text-[#33dcff] text-xs font-medium flex items-center gap-1 transition-colors"
                          data-bs-toggle="modal"
                          data-bs-target={`#modal-${solicitud.id}`}
                        >
                          <span className="material-symbols-outlined text-xs">visibility</span>
                          Ver detalles
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-[#ff8c00]/10 text-[#ff8c00] text-xs font-semibold rounded-full border border-[#ff8c00]/20">Pendiente</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => aceptarSolicitud(solicitud)}
                            className="px-3.5 py-1.5 bg-[#00d4ff] text-slate-950 text-xs font-bold rounded-theme hover:bg-[#33dcff] transition-all glow-primary">
                            Aprobar
                          </button>
                          <button 
                            onClick={() => denegarSolicitud(solicitud)}
                            className="px-3.5 py-1.5 bg-slate-800 text-slate-400 text-xs font-semibold rounded-theme hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/5">
                            Rechazar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                        No hay solicitudes pendientes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          {/* END: Recent Startups Table */}
        </div>

        {/* BEGIN: Footer */}
        <footer className="mt-auto p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm gap-4">
          <p>© 2026 NexxusCobalt. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a className="hover:text-[#00d4ff] transition-colors" href="#">Privacidad</a>
            <a className="hover:text-[#00d4ff] transition-colors" href="#">Términos</a>
            <a className="hover:text-[#00d4ff] transition-colors" href="#">Soporte</a>
          </div>
        </footer>
        {/* END: Footer */}
      </main>
      {/* END: Main Content */}

      {/* Modals for Details */}
      {solicitudes.map((solicitud) => (
        <div key={`modal-${solicitud.id}`} className="modal fade" id={`modal-${solicitud.id}`} tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-slate-900 border border-white/10 text-slate-100">
              <div className="modal-header border-b border-white/10">
                <h5 className="modal-title font-bold">Detalles: {solicitud.nombre}</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Información de la Compañía</label>
                    <div className="mt-2 space-y-3">
                      <div><span className="text-slate-400 text-sm">Email:</span> <p className="text-slate-100">{solicitud.correo}</p></div>
                      <div><span className="text-slate-400 text-sm">Website:</span> <p className="text-[#00d4ff] truncate">{solicitud.url}</p></div>
                      <div><span className="text-slate-400 text-sm">Descripción:</span> <p className="text-slate-100 text-sm">{solicitud.descripcion}</p></div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Métricas y Ronda</label>
                    <div className="mt-2 space-y-3">
                      <div><span className="text-slate-400 text-sm">Ronda Actual:</span> <p className="text-slate-100">{solicitud.pitch}</p></div>
                      <div><span className="text-slate-400 text-sm">ARR:</span> <p className="text-slate-100 font-mono">${solicitud.arr}</p></div>
                      <div><span className="text-slate-400 text-sm">Meta de Recaudación:</span> <p className="text-slate-100 font-mono">${solicitud.raise}</p></div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Miembros</label>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      {solicitud.miembros?.map((m, idx) => (
                        <div key={idx} className="bg-slate-800/50 p-3 rounded-theme border border-white/5">
                          <p className="font-bold text-slate-100">{m.nombre}</p>
                          <p className="text-xs text-slate-400">{m.funcion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-t border-white/10">
                <button type="button" className="px-4 py-2 text-sm font-medium text-slate-300 border border-white/10 rounded-theme hover:bg-slate-800 transition-all" data-bs-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardAdmin
