import React from 'react';
import { Link } from 'react-router-dom';
import ReusableCRUD from '../../components/Common/ReusableCRUD';
import { startupService } from '../../services/startupService';
import { investorService } from '../../services/investorService';
import { acceleratorService } from '../../services/acceleratorService';
import { ADMIN_SECRET_DASHBOARD_PATH } from '../../constants/adminRoute';

const startupColumns = [
  { key: 'user_id', label: 'User ID Startup', type: 'number', required: true },
  { key: 'nombre_comercial', label: 'Nombre Comercial', type: 'text', required: true },
  { key: 'descripcion', label: 'Descripcion', type: 'textarea', required: false },
  { key: 'fase', label: 'Fase', type: 'select', required: false, options: ['Idea', 'Semilla', 'Serie A', 'Serie B', 'Escalamiento'] },
  { key: 'logo_url', label: 'Logo URL', type: 'text', required: false },
  { key: 'sector_id', label: 'Sector ID', type: 'number', required: false }
];

const investorColumns = [
  { key: 'user_id', label: 'User ID Inversor', type: 'number', required: true },
  { key: 'nombre', label: 'Nombre', type: 'text', required: true },
  { key: 'presupuesto_min', label: 'Presupuesto Min USD', type: 'number', required: false },
  { key: 'presupuesto_max', label: 'Presupuesto Max USD', type: 'number', required: false },
  { key: 'sectores_interes', label: 'Sectores (JSON opcional)', type: 'textarea', required: false }
];

const acceleratorColumns = [
  { key: 'user_id', label: 'User ID Aceleradora', type: 'number', required: true },
  { key: 'nombre', label: 'Nombre', type: 'text', required: true },
  { key: 'programas_activos', label: 'Programas Activos', type: 'textarea', required: false },
  { key: 'sitio_web', label: 'Sitio Web', type: 'text', required: false }
];

const SECTION_CONFIG = {
  startups: {
    title: 'Gestionar Startups',
    subtitle: 'CRUD completo para startups del ecosistema.',
    service: startupService,
    columns: startupColumns
  },
  inversores: {
    title: 'Gestionar Inversores',
    subtitle: 'CRUD completo para perfiles de inversion.',
    service: investorService,
    columns: investorColumns
  },
  aceleradoras: {
    title: 'Gestionar Aceleradoras',
    subtitle: 'CRUD completo para aceleradoras registradas.',
    service: acceleratorService,
    columns: acceleratorColumns
  }
};

const AdminManageSection = ({ section }) => {
  const config = SECTION_CONFIG[section] || SECTION_CONFIG.startups;

  return (
    <div style={{ padding: '10px 0' }}>
      <div className="db-header" style={{ marginBottom: '18px' }}>
        <div>
          <h1 className="db-title">{config.title}</h1>
          <p className="db-subtitle">{config.subtitle}</p>
        </div>
        <Link
          to={ADMIN_SECRET_DASHBOARD_PATH}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1px solid rgba(124,58,237,0.4)',
            background: 'rgba(124,58,237,0.12)',
            color: '#fff',
            fontWeight: '700',
            textDecoration: 'none'
          }}
        >
          Volver al Control Central
        </Link>
      </div>

      <div
        style={{
          marginBottom: '16px',
          padding: '12px 14px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.02)',
          color: '#9fb0c3',
          fontSize: '13px',
          textAlign: 'left'
        }}
      >
        Para crear nuevos registros usa un <strong style={{ color: '#fff' }}>user_id</strong> valido del rol correspondiente.
      </div>

      <ReusableCRUD
        service={config.service}
        columns={config.columns}
        title={config.title}
      />
    </div>
  );
};

export default AdminManageSection;
