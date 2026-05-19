import React from 'react';

/**
 * ProfileHero — Sección hero reutilizable para cualquier perfil de entidad
 *
 * Muestra el logo, nombre, tagline, país y tipo de entidad.
 * El color de acento (typeColor) personaliza el badge de tipo y el gradiente
 * del fondo, haciendo que cada tipo de entidad tenga su identidad visual:
 *   - Startup:     #00aaff (azul)
 *   - Inversor:    #7c3aed (violeta)
 *   - Aceleradora: #059669 (verde)
 *
 * Si isOwner === true, muestra el botón "Editar Perfil" y llama a onEdit.
 *
 * @param {string}   logo      - Emoji o texto corto del logo
 * @param {string}   name      - Nombre de la entidad
 * @param {string}   tagline   - Descripción breve / slogan
 * @param {string}   country   - País de origen
 * @param {string}   type      - Tipo de entidad (ej: "Startup", "VC", "Aceleradora")
 * @param {string}   typeMeta  - Metadato adicional (ej: sector, etapa, subtipo)
 * @param {string}   typeColor - Color hex de acento para badges y gradiente
 * @param {boolean}  isOwner   - Si true, muestra el botón de editar
 * @param {Function} onEdit    - Callback invocado al hacer click en "Editar Perfil"
 */
const ProfileHero = ({ logo, name, tagline, country, type, typeMeta, typeColor = '#00aaff', isOwner, onEdit }) => (
  <div className="ep-hero">

    {/* Gradiente de fondo con el color de acento de la entidad */}
    <div className="ep-hero-bg" style={{ '--accent': typeColor }}></div>

    <div className="ep-hero-inner">
      <div className="ep-hero-left">

        {/* Logo de la entidad (emoji o ícono) */}
        <div className="ep-logo" style={{ border: `2px solid ${typeColor}30` }}>
          {logo}
        </div>

        <div>
          {/* Badges de tipo, metadato y país */}
          <div className="ep-hero-badges">
            {/* Badge principal: tipo de entidad con color de acento */}
            <span
              className="ep-type-badge"
              style={{ background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}40` }}
            >
              {type}
            </span>

            {/* Badge de metadato (sector, etapa, etc.) — opcional */}
            {typeMeta && <span className="ep-meta-badge">{typeMeta}</span>}

            {/* Badge de país */}
            <span className="ep-meta-badge">📍 {country}</span>
          </div>

          {/* Nombre y tagline de la entidad */}
          <h1 className="ep-name">{name}</h1>
          <p className="ep-tagline">{tagline}</p>
        </div>
      </div>

      {/* Botón de edición — solo visible si el usuario autenticado es el dueño */}
      {isOwner && (
        <button className="ep-edit-btn" onClick={onEdit}>
          ✏️ Editar Perfil
        </button>
      )}
    </div>
  </div>
);

export default ProfileHero;
