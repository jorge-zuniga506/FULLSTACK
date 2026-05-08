import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function HeaderSolicitudes() {
    const navigate = useNavigate();
    return (
        <header className="header d-flex justify-content-between align-items-center px-4 py-3">
            <div className="d-flex align-items-center gap-3">
                <div className="logo-box">🚀</div>
                <h5 className="mb-0 fw-bold">StartupHub Admin</h5>
            </div>
            <Button variant="outline-light" size="sm" onClick={() => navigate('/')}>Cerrar Sesión</Button>
        </header>
    );
}
