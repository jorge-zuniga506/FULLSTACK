import React, { useState, useEffect } from 'react';
import Services from '../../services/Services';
import '../../styles/BuscadorAceleradoras.scss';
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
                    <div className="logo-box">âš¡</div>
                    <div>
                        <span className="logo-text">Nexxus<span className="text-primary">Cobalt</span></span>
                        <p className="brand-subtitle">Descubre aceleradoras</p>
                    </div>
                </div>

                <nav className="nav-menu">
                    <div className="nav-item active">
                        <span className="material-symbols-outlined">explore</span>
                        <span>Aceleradoras</span>
                    </div>
                    <div className="nav-item" onClick={irPerfil}>
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Perfil</span>
                    </div>
                </nav>
            </aside>
            <main className="main-content">
                <header className="top-header">
                    <div className="header-copy">
                        <span className="eyebrow">Explora</span>
                        <h2 className="page-title">Aceleradoras</h2>
                        <p>Filtra, compara y descubre programas que lleven tu startup a la siguiente etapa.</p>
                    </div>

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
                        <div className="hero-panel">
                            <div>
                                <p className="hero-label">Programas destacados</p>
                                <h1>Impulsa tu startup con aceleradoras l­deres</h1>
                                <p>Encuentra el apoyo adecuado con las mejores opciones en financiamiento, alcance y etapa de crecimiento.</p>
                            </div>
                            <div className="hero-stats">
                                <div>
                                    <strong>{aceleradoras.length}</strong>
                                    <span>Aceleradoras</span>
                                </div>
                                <div>
                                    <strong>5</strong>
                                    <span>Filtros r¡pidos</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="filters-bar">
                        <button className="btn-all" onClick={limpiarFiltros}>Mostrar todos</button>

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
                                <option value="">Organizaci³n</option>
                                <option value="4">Corporativas</option>
                                <option value="5">Pºblicas</option>
                                <option value="6">Privadas</option>
                            </select>
                        </div>

                        <div className="select-wrapper">
                            <select value={financiacion} onChange={(e) => setFinanciacion(e.target.value)}>
                                <option value="">Financiaci³n</option>
                                <option value="7">Equity-based</option>
                                <option value="8">Equity-Free</option>
                            </select>
                        </div>

                        <div className="select-wrapper">
                            <select value={alcance} onChange={(e) => setAlcance(e.target.value)}>
                                <option value="">Alcance</option>
                                <option value="local">Local</option>
                                <option value="regional">Regional</option>
                                <option value="global">Global</option>
                            </select>
                        </div>

                        <div className="select-wrapper">
                            <select value={etapa} onChange={(e) => setEtapa(e.target.value)}>
                                <option value="">Etapa</option>
                                <option value="semilla">Semilla</option>
                                <option value="crecimiento">Crecimiento</option>
                                <option value="expansion">Expansi³n</option>
                            </select>
                        </div>
                    </div>

                    <div className="accelerators-grid">
                        {aceleradoras
                            .filter((s) => !buscador || s.nombre?.toLowerCase().includes(buscador.toLowerCase()))
                            .filter((a) => !sector || a.sector === sector)
                            .filter((a) => !organizacion || a.organizacion === organizacion)
                            .filter((a) => !financiacion || a.financiacion === financiacion)
                            .filter((a) => !alcance || a.alcance === alcance)
                            .filter((a) => !etapa || a.etapa === etapa)
                            .map((aceleradora) => (
                                <div className="card" key={aceleradora.id}>
                                    <div
                                        className="card-image"
                                        style={{ backgroundImage: `url(${aceleradora.logotipo || ''})` }}
                                    />
                                    <div className="card-content">
                                        <div className="card-head">
                                            <span className="card-pill">{aceleradora.organizacion || 'Aceleradora'}</span>
                                            <button className="card-action" onClick={irPerfilAceleradora}>Ver perfil</button>
                                        </div>
                                        <h3>{aceleradora.nombre}</h3>
                                        <p>{aceleradora.descripcion?.slice(0, 110) || 'Sin descripci³n disponible.'}</p>
                                        <div className="tag-list">
                                            {aceleradora.sector && <span>{aceleradora.sector}</span>}
                                            {aceleradora.financiacion && <span>{aceleradora.financiacion}</span>}
                                            {aceleradora.alcance && <span>{aceleradora.alcance}</span>}
                                            {aceleradora.etapa && <span>{aceleradora.etapa}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default BuscadorDeAceleradoras;



