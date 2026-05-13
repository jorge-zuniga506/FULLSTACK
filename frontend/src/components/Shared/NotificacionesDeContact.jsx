import React, { useState, useEffect } from 'react'
import Services from '../../services/Services'
import Sidebar from './Sidebar'
import Notificaciones from '../../pages/Notificaciones'

function NotificacionesDeContact() {
  const [mensajesContactanos, setMensajesContactanos] = useState([])
  const [selectedMensaje, setSelectedMensaje] = useState(null)

  useEffect(() => {
    async function obtenerMensajesContactanos() {
      const data = await Services.getMensajesContactanos()
      setMensajesContactanos(data)
    }
    obtenerMensajesContactanos()
  }, [])




  function denegarMensaje(mensaje) {
    Services.deleteMensajesContactanos(mensaje.id)
    setMensajesContactanos(prev => prev.filter(m => m.id !== mensaje.id))
  }

  return (
    <div className="dark bg-[#0f172a] text-slate-100 min-h-screen flex flex-col">

      <header className="flex items-center justify-between whitespace-nowrap border-b border-darkBorder px-6 md:px-10 py-4 bg-darkSurface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="d-flex align-items-center gap-2">
            <div className="logo-box">âš¡</div>
            <span className="logo-text">
              Nexxus<span className="text-primary">Cobalt</span>
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-darkBorder bg-darkSurface/30 hidden md:flex flex-col p-6 overflow-y-auto">
          <nav className="flex flex-col gap-2">
            <a className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-100 hover:bg-darkSurface rounded-lg transition-colors text-sm font-medium" href="/DashboardAdmin">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              Dashboard
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-primary bg-primary/10 rounded-lg transition-colors text-sm font-medium" href="/PaginaSolicitudPendienteAceleradora">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
              Mensajes de Contacto
            </a>
            <div className="my-4 border-t border-darkBorder"></div>
            <a className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-100 hover:bg-darkSurface rounded-lg transition-colors text-sm font-medium" href="/">
              <span className="material-symbols-outlined text-[20px]">start</span>
              Inicio
            </a>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-slate-100 text-3xl font-bold leading-tight tracking-[-0.033em] font-display">Mensajes</h1>
                <p className="text-slate-400 text-base mt-1">Mensajes Pendientes</p>
              </div>
            </div>

            <div className="bg-darkSurface/50 border border-darkBorder rounded-lg overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-darkBorder bg-darkSurface">
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300 w-1/3">Nombre</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300">Detalles</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300">Rol</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-300">Mensaje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-darkBorder">
                  {mensajesContactanos.map(mensaje => (
                    <tr key={mensaje.id} className="hover:bg-darkSurface/30 transition-colors cursor-pointer" onClick={() => setSelectedMensaje(mensaje)}>
                      <td className="py-4 px-6 text-sm text-slate-200">{mensaje.nombre}</td>
                      <td className="py-4 px-6 text-sm text-slate-300">{mensaje.asunto}</td>
                      <td className="py-4 px-6 text-sm text-slate-300">{mensaje.rol === "1" ? "Inversor" : mensaje.rol === "2" ? "Startup" : mensaje.rol === "3" ? "Aceleradora" : "Desconocido"}</td>
                      <td className="py-4 px-6 text-sm text-slate-300">{mensaje.mensaje}</td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>

            <footer className="mt-10 py-6 text-center text-slate-500 text-sm border-t border-darkBorder">
              © 2026 NexxusCobalt. Todos los derechos reservados.
            </footer>
          </div>
        </main>
      </div>



    </div>
  )
}

export default NotificacionesDeContact



