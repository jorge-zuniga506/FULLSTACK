import React, { useState, useEffect } from 'react';
import Services from '../../services/Services';
import '../../styles/SolicitudesPendientes.css';


function SolicitudesPendientes() {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    async function obtenerSolicitudes() {
      const data = await Services.getSolicitudes();
      setSolicitudes(data || []);
    }
    obtenerSolicitudes();
  }, []);

  async function aceptarSolicitud(solicitudStartup) {
    await Services.deleteSolicitudes(solicitudStartup.id);

    const objStartup = {
      nombre: solicitudStartup.nombre,
      miembros: solicitudStartup.miembros,
      url: solicitudStartup.url,
      region: solicitudStartup.region,
      latitud: solicitudStartup.latitud,
      longitud: solicitudStartup.longitud,
      ano: solicitudStartup.ano,
      correo: solicitudStartup.correo,
      contrasena: solicitudStartup.contrasena,
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
    setSolicitudes(prev => prev.filter(s => s.id !== solicitudStartup.id));
  };

  const denegarSolicitud = async (solicitudStartup) => {
    await Services.deleteSolicitudes(solicitudStartup.id);
    setSolicitudes(prev => prev.filter(s => s.id !== solicitudStartup.id));
  };

  const getRoundBadgeClass = (pitch) => {
    const p = pitch?.toLowerCase() || '';
    if (p.includes('pre-seed')) return 'badge-preseed';
    if (p.includes('seed')) return 'badge-seed';
    if (p.includes('a')) return 'badge-seriesa';
    return 'badge-bootstrapped';
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
            <a className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-100 hover:bg-darkSurface rounded-custom transition-colors text-sm font-medium" href="/SolicitudesPendientesAceleradoras">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
              Aceleradoras
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-primary bg-primary/10 rounded-custom transition-colors text-sm font-medium" href="/SolicitudesPendientes">
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
                <h1 className="text-slate-100 text-3xl font-bold leading-tight tracking-[-0.033em] font-display">Solicitudes Startups</h1>
                <p className="text-slate-400 text-base mt-1">Revisar y gestionar las solicitudes de nuevas empresas emergentes.</p>
              </div>
            </div>

            <div className="bg-darkSurface/50 border border-darkBorder rounded-custom overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-darkBorder bg-darkSurface">
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300 w-1/3">Nombre de la compan­a</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300">ID / Detalles</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300">Pitch</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-darkBorder">
                  {solicitudes.length > 0 ? solicitudes.map((solicitud) => (
                    <tr key={solicitud.id} className="hover:bg-darkSurface/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-100 text-base">{solicitud.nombre}</div>
                        <div className="text-sm text-slate-400 mt-0.5 truncate max-w-xs">{solicitud.descripcion}</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-300">
                        <div className="mb-1">ID: #{solicitud.id}</div>
                        <button
                          className="text-primary hover:text-primary-light text-xs font-medium flex items-center gap-1"
                          data-bs-toggle="modal"
                          data-bs-target={`#modal-${solicitud.id}`}
                        >
                          <span className="material-symbols-outlined text-xs">visibility</span>
                          Ver detalles
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`badge ${getRoundBadgeClass(solicitud.pitch)}`}>
                          {solicitud.pitch || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => denegarSolicitud(solicitud)}
                            className="px-4 py-2 text-sm font-medium text-slate-300 border border-darkBorder bg-darkBg hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 rounded-custom transition-all"
                          >
                            Denegar
                          </button>
                          <button
                            onClick={() => aceptarSolicitud(solicitud)}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-custom transition-all shadow-lg shadow-primary/20"
                          >
                            Aceptar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="py-10 text-center text-slate-500">
                        No hay solicitudes pendientes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modals for Details */}
            {solicitudes.map((solicitud) => (
              <div key={`modal-${solicitud.id}`} className="modal fade" id={`modal-${solicitud.id}`} tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content bg-darkSurface border border-darkBorder text-slate-100">
                    <div className="modal-header border-b border-darkBorder">
                      <h5 className="modal-title font-bold">Startup Details: {solicitud.nombre}</h5>
                      <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body overflow-y-auto max-h-[75vh] p-6 pt-2">
                      <div className="flex flex-col gap-8">
                        {/* Header Info with Logo */}
                        <div className="flex items-start gap-5 p-4 bg-darkBg/30 border border-darkBorder rounded-xl">
                          <div className="size-24 rounded-xl border border-darkBorder overflow-hidden bg-white/5 flex-shrink-0">
                            {solicitud.logotipo ? (
                              <img src={solicitud.logotipo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <span className="material-symbols-outlined text-4xl">image</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xl font-bold text-slate-100">{solicitud.nombre}</h4>
                            <p className="text-primary text-sm font-medium hover:underline cursor-pointer truncate mt-1">{solicitud.url}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] uppercase tracking-wider font-bold rounded-md border border-slate-700">Ref: #{solicitud.id}</span>
                              <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] uppercase tracking-wider font-bold rounded-md border border-primary/30">{solicitud.modelo}</span>
                              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] uppercase tracking-wider font-bold rounded-md border border-slate-700">Ano: {solicitud.ano}</span>
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Left Column: Context & Metrics */}
                          <div className="space-y-6">
                            <section>
                              <label className="text-[11px] text-slate-500 uppercase font-black tracking-[0.1em] mb-3 block">Informaci³n de Contacto</label>
                              <div className="space-y-3 bg-darkBg/20 p-4 rounded-lg border border-darkBorder/50">
                                <div>
                                  <p className="text-slate-500 text-[11px] mb-0.5">Correo Electr³nico</p>
                                  <p className="text-slate-100 text-sm">{solicitud.correo}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 text-[11px] mb-0.5">Ubicaci³n (Regi³n)</p>
                                  <p className="text-slate-100 text-sm capitalize">{solicitud.region}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-slate-500 text-[11px] mb-0.5">Latitud</p>
                                    <p className="text-slate-100 text-xs font-mono">{solicitud.latitud}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-500 text-[11px] mb-0.5">Longitud</p>
                                    <p className="text-slate-100 text-xs font-mono">{solicitud.longitud}</p>
                                  </div>
                                </div>
                              </div>
                            </section>

                            <section>
                              <label className="text-[11px] text-slate-500 uppercase font-black tracking-[0.1em] mb-3 block">M©tricas Clave</label>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-darkBg/20 p-4 rounded-lg border border-darkBorder/50">
                                  <p className="text-slate-500 text-[11px] mb-0.5">ARR</p>
                                  <p className="text-slate-100 text-lg font-bold">${solicitud.arr}</p>
                                </div>
                                <div className="bg-darkBg/20 p-4 rounded-lg border border-darkBorder/50">
                                  <p className="text-slate-500 text-[11px] mb-0.5">Target Raise</p>
                                  <p className="text-primary text-lg font-bold">${solicitud.raise}</p>
                                </div>
                                <div className="bg-darkBg/20 p-4 rounded-lg border border-darkBorder/50">
                                  <p className="text-slate-500 text-[11px] mb-0.5">Usuarios</p>
                                  <p className="text-slate-100 text-lg font-bold">{solicitud.usuarios}</p>
                                </div>
                                <div className="bg-darkBg/20 p-4 rounded-lg border border-darkBorder/50">
                                  <p className="text-slate-500 text-[11px] mb-0.5">Crecimiento</p>
                                  <p className="text-green-400 text-lg font-bold">{solicitud.crecimiento}</p>
                                </div>
                              </div>
                            </section>
                          </div>

                          {/* Right Column: Classification & Team */}
                          <div className="space-y-6">
                            <section>
                              <label className="text-[11px] text-slate-500 uppercase font-black tracking-[0.1em] mb-3 block">Descripci³n del Proyecto</label>
                              <div className="bg-darkBg/20 p-4 rounded-lg border border-darkBorder/50 h-[120px] overflow-y-auto">
                                <p className="text-slate-200 text-sm leading-relaxed">{solicitud.descripcion}</p>
                              </div>
                            </section>

                            <section>
                              <label className="text-[11px] text-slate-500 uppercase font-black tracking-[0.1em] mb-3 block">Equipo Fundador</label>
                              <div className="grid grid-cols-1 gap-2">
                                {solicitud.miembros?.map((m, idx) => (
                                  <div key={idx} className="bg-darkBg/20 px-4 py-2.5 rounded-lg border border-darkBorder/50 flex items-center justify-between">
                                    <p className="text-slate-100 text-sm font-medium">{m.nombre}</p>
                                    <span className="text-slate-500 text-[10px] uppercase font-bold">{m.funcion}</span>
                                  </div>
                                ))}
                              </div>
                            </section>

                            <section>
                              <label className="text-[11px] text-slate-500 uppercase font-black tracking-[0.1em] mb-3 block">Pitch & Clasificaci³n</label>
                              <div className="bg-darkBg/20 p-4 rounded-lg border border-darkBorder/50 space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-500 text-[11px]">One-liner Pitch:</span>
                                  <span className="text-slate-100 text-xs font-semibold italic">"{solicitud.pitch}"</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-500 text-[11px]">Etapa:</span>
                                  <span className="px-2 py-0.5 bg-slate-800 text-slate-200 text-[10px] font-bold rounded border border-slate-700 uppercase">#{solicitud.etapa}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-500 text-[11px]">Sector:</span>
                                  <span className="px-2 py-0.5 bg-slate-800 text-slate-200 text-[10px] font-bold rounded border border-slate-700 uppercase">ID: {solicitud.sector}</span>
                                </div>
                              </div>
                            </section>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer border-t border-darkBorder">
                      <button type="button" className="px-4 py-2 text-sm font-medium text-slate-300 border border-darkBorder rounded-custom hover:bg-darkBorder transition-all" data-bs-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <footer className="mt-10 py-6 text-center text-slate-500 text-sm border-t border-darkBorder">
              © 2024 Startup Platform Inc. Todos los derechos reservados.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SolicitudesPendientes;




