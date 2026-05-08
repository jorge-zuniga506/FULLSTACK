import React, { useState, useEffect } from 'react';
import Services from '../services/Services';
import '../styles/BuscadorAceleradoras.scss';
import { useNavigate } from 'react-router-dom';
function BuscadorDeAceleradoras() {
    const [buscador, setBuscador] = useState("");
    const [sector, setSector] = useState('');
    const [organizacion, setOrganizacion] = useState('');
    const [financiacion, setFinanciacion] = useState('');
    const [alcance, setAlcance] = useState('');
    const [etapa, setEtapa] = useState('');
    const [aceleradoras, setAceleradoras] = useState([]);
    const navigate = useNavigate();

    const irPerfil = () => {
        navigate('/PerfilPrivadoStartup');
    }
    const irPerfilAceleradora = () => {
        navigate('/PublicoAceleradoras');
    }
    useEffect(() => {
        async function getAceleradoras() {
            const response = await Services.getAceleradoras();
            setAceleradoras(response);
        }
        getAceleradoras();
    }, []);

    const limpiarFiltros = () => {
        setBuscador('');
        setSector('');
        setOrganizacion('');
        setFinanciacion('');
        setAlcance('');
        setEtapa('');
    };

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar">
                <div className="brand">
                    <div className="d-flex align-items-center gap-2">
                        <div className="logo-box">⚡</div>
                        <span className="logo-text">
                            Nexxus<span className="text-primary">Cobalt</span>
                        </span>
                    </div>
                </div>

                <nav className="nav-menu">
                    <div className="nav-item active">
                        <span className="material-symbols-outlined">explore</span>
                        <span>Aceleradoras</span>
                    </div>
                    <div className="nav-item">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span><button onClick={irPerfil}>Perfil</button></span>
                    </div>
                </nav>
            </aside>
            <main className="main-content">
                <header className="top-header">
                    <h2 className="page-title">Aceleradoras</h2>
                    <div className="search-box">
                        <span className="material-symbols-outlined search-icon">search</span>
                        <input
                            type="text"
                            placeholder="Buscar programas..."
                            value={buscador}
                            onChange={(e) => setBuscador(e.target.value)}
                        />
                    </div>
                </header>

                <div className="scrollable-area">
                    <section className="welcome-hero">
                        <h1>Programas Destacados</h1>
                        <p>Encuentra el impulso que tu startup necesita. Filtra entre las mejores aceleradoras globales.</p>
                    </section>

                    <div className="filters-bar">
                        <button className="btn-all" onClick={limpiarFiltros}>Todos</button>

                        <div className="select-wrapper">
                            <select value={sector} onChange={(e) => setSector(e.target.value)}>
                                <option value="">Sector</option>
                                <option value="1">Generales</option>
                                <option value="2">Verticales</option>
                                <option value="3">Impacto Social</option>
                            </select>
                        </div>

                        <div className="select-wrapper">
                            <select value={organizacion} onChange={(e) => setOrganizacion(e.target.value)}>
                                <option value="">Organización</option>
                                <option value="4">Corporativas</option>
                                <option value="5">Públicas</option>
                                <option value="6">Privadas</option>
                            </select>
                        </div>

                        <div className="select-wrapper">
                            <select value={financiacion} onChange={(e) => setFinanciacion(e.target.value)}>
                                <option value="">Financiación</option>
                                <option value="7">Equity-based</option>
                                <option value="8">Equity-Free</option>
                            </select>
                        </div>
                    </div>

                    <div className="accelerators-grid">
                        {aceleradoras
                            .filter(s => !buscador || s.nombre?.toLowerCase().includes(buscador.toLowerCase()))
                            .filter(a => !sector || a.sector === sector)
                            .filter(a => !organizacion || a.organizacion === organizacion)
                            .filter(a => !financiacion || a.financiacion === financiacion)
                            .filter(a => !alcance || a.alcance === alcance)
                            .filter(a => !etapa || a.etapa === etapa)
                            .map((aceleradora) => (
                                <div className="card" key={aceleradora.id}>
                                    <div className="card-image" style={{ backgroundImage: `url(${aceleradora.logotipo})` }}>
                                        <div className="card-overlay">
                                            <button onClick={irPerfilAceleradora}>
                                                <h3 className='text-white'>{aceleradora.nombre}</h3>
                                            </button>
                                            <p>{aceleradora.descripcion}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </main>
        </div>
    );
}

export default BuscadorDeAceleradoras;