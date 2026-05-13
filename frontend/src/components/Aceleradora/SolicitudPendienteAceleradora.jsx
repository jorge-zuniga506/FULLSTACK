import React, { useState, useEffect } from 'react';
import Services from '../../services/Services';
import '../../styles/SolicitudesPendientes.css';

function SolicitudPendienteAceleradora() {
  const [solicitudesAceleradoras, setSolicitudesAceleradoras] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  useEffect(() => {
    async function obtenerSolicitudesAceleradoras() {
      const data = await Services.getSolicitudesAceleradoras();
      setSolicitudesAceleradoras(data || []);
    }
    obtenerSolicitudesAceleradoras();
  }, []);

  async function aceptarSolicitudAceleradora(solicitudAceleradora) {
    await Services.deleteSolicitudesAceleradoras(solicitudAceleradora.id);
    const objAceleradora = {
      nombre: solicitudAceleradora.nombre,
      url: solicitudAceleradora.url,
      correo: solicitudAceleradora.correo,
      contrasena: solicitudAceleradora.contrasena,
      logotipo: solicitudAceleradora.logotipo,
      startupsAceleradas: solicitudAceleradora.startupsAceleradas,
      modeloAceleracion: solicitudAceleradora.modeloAceleracion,
      etapaObjetivo: solicitudAceleradora.etapaObjetivo,
      ubicacion: solicitudAceleradora.ubicacion,
      descripcion: solicitudAceleradora.descripcion,
      mentores: solicitudAceleradora.mentores,
      servicios: solicitudAceleradora.servicios,
      aplicacionesRecibidas: 0,
      startupsSeleccionadas: 0,
      startupsActivas: 0,
      startupsGraduadas: 0,
      rol: solicitudAceleradora.rol
    };
    await Services.postAceleradoras(objAceleradora);
    setSolicitudesAceleradoras(prev => prev.filter(s => s.id !== solicitudAceleradora.id));
  };

  async function denegarSolicitudAceleradora(solicitudAceleradora) {
    await Services.deleteSolicitudesAceleradoras(solicitudAceleradora.id);
    setSolicitudesAceleradoras(prev => prev.filter(s => s.id !== solicitudAceleradora.id));
  };

  return (
    <div className="dark bg-darkBg text-slate-100 min-h-screen flex flex-col">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-darkBorder px-6 md:px-10 py-4 bg-darkSurface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="d-flex align-items-center gap-2">
          <div className="logo-box">âš¡</div>
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
            <a className="flex items-center gap-3 px-3 py-2 text-primary bg-primary/10 rounded-custom transition-colors text-sm font-medium" href="/SolicitudesPendientesAceleradoras">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
              Aceleradoras
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-100 hover:bg-darkSurface rounded-custom transition-colors text-sm font-medium" href="/SolicitudesPendientes">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              Startups
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-100 hover:bg-darkSurface rounded-custom transition-colors text-sm font-medium" href="/GestionarUsuarios">
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
                <h1 className="text-slate-100 text-3xl font-bold leading-tight tracking-[-0.033em] font-display">Solicitudes Aceleradoras</h1>
                <p className="text-slate-400 text-base mt-1">Revisar y gestionar las solicitudes de nuevas aceleradoras.</p>
              </div>
            </div>

            <div className="bg-darkSurface/50 border border-darkBorder rounded-custom overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-darkBorder bg-darkSurface">
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300 w-1/3">Nombre de la Aceleradora</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300">Detalles</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-darkBorder">
                  {solicitudesAceleradoras.length > 0 ? solicitudesAceleradoras.map((solicitud) => (
                    <tr key={solicitud.id} className="hover:bg-darkSurface/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-100 text-base">{solicitud.nombre}</div>
                        <div className="text-sm text-slate-400 mt-0.5 truncate max-w-xs">{solicitud.descripcion}</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-300">
                        <div className="mb-1">ID: #{solicitud.id}</div>
                        <button 
                          onClick={() => setSelectedSolicitud(solicitud)}
                          className="text-primary hover:text-primary-light text-xs font-medium flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">visibility</span>
                          Ver detalles completos
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => denegarSolicitudAceleradora(solicitud)} 
                            className="px-4 py-2 text-sm font-medium text-slate-300 border border-darkBorder bg-darkBg hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 rounded-custom transition-all"
                          >
                            Denegar
                          </button>
                          <button 
                            onClick={() => aceptarSolicitudAceleradora(solicitud)} 
                            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-custom transition-all shadow-lg shadow-primary/20"
                          >
                            Aceptar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="py-10 text-center text-slate-500">
                        No hay solicitudes pendientes.
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

      {/* Modal de Detalles usando React State */}
      {selectedSolicitud && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedSolicitud(null)}></div>
          <div className="relative bg-darkSurface border border-darkBorder rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
            <div className="p-6 border-b border-darkBorder flex justify-between items-center bg-darkSurface sticky top-0">
              <h2 className="text-xl font-bold text-white">Detalles de Solicitud</h2>
              <button onClick={() => setSelectedSolicitud(null)} className="text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nombre</label>
                  <p className="text-sm text-slate-100 bg-[#0f172a] p-2.5 rounded border border-darkBorder">{selectedSolicitud.nombre}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">URL</label>
                  <p className="text-sm text-slate-100 bg-[#0f172a] p-2.5 rounded border border-darkBorder truncate">{selectedSolicitud.url || 'No especificada'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Correo de Contacto</label>
                  <p className="text-sm text-slate-100 bg-[#0f172a] p-2.5 rounded border border-darkBorder">{selectedSolicitud.correo}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Modelo de Aceleraci³n</label>
                  <p className="text-sm text-slate-100 bg-[#0f172a] p-2.5 rounded border border-darkBorder">{selectedSolicitud.modeloAceleracion || 'No especificado'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Etapa Objetivo</label>
                  <p className="text-sm text-slate-100 bg-[#0f172a] p-2.5 rounded border border-darkBorder">{selectedSolicitud.etapaObjetivo || 'No especificada'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Ubicaci³n</label>
                  <p className="text-sm text-slate-100 bg-[#0f172a] p-2.5 rounded border border-darkBorder">{selectedSolicitud.ubicacion || 'No especificada'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Descripci³n</label>
                  <p className="text-sm text-slate-100 bg-[#0f172a] p-3 rounded border border-darkBorder min-h-[80px]">{selectedSolicitud.descripcion || 'Sin descripci³n'}</p>
                </div>
              </div>

              {selectedSolicitud.mentores && selectedSolicitud.mentores.length > 0 && (
                <div className="mt-6 border-t border-darkBorder pt-4">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Mentores</h3>
                  <div className="grid gap-3">
                    {selectedSolicitud.mentores.map((mentor, idx) => (
                      <div key={idx} className="flex flex-col bg-[#0f172a] p-3 rounded border border-darkBorder">
                        <span className="text-sm text-white font-medium">{mentor.nombre}</span>
                        <span className="text-xs text-slate-400">{mentor.funcion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSolicitud.servicios && selectedSolicitud.servicios.length > 0 && (
                <div className="mt-6 border-t border-darkBorder pt-4">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Servicios</h3>
                  <div className="grid gap-3">
                    {selectedSolicitud.servicios.map((servicio, idx) => (
                      <div key={idx} className="flex flex-col bg-[#0f172a] p-3 rounded border border-darkBorder">
                        <span className="text-sm text-white font-medium">{servicio.nombre}</span>
                        <span className="text-xs text-slate-400">{servicio.descripcion} - {servicio.duracion} - Inversi³n: {servicio.inversion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-darkBorder bg-darkSurface/80 flex justify-end gap-3 sticky bottom-0">
              <button 
                onClick={() => { denegarSolicitudAceleradora(selectedSolicitud); setSelectedSolicitud(null); }}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Denegar Solicitud
              </button>
              <button 
                onClick={() => { aceptarSolicitudAceleradora(selectedSolicitud); setSelectedSolicitud(null); }}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-lg shadow-primary/20 transition-all"
              >
                Aceptar Aceleradora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SolicitudPendienteAceleradora;



