import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Explorer.css'; // Estilos del mapa SVG y panel de detalle

// ─── Datos Mock ───────────────────────────────────────────────────────────────
// TODO: reemplazar con GET /api/explorer/nodes y /api/explorer/edges

/**
 * Nodos del grafo del ecosistema
 * Cada nodo tiene posición (x, y) en el espacio de coordenadas del SVG (0-100)
 * type: 'startup' | 'investor' | 'accelerator' | 'hub'
 */
const NODES = [
  { id: 1,  name: 'AgroTech CR',    type: 'startup',     sector: 'Agritech',   stage: 'Seed',     x: 42, y: 30 },
  { id: 2,  name: 'MedIA Health',   type: 'startup',     sector: 'Healthtech', stage: 'Serie A',  x: 62, y: 22 },
  { id: 3,  name: 'EduFuturo',      type: 'startup',     sector: 'Edtech',     stage: 'Seed',     x: 30, y: 55 },
  { id: 4,  name: 'FinBridge',      type: 'startup',     sector: 'Fintech',    stage: 'Pre-seed', x: 55, y: 60 },
  { id: 5,  name: 'LogiSmart',      type: 'startup',     sector: 'Logística',  stage: 'Seed',     x: 75, y: 50 },
  { id: 6,  name: 'Fondo Innovar',  type: 'investor',    sector: 'Fintech',    stage: null,       x: 48, y: 15 },
  { id: 7,  name: 'AngelCR',        type: 'investor',    sector: 'General',    stage: null,       x: 20, y: 35 },
  { id: 8,  name: 'StartupLab CCA', type: 'accelerator', sector: 'General',    stage: null,       x: 35, y: 20 },
  { id: 9,  name: 'INCAE Hub',      type: 'hub',         sector: 'General',    stage: null,       x: 68, y: 70 },
  { id: 10, name: 'TechVentures',   type: 'investor',    sector: 'Fintech',    stage: null,       x: 80, y: 28 },
  { id: 11, name: 'GreenAccel',     type: 'accelerator', sector: 'Agritech',   stage: null,       x: 22, y: 68 },
  { id: 12, name: 'HealthHub CR',   type: 'hub',         sector: 'Healthtech', stage: null,       x: 60, y: 80 },
];

/**
 * Aristas del grafo (relaciones entre nodos)
 * type: 'investment' | 'acceleration' | 'mentorship'
 * from/to: IDs de los nodos conectados
 */
const EDGES = [
  { from: 6,  to: 1, type: 'investment'   },
  { from: 6,  to: 2, type: 'investment'   },
  { from: 7,  to: 3, type: 'investment'   },
  { from: 7,  to: 1, type: 'investment'   },
  { from: 10, to: 2, type: 'investment'   },
  { from: 10, to: 5, type: 'investment'   },
  { from: 8,  to: 1, type: 'acceleration' },
  { from: 8,  to: 4, type: 'acceleration' },
  { from: 11, to: 1, type: 'acceleration' },
  { from: 11, to: 3, type: 'acceleration' },
  { from: 9,  to: 5, type: 'mentorship'   },
  { from: 12, to: 2, type: 'mentorship'   },
];

/**
 * Colores visuales por tipo de nodo
 * fill: color del círculo | glow: halo semitransparente | label: nombre visible en filtros
 */
const NODE_COLORS = {
  startup:     { fill: '#0055ff', glow: 'rgba(0,85,255,0.4)',   label: 'Startup'     },
  investor:    { fill: '#7c3aed', glow: 'rgba(124,58,237,0.4)', label: 'Inversor'    },
  accelerator: { fill: '#059669', glow: 'rgba(5,150,105,0.4)',  label: 'Aceleradora' },
  hub:         { fill: '#d97706', glow: 'rgba(217,119,6,0.4)',  label: 'Hub'         },
};

/**
 * Colores de arista por tipo de relación
 * investment: amarillo | acceleration: verde | mentorship: azul
 */
const EDGE_COLORS = {
  investment:   '#f59e0b',
  acceleration: '#34d399',
  mentorship:   '#00aaff',
};

/** Opciones del filtro de tipo de nodo (incluye "Todos" como primer elemento) */
const TYPES = ['Todos', 'startup', 'investor', 'accelerator', 'hub'];

/**
 * ExplorerView — Mapa interactivo del ecosistema emprendedor
 *
 * Muestra un grafo SVG con:
 * - Nodos: entidades del ecosistema (startups, inversores, aceleradoras, hubs)
 * - Aristas: relaciones entre entidades (inversión, aceleración, mentoría)
 * - Grid de fondo decorativo (patrón SVG)
 * - Efecto de glow (filtro SVG feGaussianBlur) en todos los nodos
 *
 * Controles:
 * - Buscador: filtra nodos por nombre en tiempo real
 * - Pills de tipo: filtra nodos por categoría
 * - Click en nodo: abre panel lateral de detalle con link al perfil completo
 *
 * Los nodos filtrados también ocultan las aristas cuyos dos extremos no aparecen.
 *
 * Estado:
 * - selectedNode: nodo actualmente seleccionado (null = ninguno)
 * - filterType:   tipo seleccionado para filtrar ('Todos' por defecto)
 * - filterSector: sector seleccionado (no expuesto en UI aún)
 * - searchQuery:  texto del buscador
 */
const ExplorerView = () => {
  const [selectedNode, setSelectedNode] = useState(null);   // Nodo seleccionado en el mapa
  const [filterType,   setFilterType]   = useState('Todos'); // Filtro por tipo de entidad
  const [filterSector, setFilterSector] = useState('Todos'); // Filtro por sector (futuro)
  const [searchQuery,  setSearchQuery]  = useState('');      // Texto de búsqueda

  // Filtra nodos según tipo, sector y nombre
  const filteredNodes = NODES.filter(n => {
    if (filterType   !== 'Todos' && n.type   !== filterType)   return false;
    if (filterSector !== 'Todos' && n.sector !== filterSector) return false;
    if (searchQuery && !n.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Set de IDs de nodos visibles para filtrar aristas eficientemente
  const filteredIds  = new Set(filteredNodes.map(n => n.id));
  // Solo muestra aristas cuyos dos extremos están visibles
  const visibleEdges = EDGES.filter(e => filteredIds.has(e.from) && filteredIds.has(e.to));
  // Helper para buscar un nodo por ID
  const getNode      = id => NODES.find(n => n.id === id);

  /**
   * Genera la ruta del perfil según el tipo de nodo
   * hubs no tienen perfil propio, retornan '#'
   */
  const profilePath = node => {
    if (node.type === 'startup')     return `/startup/${node.name.toLowerCase().replace(/ /g, '-')}`;
    if (node.type === 'investor')    return `/investor/${node.name.toLowerCase().replace(/ /g, '-')}`;
    if (node.type === 'accelerator') return `/accelerator/${node.name.toLowerCase().replace(/ /g, '-')}`;
    return '#'; // hubs no tienen ruta de perfil definida aún
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>

      {/* ── ÁREA DEL MAPA SVG ───────────────────────────────────────────── */}
      <div className="ex-map-wrap" style={{ position: 'relative' }}>

        {/* ── Controles flotantes sobre el mapa ── */}
        <div className="ex-floating-controls">
          {/* Buscador de nodos */}
          <div className="ex-search-wrap" style={{ marginBottom: '1rem' }}>
            <span className="ex-search-icon">🔍</span>
            <input
              className="ex-search"
              placeholder="Buscar entidad..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Pills de filtro por tipo — uno activo a la vez */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {TYPES.map(t => (
              <button
                key={t}
                className={`ex-pill ${filterType === t ? 'active' : ''}`}
                onClick={() => setFilterType(t)}
              >
                {/* Muestra etiqueta amigable para tipos distintos de 'Todos' */}
                {t === 'Todos' ? 'Todos' : NODE_COLORS[t]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── SVG del grafo ── */}
        {/* viewBox 0 0 100 100 para usar % como coordenadas de los nodos */}
        <svg className="ex-map-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Patrón de grid de fondo decorativo */}
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.2"/>
            </pattern>
            {/* Filtro de glow aplicado a todos los nodos */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Fondo con patrón de grid */}
          <rect width="100" height="100" fill="url(#grid)"/>

          {/* ── ARISTAS ─── renderizadas antes de los nodos para quedar debajo */}
          {visibleEdges.map((e, i) => {
            const from = getNode(e.from);
            const to   = getNode(e.to);
            if (!from || !to) return null;
            return (
              <line key={i}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={EDGE_COLORS[e.type]}
                strokeWidth="0.25"
                strokeOpacity="0.45"
                // mentorship usa línea punteada para diferenciarse visualmente
                strokeDasharray={e.type === 'mentorship' ? '1,1' : 'none'}
              />
            );
          })}

          {/* ── NODOS ─── cada uno es un grupo clickeable */}
          {filteredNodes.map(n => {
            const color      = NODE_COLORS[n.type];
            const isSelected = selectedNode?.id === n.id;
            // Inversores y aceleradoras son ligeramente más grandes que startups
            const size       = n.type === 'investor' || n.type === 'accelerator' ? 2.8 : 2.2;
            return (
              <g key={n.id} onClick={() => setSelectedNode(n)} style={{ cursor: 'pointer' }}>
                {/* Halo de glow (más grande cuando está seleccionado) */}
                <circle cx={n.x} cy={n.y} r={isSelected ? size + 2 : size + 0.8} fill={color.glow} opacity={isSelected ? 0.9 : 0.5} />
                {/* Círculo principal del nodo (borde blanco si está seleccionado) */}
                <circle cx={n.x} cy={n.y} r={size} fill={color.fill} filter="url(#glow)" stroke={isSelected ? '#ffffff' : 'transparent'} strokeWidth="0.4" />
                {/* Etiqueta del nodo debajo del círculo */}
                <text x={n.x} y={n.y + size + 2} textAnchor="middle" fontSize="2" fill="rgba(255,255,255,0.7)" style={{ pointerEvents: 'none' }}>
                  {n.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Contador de nodos y conexiones visibles */}
        <div className="ex-map-badge">
          <span>{filteredNodes.length} nodos · {visibleEdges.length} conexiones</span>
        </div>
      </div>

      {/* ── PANEL DE DETALLE LATERAL ─────────────────────────────────────── */}
      {/* Se desliza con clase 'open' cuando hay un nodo seleccionado */}
      <aside className={`ex-detail ${selectedNode ? 'open' : ''}`}>
        {selectedNode ? (
          <>
            <div className="ex-detail-header">
              {/* Avatar con color del tipo de nodo e inicial del nombre */}
              <div className="ex-detail-icon" style={{ background: NODE_COLORS[selectedNode.type]?.fill }}>
                {selectedNode.name.charAt(0)}
              </div>
              <div>
                <h2 className="ex-detail-name">{selectedNode.name}</h2>
                <span className="ex-detail-type" style={{ color: NODE_COLORS[selectedNode.type]?.fill }}>
                  {NODE_COLORS[selectedNode.type]?.label}
                </span>
              </div>
              {/* Cierra el panel y deselecciona el nodo */}
              <button className="ex-detail-close" onClick={() => setSelectedNode(null)}>✕</button>
            </div>
            <div className="ex-detail-body">
              <div className="ex-detail-row">
                <span className="ex-detail-key">Sector</span>
                <span className="ex-detail-val">{selectedNode.sector}</span>
              </div>
              {/* Enlace al perfil completo de la entidad */}
              <Link
                to={profilePath(selectedNode)}
                className="ep-action-primary"
                style={{ marginTop: '1rem', display: 'block', textAlign: 'center', textDecoration: 'none' }}
              >
                🔍 Ver Perfil Completo
              </Link>
            </div>
          </>
        ) : (
          /* Estado vacío cuando no hay nodo seleccionado */
          <div className="ex-detail-empty">
            <span>🖱️</span>
            <p>Selecciona un nodo</p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default ExplorerView;
