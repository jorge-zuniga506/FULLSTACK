import React from 'react'

function SidebarStartup() {
  return (
    <div className="sidebar startup-sidebar" style={{ position: "fixed" }}>
      
      <div className="sidebar-header">
        <i className='nav-icon cil-bolt'></i>
        <span>Panel Startup</span>
      </div>

      <ul className="sidebar-nav">
        <li className="nav-item">
          <a className="nav-link active" href="/PerfilPrivadoStartup">
            <i className="nav-icon cil-home"></i> Perfil Privado
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/AceleradorasBuscador">
            <i className="nav-icon cil-user"></i> Aceleradoras
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="#">
            <i className="nav-icon cil-description"></i> Inversores
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="#">
            <i className="nav-icon cil-settings"></i> Ajustes
          </a>
        </li>
      </ul>

      <div className="sidebar-footer">
        <p>Gabriel Bolanos</p>
        <span>Startup</span>
      </div>
      
    </div>
  )
}

export default SidebarStartup
