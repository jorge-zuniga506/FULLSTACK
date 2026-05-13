import React from 'react'

function Sidebar() {
    return (
        <div>
            <div className="sidebar border-end" style={{position: "fixed"}}>
            <i className='nav-icon cil-bolt'></i>Panel Administrador
            <ul className="sidebar-nav">
                <li className="nav-item">
                    <a className="nav-link active" href="/DashboardAdmin">
                        <i className="nav-icon cil-home"></i> Dashboard
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/GestionarUsuarios">
                        <i className="nav-icon cil-user"></i> Usuarios
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/SolicitudesPendientes">
                        <i className="nav-icon cil-description"></i> Solicitudes Startups
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/SolicitudesPendientesAceleradoras">
                        <i className="nav-icon cil-description"></i> Solicitudes Aceleradoras
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">
                        <i className="nav-icon cil-list"></i> Registros
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="">
                        <i className="nav-icon cil-settings"></i> Ajustes
                    </a>
                </li>

            </ul>
            <div className="sidebar-footer border-top d-flex">
                <p>Santiago Porras</p>
                <p>Administrador</p>
            </div>
        </div>
        </div>
    )
}

export default Sidebar