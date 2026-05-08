import React, { useState, useEffect } from 'react';
import Services from '../services/Services';
import '../styles/SolicitudesPendientes.css';

function GestionarUsuarios() {
  const [administradores, setAdministradores] = useState([]);
  const [startups, setStartups] = useState([]);
  const [aceleradoras, setAceleradoras] = useState([]);
  const [inversores, setInversores] = useState([]);

  useEffect(() => {
    async function cargarDatos() {
      const respAdmin = await Services.getAdministradores();
      setAdministradores(respAdmin || []);
      
      const respStartups = await Services.getStartups();
      setStartups(respStartups || []);
      
      const respAceleradoras = await Services.getAceleradoras();
      setAceleradoras(respAceleradoras || []);
      
      const respInversores = await Services.getInversores();
      setInversores(respInversores || []);
    }
    cargarDatos();
  }, []);

  async function eliminarUsuario(tipo, id) {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
    
    try {
      if (tipo === 'administrador') {
        await Services.deleteAdministradores(id);
        setAdministradores(prev => prev.filter(u => u.id !== id));
      } else if (tipo === 'startup') {
        await Services.deleteStartup(id);
        setStartups(prev => prev.filter(u => u.id !== id));
      } else if (tipo === 'aceleradora') {
        await Services.deleteAceleradoras(id);
        setAceleradoras(prev => prev.filter(u => u.id !== id));
      } else if (tipo === 'inversor') {
        await Services.deleteInversores(id);
        setInversores(prev => prev.filter(u => u.id !== id));
      }
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  }

  // Combinar todos para mostrar en una sola tabla
  const todosLosUsuarios = [
    ...administradores.map(u => ({ ...u, rolDisplay: 'Administrador', tipo: 'administrador' })),
    ...startups.map(u => ({ ...u, rolDisplay: 'Startup', tipo: 'startup' })),
    ...aceleradoras.map(u => ({ ...u, rolDisplay: 'Aceleradora', tipo: 'aceleradora' })),
    ...inversores.map(u => ({ ...u, rolDisplay: 'Inversor', tipo: 'inversor' }))
  ];

  return (
    <div className="dark bg-darkBg text-slate-100 min-h-screen flex flex-col">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-darkBorder px-6 md:px-10 py-4 bg-darkSurface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="d-flex align-items-center gap-2">
          <div className="logo-box">⚡</div>
          <span className="logo-text">
            Nexxus<span className="text-primary">Cobalt</span>
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-darkBorder bg-darkSurface/30 hidden md:flex flex-col p-6 overflow-y-auto">
          <nav className="flex flex-col gap-2">
            <a className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-100 hover:bg-darkSurface rounded-custom transition-colors text-sm font-medium" href="/DashboardAdmin">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              Dashboard
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-100 hover:bg-darkSurface rounded-custom transition-colors text-sm font-medium" href="/SolicitudesPendientesAceleradoras">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
              Aceleradoras
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-100 hover:bg-darkSurface rounded-custom transition-colors text-sm font-medium" href="/SolicitudesPendientes">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              Startups
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-primary bg-primary/10 rounded-custom transition-colors text-sm font-medium" href="/GestionarUsuarios">
              <span className="material-symbols-outlined text-[20px]">group</span>
              Usuarios
            </a>
            <div className="my-4 border-t border-darkBorder"></div>
            <a className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-100 hover:bg-darkSurface rounded-custom transition-colors text-sm font-medium" href="/">
              <span className="material-symbols-outlined text-[20px]">start</span>
              Inicio
            </a>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-slate-100 text-3xl font-bold leading-tight tracking-[-0.033em] font-display">Gestionar Usuarios</h1>
                <p className="text-slate-400 text-base mt-1">Lista completa de todos los usuarios registrados en la plataforma.</p>
              </div>
            </div>

            <div className="bg-darkSurface/50 border border-darkBorder rounded-custom overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-darkBorder bg-darkSurface">
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300">Nombre de Usuario</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300">Rol</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300">Correo Electrónico</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-darkBorder">
                  {todosLosUsuarios.length > 0 ? todosLosUsuarios.map((usuario, idx) => (
                    <tr key={`${usuario.tipo}-${usuario.id || idx}`} className="hover:bg-darkSurface/30 transition-colors">
                      <td className="py-4 px-6 text-sm font-medium text-slate-100">
                        {usuario.nombre || usuario.nombreUsuario || 'Sin nombre'}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className={`badge ${
                          usuario.tipo === 'administrador' ? 'badge-seriesa' : 
                          usuario.tipo === 'startup' ? 'badge-preseed' : 
                          usuario.tipo === 'aceleradora' ? 'badge-seed' : 'badge-bootstrapped'
                        }`}>
                          {usuario.rolDisplay}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-400">
                        {usuario.correo}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => eliminarUsuario(usuario.tipo, usuario.id)} 
                          className="px-4 py-2 text-sm font-medium text-slate-300 border border-darkBorder bg-darkBg hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 rounded-custom transition-all"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="py-10 text-center text-slate-500">
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="mt-10 py-6 text-center text-slate-500 text-sm border-t border-darkBorder">
              © 2024 Nexus Cobalt. Todos los derechos reservados.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default GestionarUsuarios;