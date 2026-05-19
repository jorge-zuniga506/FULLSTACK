import React from 'react';

/**
 * MiniGraph — Visualización SVG de la red local de una entidad
 *
 * Renderiza un grafo simple donde:
 * - El nodo CENTRAL representa a la entidad del perfil actual
 * - Los nodos EXTERNOS representan sus conexiones directas
 * - Las ARISTAS muestran el tipo de relación con distintos colores y estilos
 *
 * Los nodos externos se distribuyen automáticamente en círculo alrededor
 * del nodo central usando trigonometría (ángulo uniforme por nodo).
 *
 * Colores de aristas por tipo de relación:
 *   investment:   amarillo (#f59e0b)
 *   acceleration: verde    (#34d399)
 *   mentorship:   azul     (#00aaff) — línea punteada
 *   service:      morado   (#a78bfa)
 *   alliance:     rosa     (#fb7185)
 *
 * @param {string}   centerLabel  - Nombre de la entidad central
 * @param {string}   centerColor  - Color hex del nodo central
 * @param {Array}    connections  - Lista de conexiones:
 *   { id, label, type, color, relType }
 */
const MiniGraph = ({ centerLabel, centerColor = '#0055ff', connections = [] }) => {
  // Coordenadas del centro del SVG (viewBox 400x280)
  const cx = 200, cy = 140;
  // Radio del círculo en que se distribuyen los nodos externos
  const radius = 100;

  // Calcula la posición (x, y) de cada nodo externo en el círculo
  // Empieza desde -π/2 (arriba) para que el primer nodo quede en la parte superior
  const nodes = connections.map((c, i) => {
    const angle = (i / connections.length) * 2 * Math.PI - Math.PI / 2;
    return {
      ...c,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  // Colores de arista por tipo de relación
  const edgeColors = {
    investment:   '#f59e0b', // amarillo dorado
    acceleration: '#34d399', // verde esmeralda
    mentorship:   '#00aaff', // azul (línea punteada)
    service:      '#a78bfa', // lavanda
    alliance:     '#fb7185', // rosa
  };

  return (
    <div className="ep-mini-graph">
      <svg viewBox="0 0 400 280" className="ep-mini-svg">
        <defs>
          {/* Gradiente radial para el glow del nodo central */}
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={centerColor} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={centerColor} stopOpacity="0"/>
          </radialGradient>

          {/* Filtro de glow aplicado a todos los nodos */}
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Halo de glow alrededor del nodo central */}
        <circle cx={cx} cy={cy} r="55" fill="url(#centerGlow)" />

        {/* ── ARISTAS ─────────────────────────────────────────────────────
            Una línea por cada conexión. mentorship usa strokeDasharray
            para representarse como línea punteada. */}
        {nodes.map((n, i) => (
          <line key={i}
            x1={cx} y1={cy} x2={n.x} y2={n.y}
            stroke={edgeColors[n.relType] || '#ffffff'}
            strokeWidth="1.2"
            strokeOpacity="0.4"
            strokeDasharray={n.relType === 'mentorship' ? '4,4' : 'none'}
          />
        ))}

        {/* ── NODOS EXTERNOS ──────────────────────────────────────────────
            Círculo relleno + inicial del nombre + etiqueta truncada */}
        {nodes.map((n, i) => (
          <g key={i} style={{ cursor: 'pointer' }}>
            {/* Círculo del nodo externo con color de la conexión */}
            <circle cx={n.x} cy={n.y} r="16" fill={n.color || '#333'} opacity="0.85" filter="url(#nodeGlow)"/>
            {/* Inicial centrada dentro del nodo */}
            <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#fff" style={{ pointerEvents: 'none', userSelect: 'none' }}>
              {n.label.charAt(0)}
            </text>
            {/* Etiqueta debajo del nodo, truncada a 12 caracteres */}
            <text x={n.x} y={n.y + 24} textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.55)" style={{ pointerEvents: 'none', userSelect: 'none' }}>
              {n.label.length > 12 ? n.label.slice(0, 12) + '…' : n.label}
            </text>
          </g>
        ))}

        {/* ── NODO CENTRAL ────────────────────────────────────────────────
            Más grande, con doble círculo (fill + stroke) para destacar */}
        <circle cx={cx} cy={cy} r="26" fill={centerColor} filter="url(#nodeGlow)"/>
        <circle cx={cx} cy={cy} r="26" fill="none" stroke={centerColor} strokeWidth="2" strokeOpacity="0.5"/>
        {/* Muestra las primeras 3 letras en mayúscula como abreviatura */}
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="bold" fill="#fff" style={{ pointerEvents: 'none', userSelect: 'none' }}>
          {centerLabel.slice(0, 3).toUpperCase()}
        </text>
      </svg>

      {/* ── LEYENDA ─────────────────────────────────────────────────────────
          Muestra solo los tipos de relación presentes en las conexiones */}
      <div className="ep-graph-legend">
        {Object.entries(edgeColors)
          .filter(([k]) => connections.some(c => c.relType === k))
          .map(([k, c]) => (
            <span key={k} className="ep-graph-leg-item">
              {/* Línea de color representando el tipo de arista */}
              <span className="ep-graph-leg-line" style={{ background: c }}></span>
              {k}
            </span>
          ))}
      </div>
    </div>
  );
};

export default MiniGraph;
