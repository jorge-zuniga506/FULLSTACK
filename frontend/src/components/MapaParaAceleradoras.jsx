import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// Importación de assets (asegúrate de que las rutas sean correctas)
import ficha from '../images/iconoMapa.jpg';
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import Services from '../services/Services';
import '../styles/MapaAceleradoras.css';

function MapaParaAceleradoras() {
    const [startups, setStartups] = useState([]);
    const [buscador, setBuscador] = useState("");
    const [sector, setSector] = useState("");
    const [etapa, setEtapa] = useState("");
    const [modelo, setModelo] = useState("");
    const [region, setRegion] = useState("");
    const [año, setAño] = useState("");
    const [brillo, setBrillo] = useState("brightness(100%)");
    const navigate = useNavigate();
    useEffect(() => {
        async function getStartups() {
            const response = await Services.getStartups();
            setStartups(response);
        }
        getStartups();
    }, []);

    const redIcon = new L.Icon({
        iconUrl: ficha,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    function ChangeBright({ filter }) {
        const map = useMap();
        useEffect(() => {
            map.getContainer().style.filter = filter;
        }, [filter, map]);
        return null;
    }

    const clearFilters = () => {
        setBuscador('');
        setSector('');
        setEtapa('');
        setModelo('');
        setRegion('');
        setAño('');
    };
    const verMas = () => {
        navigate('/PublicoStartups');
    }
    return (
        <div className="map-layout-wrapper">
            <header className="main-header">
                <div className="flex items-center gap-2">
                    <div className="d-flex align-items-center gap-2">
                        <div className="d-flex align-items-center gap-2">
                            <div className="logo-box">⚡</div>
                            <span className="logo-text">
                                Nexxus<span className="text-primary">Cobalt</span>
                            </span>
                        </div>
                    </div> <span><Link to="/">Inicio</Link></span> <span><Link to="/PerfilPrivadoAceleradora">Perfil</Link></span>
                </div>

                <div className="relative">
                    <input
                        className="search-input"
                        placeholder='Buscar por nombre, sector o tecnología...'
                        type="text"
                        value={buscador}
                        onChange={(e) => setBuscador(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setBrillo('brightness(50%)')}
                        className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                        title="Modo Noche"
                    >
                        <span className="material-symbols-outlined text-sm">dark_mode</span>
                    </button>
                    <button
                        onClick={() => setBrillo('brightness(100%)')}
                        className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
                        title="Modo Día"
                    >
                        <span className="material-symbols-outlined text-sm">light_mode</span>
                    </button>
                </div>
            </header>

            <div className="content-body">
                <aside className="filters-sidebar">
                    <h2>Filtros</h2>

                    <FilterGroup title="Sector">
                        {['Fintech', 'Healthtech', 'Edtech', 'SaaS', 'E-commerce', 'Social', 'AI', 'Otros'].map((s, i) => (
                            <label key={s}>
                                <input
                                    type="radio"
                                    name="sector"
                                    checked={sector === (i + 1).toString()}
                                    value={i + 1}
                                    onChange={(e) => setSector(e.target.value)}
                                />
                                {s}
                            </label>
                        ))}
                    </FilterGroup>

                    <FilterGroup title="Etapa">
                        {['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth', 'Public'].map((e, i) => (
                            <label key={e}>
                                <input
                                    type="radio"
                                    name="etapa"
                                    checked={etapa === (i + 9).toString()}
                                    value={i + 9}
                                    onChange={(e) => setEtapa(e.target.value)}
                                />
                                {e}
                            </label>
                        ))}
                    </FilterGroup>

                    <FilterGroup title="Ubicación">
                        <select
                            className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-sm outline-none"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        >
                            <option value="">Todas las regiones</option>
                            <option value="america">América</option>
                            <option value="europa">Europa</option>
                            <option value="asia">Asia</option>
                        </select>
                    </FilterGroup>

                    <FilterGroup title={`Año de Fundación: ${año}`}>
                        <input
                            type="range"
                            min={2010}
                            max={2025}
                            value={año || 2010}
                            className="w-full accent-blue-500"
                            onChange={(e) => setAño(e.target.value)}
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>2010</span><span>2025</span>
                        </div>
                    </FilterGroup>

                    <button className="reset-btn" onClick={clearFilters}>
                        Eliminar Filtros
                    </button>
                </aside>

                <main className="map-container-view">
                    <MapContainer
                        center={[9.9281, -84.0907]}
                        zoom={3}
                        scrollWheelZoom={true}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <ChangeBright filter={brillo} />
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {startups
                            .filter(s => !buscador || s.nombre?.toLowerCase().includes(buscador.toLowerCase()))
                            .filter(s => !sector || s.sector?.toString() === sector)
                            .filter(s => !etapa || s.etapa?.toString() === etapa)
                            .filter(s => !region || s.region === region)
                            .filter(s => !año || s.año?.toString() === año.toString())
                            .map((s, i) => {
                                const lat = parseFloat(s.latitud);
                                const lng = parseFloat(s.longitud);
                                if (isNaN(lat) || isNaN(lng)) return null;

                                return (
                                    <Marker key={s.id || i} position={[lat, lng]} icon={redIcon}>
                                        <Popup>
                                            <div className="p-1">
                                                <h4 className="font-bold text-blue-400">{s.nombre}</h4>
                                                <p className="text-xs mt-1 text-slate-300">{s.descripcion || "Startup innovadora"}</p>
                                                <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between">
                                                    <span className="text-[9px] uppercase font-bold text-slate-500">Fundada: {s.año}</span>
                                                    <span className="text-[9px] uppercase font-bold text-blue-500"><button onClick={verMas}>Ver más</button></span>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })
                        }
                    </MapContainer>
                </main>
            </div>
        </div>
    );
}
const FilterGroup = ({ title, children }) => (
    <div className="mb-6">
        <h3>{title}</h3>
        <div className="filter-group">{children}</div>
    </div>
);
export default MapaParaAceleradoras
