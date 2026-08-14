/**
 * localStorageAdapter.js — Capa de persistencia 100% autónoma en localStorage
 * para Nexus Cobalt. Permite ejecutar todo el frontend sin backend.
 */

const STORAGE_KEYS = {
  USERS: 'nexus_users',
  STARTUPS: 'nexus_startups',
  INVERSORES: 'nexus_inversores',
  ACELERADORAS: 'nexus_aceleradoras',
  CONVOCATORIAS: 'nexus_convocatorias',
  POSTULACIONES: 'nexus_postulaciones',
  KPIS: 'nexus_kpis',
  PERKS: 'nexus_perks',
  RECLAMACIONES: 'nexus_reclamaciones',
  MENTORES: 'nexus_mentores',
  RESERVAS: 'nexus_reservas',
  DEMODAY: 'nexus_demoday',
  SUPPORT: 'nexus_support',
  FEED_STARTUP: 'nexus_feed_startup',
  FEED_ACELERADORA: 'nexus_feed_aceleradora',
  FEED_INVERSOR: 'nexus_feed_inversor',
  AUDIT: 'nexus_audit_logs',
  CONTACT: 'nexus_contact_messages'
};

const SECTORES_DEFAULT = [
  { id: 1, nombre: 'AgriTech & Food' },
  { id: 2, nombre: 'FinTech & DeFi' },
  { id: 3, nombre: 'HealthTech & Bio' },
  { id: 4, nombre: 'CleanTech & Energy' },
  { id: 5, nombre: 'EdTech' },
  { id: 6, nombre: 'SaaS & AI' }
];

const getItem = (key, defaultVal = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (err) {
    console.error(`Error leyendo ${key} de localStorage:`, err);
    return defaultVal;
  }
};

const setItem = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Error escribiendo ${key} en localStorage:`, err);
  }
};

// ── Semillas Iniciales (Seed Data) ─────────────────────────────────────────
export const initLocalStorageSeeds = () => {
  if (localStorage.getItem('nexus_initialized')) return;

  const initialUsers = [
    {
      id: 1,
      cedula: '100000001',
      nombre_hacienda: 'Super Administrador Nexus',
      nombre: 'Super Admin',
      email: 'admin@nexuscobalt.com',
      password_hash: 'admin123',
      role_id: 1,
      is_role_whitelisted: true,
      foto_perfil: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      created_at: new Date('2026-01-10T10:00:00Z').toISOString()
    },
    {
      id: 2,
      cedula: '100000002',
      nombre_hacienda: 'Fundador EcoAgritech CR',
      nombre: 'Carlos Jiménez',
      email: 'startup@nexuscobalt.com',
      password_hash: 'startup123',
      role_id: 2,
      is_role_whitelisted: true,
      foto_perfil: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      created_at: new Date('2026-01-15T12:00:00Z').toISOString()
    },
    {
      id: 3,
      cedula: '100000003',
      nombre_hacienda: 'Directora Nexus Accelerator',
      nombre: 'Elena Rostova',
      email: 'aceleradora@nexuscobalt.com',
      password_hash: 'aceleradora123',
      role_id: 3,
      is_role_whitelisted: true,
      foto_perfil: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      created_at: new Date('2026-01-20T14:00:00Z').toISOString()
    },
    {
      id: 4,
      cedula: '100000004',
      nombre_hacienda: 'Inversor Ángel Capital',
      nombre: 'Roberto Morales',
      email: 'inversor@nexuscobalt.com',
      password_hash: 'inversor123',
      role_id: 4,
      is_role_whitelisted: true,
      foto_perfil: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      created_at: new Date('2026-01-25T16:00:00Z').toISOString()
    }
  ];

  const initialStartups = [
    {
      id: 101,
      user_id: 2,
      nombre_comercial: 'EcoAgritech Costa Rica',
      descripcion: 'Plataforma IoT y sensores inteligentes para optimización de riego agrícola.',
      fase: 'Semilla',
      logo_url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=150',
      sector_id: 1,
      Sector: SECTORES_DEFAULT[0],
      User: initialUsers[1],
      respaldadaPor: 'Nexus Accelerator',
      batch: 'Generación 2026-A'
    },
    {
      id: 102,
      user_id: 2,
      nombre_comercial: 'TicoDeliveries Pro',
      descripcion: 'Software de logística de última milla para farmacias y comercios en Latam.',
      fase: 'Serie A',
      logo_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=150',
      sector_id: 2,
      Sector: SECTORES_DEFAULT[1],
      User: initialUsers[1],
      respaldadaPor: 'Nexus Accelerator',
      batch: 'Generación 2026-A'
    }
  ];

  const initialAceleradoras = [
    {
      id: 201,
      user_id: 3,
      nombre: 'Nexus Accelerator Latam',
      programas_activos: 'Batch 2026-A, ScaleUp Tech, AgriTech Challenge',
      sitio_web: 'https://accelerator.nexuscobalt.com',
      User: initialUsers[2]
    }
  ];

  const initialInversores = [
    {
      id: 301,
      user_id: 4,
      nombre: 'Roberto Morales (Ángel Investor)',
      presupuesto_min: 10000,
      presupuesto_max: 150000,
      sectores_interes: 'AgriTech, FinTech, CleanTech',
      User: initialUsers[3]
    }
  ];

  const initialConvocatorias = [
    {
      id: 501,
      aceleradora_id: 201,
      nombre_batch: 'Convocatoria Batch 2026-A',
      descripcion: 'Programa intensivo de 16 semanas enfocado en tracción, mentorías y capital pre-semilla.',
      requisitos: 'MVP funcional, equipo dedicado de tiempo completo y mercado en Latam.',
      fecha_inicio: '2026-03-01',
      fecha_cierre: '2026-09-30',
      estado: 'abierta',
      Aceleradora: initialAceleradoras[0]
    }
  ];

  const initialPostulaciones = [
    {
      id: 601,
      convocatoria_id: 501,
      startup_id: 101,
      pitch_deck_url: 'https://drive.google.com/demo-pitch-ecoagritech.pdf',
      mensaje: '¡Hola! Queremos llevar nuestra tecnología de riego inteligente al siguiente nivel.',
      estado: 'Aceptada',
      created_at: new Date('2026-02-01T10:00:00Z').toISOString(),
      Convocatoria: initialConvocatorias[0],
      Startup: initialStartups[0]
    }
  ];

  const initialKpis = [
    {
      id: 701,
      startup_id: 101,
      periodo: '2026-01',
      nuevos_usuarios: 450,
      ventas_mensuales: 18500,
      costo_adquisicion: 14.50,
      notas: 'Aumento significativo tras alianza comercial con productores del valle central.',
      created_at: new Date('2026-02-05T12:00:00Z').toISOString(),
      Startup: initialStartups[0]
    }
  ];

  const initialPerks = [
    {
      id: 801,
      aceleradora_id: 201,
      titulo: 'Créditos Cloud AWS $10,000',
      descripcion: 'Acceso a $10k USD en servicios de infraestructura AWS durante 2 años.',
      tipo: 'credito_cloud',
      valor: '$10,000 USD',
      Aceleradora: initialAceleradoras[0]
    },
    {
      id: 802,
      aceleradora_id: 201,
      titulo: 'Espacio de Coworking Tech Hub',
      descripcion: 'Escritorios dedicados e internet de alta velocidad en San José.',
      tipo: 'espacio_trabajo',
      valor: '6 meses gratis',
      Aceleradora: initialAceleradoras[0]
    }
  ];

  const initialMentores = [
    {
      id: 901,
      aceleradora_id: 201,
      nombre: 'Dra. María González',
      especialidad: 'Growth Hacking & B2B SaaS',
      linkedin_url: 'https://linkedin.com/in/maria-gonzalez-demo',
      foto_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
    },
    {
      id: 902,
      aceleradora_id: 201,
      nombre: 'Ing. Carlos Mendoza',
      especialidad: 'Finanzas de Startups & Rondas Semilla',
      linkedin_url: 'https://linkedin.com/in/carlos-mendoza-demo',
      foto_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
    }
  ];

  const initialFeedStartup = [
    {
      id: 1001,
      startup_id: 101,
      contenido: '¡Estamos muy orgullosos de anunciar que superamos los 400 clientes activos en nuestras soluciones de riego inteligente! 🚀🌱',
      imagen_url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      Startup: initialStartups[0],
      StartupComentarios: [
        {
          id: 1,
          startup_id: 102,
          contenido: '¡Muchas felicidades al equipo de EcoAgritech! Excelente logro.',
          created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          Startup: initialStartups[1]
        }
      ]
    }
  ];

  const initialFeedAceleradora = [
    {
      id: 2001,
      aceleradora_id: 201,
      contenido: '📢 ¡La convocatoria Batch 2026-A está abierta! Buscamos startups innovadoras en AgriTech, FinTech y CleanTech.',
      imagen_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      Aceleradora: initialAceleradoras[0],
      AceleradoraComentarios: []
    }
  ];

  const initialFeedInversor = [
    {
      id: 3001,
      inversor_id: 301,
      contenido: 'Buscando startups B2B SaaS en etapa Semilla con tracción mínima de $5k MRR. ¡Abierto a recibir decks en el Demo Day!',
      imagen_url: null,
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      Inversor: initialInversores[0],
      InversorComentarios: []
    }
  ];

  setItem(STORAGE_KEYS.USERS, initialUsers);
  setItem(STORAGE_KEYS.STARTUPS, initialStartups);
  setItem(STORAGE_KEYS.ACELERADORAS, initialAceleradoras);
  setItem(STORAGE_KEYS.INVERSORES, initialInversores);
  setItem(STORAGE_KEYS.CONVOCATORIAS, initialConvocatorias);
  setItem(STORAGE_KEYS.POSTULACIONES, initialPostulACIONES);
  setItem(STORAGE_KEYS.KPIS, initialKpis);
  setItem(STORAGE_KEYS.PERKS, initialPerks);
  setItem(STORAGE_KEYS.MENTORES, initialMentores);
  setItem(STORAGE_KEYS.FEED_STARTUP, initialFeedStartup);
  setItem(STORAGE_KEYS.FEED_ACELERADORA, initialFeedAceleradora);
  setItem(STORAGE_KEYS.FEED_INVERSOR, initialFeedInversor);
  setItem(STORAGE_KEYS.RECLAMACIONES, []);
  setItem(STORAGE_KEYS.RESERVAS, []);
  setItem(STORAGE_KEYS.DEMODAY, []);
  setItem(STORAGE_KEYS.SUPPORT, []);
  setItem(STORAGE_KEYS.AUDIT, []);
  setItem(STORAGE_KEYS.CONTACT, []);

  localStorage.setItem('nexus_initialized', 'true');
};

// Auto-ejecutar inicialización
initLocalStorageSeeds();

// ── Adaptador de Autenticación ─────────────────────────────────────────────
export const localAuth = {
  login(email, password) {
    const users = getItem(STORAGE_KEYS.USERS);
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      throw new Error('Credenciales inválidas. Usuario no encontrado.');
    }

    if (foundUser.password_hash !== password && password !== 'admin123' && password !== 'startup123' && password !== 'aceleradora123' && password !== 'inversor123') {
      throw new Error('Contraseña incorrecta.');
    }

    const mockToken = `mock-token-${foundUser.id}-${Date.now()}`;
    const redirectPath = foundUser.role_id === 1 ? '/secret-admin-nexus-dashboard'
      : foundUser.role_id === 2 ? '/dashboard/startup'
      : foundUser.role_id === 3 ? '/dashboard/aceleradora'
      : '/dashboard/inversor';

    return {
      token: mockToken,
      usuario: foundUser,
      redirectPath,
      twoFactorDelivery: 'email',
      twoFactorDestination: foundUser.email
    };
  },

  loginWithGoogle(googleToken, roleId) {
    const users = getItem(STORAGE_KEYS.USERS);
    let foundUser = users.find(u => u.email.includes('google'));

    if (!foundUser) {
      foundUser = {
        id: Date.now(),
        cedula: `G-${Math.floor(Math.random() * 1000000)}`,
        nombre_hacienda: 'Usuario Google Nexus',
        nombre: 'Usuario Google',
        email: 'googleuser@nexuscobalt.com',
        password_hash: 'google_auth',
        role_id: parseInt(roleId || 2, 10),
        is_role_whitelisted: true,
        foto_perfil: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        created_at: new Date().toISOString()
      };
      users.push(foundUser);
      setItem(STORAGE_KEYS.USERS, users);
    }

    const mockToken = `mock-google-token-${foundUser.id}`;
    const redirectPath = foundUser.role_id === 1 ? '/secret-admin-nexus-dashboard'
      : foundUser.role_id === 2 ? '/dashboard/startup'
      : foundUser.role_id === 3 ? '/dashboard/aceleradora'
      : '/dashboard/inversor';

    return {
      token: mockToken,
      usuario: foundUser,
      redirectPath,
      requiresRoleSelection: false
    };
  },

  register({ cedula, nombre_hacienda, email, password_hash, role_id }) {
    const users = getItem(STORAGE_KEYS.USERS);
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('El correo electrónico ya se encuentra registrado.');
    }

    const newUser = {
      id: Date.now(),
      cedula,
      nombre_hacienda: nombre_hacienda || 'Nuevo Usuario Nexus',
      nombre: nombre_hacienda || 'Nuevo Usuario',
      email,
      password_hash,
      role_id: parseInt(role_id, 10),
      is_role_whitelisted: false,
      foto_perfil: '',
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);

    // Si el rol es Startup, Aceleradora o Inversor, crear perfil inicial
    if (newUser.role_id === 2) {
      const startups = getItem(STORAGE_KEYS.STARTUPS);
      startups.push({
        id: Date.now() + 1,
        user_id: newUser.id,
        nombre_comercial: newUser.nombre_hacienda,
        descripcion: 'Startup recién registrada en Nexus Cobalt',
        fase: 'Idea',
        logo_url: '',
        sector_id: 1,
        Sector: SECTORES_DEFAULT[0],
        User: newUser
      });
      setItem(STORAGE_KEYS.STARTUPS, startups);
    } else if (newUser.role_id === 3) {
      const aceleradoras = getItem(STORAGE_KEYS.ACELERADORAS);
      aceleradoras.push({
        id: Date.now() + 2,
        user_id: newUser.id,
        nombre: newUser.nombre_hacienda,
        programas_activos: 'Programa Inicial',
        sitio_web: '',
        User: newUser
      });
      setItem(STORAGE_KEYS.ACELERADORAS, aceleradoras);
    } else if (newUser.role_id === 4) {
      const inversores = getItem(STORAGE_KEYS.INVERSORES);
      inversores.push({
        id: Date.now() + 3,
        user_id: newUser.id,
        nombre: newUser.nombre_hacienda,
        presupuesto_min: 5000,
        presupuesto_max: 50000,
        sectores_interes: 'AgriTech, FinTech',
        User: newUser
      });
      setItem(STORAGE_KEYS.INVERSORES, inversores);
    }

    return this.login(email, password_hash);
  },

  verifyCode(code) {
    if (code && String(code).trim().length >= 4) {
      return { success: true };
    }
    throw new Error('Código de verificación inválido. Introduce un código válido (ej. 123456).');
  },

  resendRoleCode() {
    return {
      success: true,
      twoFactorDelivery: 'email',
      twoFactorDestination: 'tu correo electrónico registrado',
      twoFactorExpiresAt: new Date(Date.now() + 600000).toISOString()
    };
  },

  changeRole(token, newRoleId) {
    const users = getItem(STORAGE_KEYS.USERS);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
      users[userIndex].role_id = parseInt(newRoleId, 10);
      setItem(STORAGE_KEYS.USERS, users);
      localStorage.setItem('user', JSON.stringify(users[userIndex]));
    }

    const redirectPath = newRoleId == 1 ? '/secret-admin-nexus-dashboard'
      : newRoleId == 2 ? '/dashboard/startup'
      : newRoleId == 3 ? '/dashboard/aceleradora'
      : '/dashboard/inversor';

    return {
      token: token || `mock-token-${currentUser.id}`,
      usuario: users[userIndex] || currentUser,
      redirectPath
    };
  }
};

// ── Adaptador de Endpoints REST (apiService & Feeds) ───────────────────────
export const localApi = {
  dispatch(method, endpoint, data = null, params = {}) {
    const cleanEndpoint = endpoint.replace(/^\/api(\/v1)?/, '');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    // ── DASHBOARD DASHBOARD/ADMIN, STARTUP, ACELERADORA, INVERSOR ──
    if (cleanEndpoint === '/dashboard/admin') {
      const users = getItem(STORAGE_KEYS.USERS);
      const startups = getItem(STORAGE_KEYS.STARTUPS);
      const aceleradoras = getItem(STORAGE_KEYS.ACELERADORAS);
      const inversores = getItem(STORAGE_KEYS.INVERSORES);

      return {
        title: 'Panel de Administración Global',
        subtitle: 'Supervisa la salud del sistema y configuraciones globales.',
        stats: [
          { label: 'Usuarios Registrados', value: String(users.length), icon: '👥', change: '+12.5% este mes' },
          { label: 'Startups Activas', value: String(startups.length), icon: '🚀', change: '+4 esta semana' },
          { label: 'Aceleradoras', value: String(aceleradoras.length), icon: '⚡', change: 'Ecosistema activo' },
          { label: 'Inversores Registrados', value: String(inversores.length), icon: '💼', change: 'Capital listo' }
        ],
        metricsList: [
          { label: 'Enero 2026', value: 45, color: '#00aaff' },
          { label: 'Febrero 2026', value: 68, color: '#7c3aed' },
          { label: 'Marzo 2026', value: 85, color: '#b1f500' },
          { label: 'Abril 2026', value: 92, color: '#059669' }
        ]
      };
    }

    if (cleanEndpoint === '/dashboard/startup') {
      const startups = getItem(STORAGE_KEYS.STARTUPS);
      const postulaciones = getItem(STORAGE_KEYS.POSTULACIONES);
      const kpis = getItem(STORAGE_KEYS.KPIS);
      const myStartup = startups.find(s => s.user_id === currentUser.id) || startups[0];

      return {
        startupInfo: myStartup,
        startup_id: myStartup?.id,
        stats: [
          { label: 'Postulaciones Enviadas', value: String(postulaciones.filter(p => p.startup_id === myStartup?.id).length), icon: '🚀', change: 'En revisión' },
          { label: 'KPIs Registrados', value: String(kpis.filter(k => k.startup_id === myStartup?.id).length), icon: '📈', change: 'Al día' },
          { label: 'Valuación Estimada', value: '$250K', icon: '💰', change: 'Fase Semilla' },
          { label: 'Calificación Ecosistema', value: '4.9★', icon: '⭐', change: 'Verificada' }
        ],
        metricsList: [
          { label: 'Nov 2025', value: 30, color: '#00aaff' },
          { label: 'Dic 2025', value: 50, color: '#7c3aed' },
          { label: 'Ene 2026', value: 75, color: '#b1f500' },
          { label: 'Feb 2026', value: 90, color: '#059669' }
        ]
      };
    }

    if (cleanEndpoint === '/dashboard/aceleradora') {
      const aceleradoras = getItem(STORAGE_KEYS.ACELERADORAS);
      const convocatorias = getItem(STORAGE_KEYS.CONVOCATORIAS);
      const myAcel = aceleradoras.find(a => a.user_id === currentUser.id) || aceleradoras[0];

      return {
        aceleradoraInfo: myAcel,
        aceleradora_id: myAcel?.id,
        convocatoriasCount: convocatorias.length
      };
    }

    if (cleanEndpoint === '/dashboard/inversor') {
      const inversores = getItem(STORAGE_KEYS.INVERSORES);
      const myInv = inversores.find(i => i.user_id === currentUser.id) || inversores[0];

      return {
        inversorInfo: myInv,
        inversor_id: myInv?.id
      };
    }

    // ── USUARIOS ─────────────────────────────────────────────────────────────
    if (cleanEndpoint === '/usuarios' || cleanEndpoint.startsWith('/usuarios?')) {
      let users = getItem(STORAGE_KEYS.USERS);
      if (method === 'GET') return users;
      if (method === 'POST') {
        const newUser = { id: Date.now(), ...data, created_at: new Date().toISOString() };
        users.push(newUser);
        setItem(STORAGE_KEYS.USERS, users);
        return newUser;
      }
    }
    if (cleanEndpoint.match(/^\/usuarios\/\d+$/)) {
      const id = parseInt(cleanEndpoint.split('/')[2], 10);
      let users = getItem(STORAGE_KEYS.USERS);
      if (method === 'PUT' || method === 'PATCH') {
        users = users.map(u => (u.id === id ? { ...u, ...data } : u));
        setItem(STORAGE_KEYS.USERS, users);
        const updated = users.find(u => u.id === id);
        if (currentUser.id === id) {
          localStorage.setItem('user', JSON.stringify(updated));
        }
        return updated;
      }
      if (method === 'DELETE') {
        users = users.filter(u => u.id !== id);
        setItem(STORAGE_KEYS.USERS, users);
        return { message: 'Usuario eliminado exitosamente' };
      }
    }
    if (cleanEndpoint === '/usuarios/admin-audit') {
      return getItem(STORAGE_KEYS.AUDIT, [
        { id: 1, action: 'UPDATE', entity: 'User', entity_id: 2, admin: { email: 'admin@nexuscobalt.com' }, created_at: new Date().toISOString() }
      ]);
    }

    // ── STARTUPS ─────────────────────────────────────────────────────────────
    if (cleanEndpoint === '/startups' || cleanEndpoint.startsWith('/startups?')) {
      let startups = getItem(STORAGE_KEYS.STARTUPS);
      if (method === 'GET') return startups;
      if (method === 'POST') {
        const newS = { id: Date.now(), ...data, Sector: SECTORES_DEFAULT[0] };
        startups.push(newS);
        setItem(STORAGE_KEYS.STARTUPS, startups);
        return newS;
      }
    }
    if (cleanEndpoint.match(/^\/startups\/\d+$/)) {
      const id = parseInt(cleanEndpoint.split('/')[2], 10);
      let startups = getItem(STORAGE_KEYS.STARTUPS);
      if (method === 'PUT' || method === 'PATCH') {
        startups = startups.map(s => (s.id === id ? { ...s, ...data } : s));
        setItem(STORAGE_KEYS.STARTUPS, startups);
        return startups.find(s => s.id === id);
      }
      if (method === 'DELETE') {
        startups = startups.filter(s => s.id !== id);
        setItem(STORAGE_KEYS.STARTUPS, startups);
        return { message: 'Startup eliminada' };
      }
    }

    // ── INVERSORES ───────────────────────────────────────────────────────────
    if (cleanEndpoint === '/inversores' || cleanEndpoint.startsWith('/inversores?')) {
      let inversores = getItem(STORAGE_KEYS.INVERSORES);
      if (method === 'GET') return inversores;
      if (method === 'POST') {
        const newI = { id: Date.now(), ...data };
        inversores.push(newI);
        setItem(STORAGE_KEYS.INVERSORES, inversores);
        return newI;
      }
    }
    if (cleanEndpoint.match(/^\/inversores\/\d+$/)) {
      const id = parseInt(cleanEndpoint.split('/')[2], 10);
      let inversores = getItem(STORAGE_KEYS.INVERSORES);
      if (method === 'PUT' || method === 'PATCH') {
        inversores = inversores.map(i => (i.id === id ? { ...i, ...data } : i));
        setItem(STORAGE_KEYS.INVERSORES, inversores);
        return inversores.find(i => i.id === id);
      }
      if (method === 'DELETE') {
        inversores = inversores.filter(i => i.id !== id);
        setItem(STORAGE_KEYS.INVERSORES, inversores);
        return { message: 'Inversor eliminado' };
      }
    }

    // ── ACELERADORAS ─────────────────────────────────────────────────────────
    if (cleanEndpoint === '/aceleradoras' || cleanEndpoint.startsWith('/aceleradoras?')) {
      let aceleradoras = getItem(STORAGE_KEYS.ACELERADORAS);
      if (method === 'GET') return aceleradoras;
      if (method === 'POST') {
        const newA = { id: Date.now(), ...data };
        aceleradoras.push(newA);
        setItem(STORAGE_KEYS.ACELERADORAS, aceleradoras);
        return newA;
      }
    }
    if (cleanEndpoint.match(/^\/aceleradoras\/\d+$/)) {
      const id = parseInt(cleanEndpoint.split('/')[2], 10);
      let aceleradoras = getItem(STORAGE_KEYS.ACELERADORAS);
      if (method === 'PUT' || method === 'PATCH') {
        aceleradoras = aceleradoras.map(a => (a.id === id ? { ...a, ...data } : a));
        setItem(STORAGE_KEYS.ACELERADORAS, aceleradoras);
        return aceleradoras.find(a => a.id === id);
      }
      if (method === 'DELETE') {
        aceleradoras = aceleradoras.filter(a => a.id !== id);
        setItem(STORAGE_KEYS.ACELERADORAS, aceleradoras);
        return { message: 'Aceleradora eliminada' };
      }
    }

    // ── CONVOCATORIAS & POSTULACIONES ───────────────────────────────────────
    if (cleanEndpoint === '/convocatorias/publicas' || cleanEndpoint === '/convocatorias/mis-convocatorias') {
      return getItem(STORAGE_KEYS.CONVOCATORIAS);
    }
    if (cleanEndpoint === '/convocatorias' && method === 'POST') {
      let convs = getItem(STORAGE_KEYS.CONVOCATORIAS);
      const aceleradoras = getItem(STORAGE_KEYS.ACELERADORAS);
      const myAcel = aceleradoras.find(a => a.user_id === currentUser.id) || aceleradoras[0];
      const newConv = { id: Date.now(), aceleradora_id: myAcel?.id || 201, ...data, Aceleradora: myAcel };
      convs.push(newConv);
      setItem(STORAGE_KEYS.CONVOCATORIAS, convs);
      return newConv;
    }
    if (cleanEndpoint.match(/^\/convocatorias\/\d+$/) && method === 'PUT') {
      const id = parseInt(cleanEndpoint.split('/')[2], 10);
      let convs = getItem(STORAGE_KEYS.CONVOCATORIAS);
      convs = convs.map(c => (c.id === id ? { ...c, ...data } : c));
      setItem(STORAGE_KEYS.CONVOCATORIAS, convs);
      return convs.find(c => c.id === id);
    }
    if (cleanEndpoint === '/convocatorias/mis-postulaciones' || cleanEndpoint === '/convocatorias/postulaciones') {
      return getItem(STORAGE_KEYS.POSTULACIONES);
    }
    if (cleanEndpoint === '/convocatorias/postular' && method === 'POST') {
      let posts = getItem(STORAGE_KEYS.POSTULACIONES);
      const convs = getItem(STORAGE_KEYS.CONVOCATORIAS);
      const startups = getItem(STORAGE_KEYS.STARTUPS);
      const myStartup = startups.find(s => s.user_id === currentUser.id) || startups[0];
      const targetConv = convs.find(c => c.id == data.convocatoria_id) || convs[0];

      const newPost = {
        id: Date.now(),
        convocatoria_id: parseInt(data.convocatoria_id, 10),
        startup_id: myStartup?.id || 101,
        pitch_deck_url: data.pitch_deck_url,
        mensaje: data.mensaje,
        estado: 'Recibida',
        created_at: new Date().toISOString(),
        Convocatoria: targetConv,
        Startup: myStartup
      };

      posts.push(newPost);
      setItem(STORAGE_KEYS.POSTULACIONES, posts);
      return newPost;
    }
    if (cleanEndpoint.startsWith('/convocatorias/postulaciones') && method === 'PATCH') {
      const parts = cleanEndpoint.split('/');
      const postId = parseInt(parts[parts.length - 1] || data?.id, 10);
      let posts = getItem(STORAGE_KEYS.POSTULACIONES);
      posts = posts.map(p => (p.id === postId || p.id == data.id ? { ...p, estado: data.estado } : p));
      setItem(STORAGE_KEYS.POSTULACIONES, posts);
      return { success: true };
    }

    // ── KPIS ────────────────────────────────────────────────────────────────
    if (cleanEndpoint === '/kpis/mis-kpis' || cleanEndpoint === '/kpis/cohorte') {
      return getItem(STORAGE_KEYS.KPIS);
    }
    if (cleanEndpoint === '/kpis' && method === 'POST') {
      let kpis = getItem(STORAGE_KEYS.KPIS);
      const startups = getItem(STORAGE_KEYS.STARTUPS);
      const myStartup = startups.find(s => s.user_id === currentUser.id) || startups[0];

      const newKpi = {
        id: Date.now(),
        startup_id: myStartup?.id || 101,
        periodo: data.periodo,
        nuevos_usuarios: parseInt(data.nuevos_usuarios || 0, 10),
        ventas_mensuales: parseFloat(data.ventas_mensuales || 0),
        costo_adquisicion: parseFloat(data.costo_adquisicion || 0),
        notas: data.notas,
        created_at: new Date().toISOString(),
        Startup: myStartup
      };

      kpis.push(newKpi);
      setItem(STORAGE_KEYS.KPIS, kpis);
      return newKpi;
    }

    // ── PERKS ───────────────────────────────────────────────────────────────
    if (cleanEndpoint === '/programas/perks/disponibles' || cleanEndpoint === '/programas/perks/mis-perks') {
      return getItem(STORAGE_KEYS.PERKS);
    }
    if (cleanEndpoint === '/programas/perks' && method === 'POST') {
      let perks = getItem(STORAGE_KEYS.PERKS);
      const aceleradoras = getItem(STORAGE_KEYS.ACELERADORAS);
      const myAcel = aceleradoras.find(a => a.user_id === currentUser.id) || aceleradoras[0];

      const newPerk = {
        id: Date.now(),
        aceleradora_id: myAcel?.id || 201,
        titulo: data.titulo,
        descripcion: data.descripcion,
        tipo: data.tipo || 'otro',
        valor: data.valor,
        Aceleradora: myAcel
      };
      perks.push(newPerk);
      setItem(STORAGE_KEYS.PERKS, perks);
      return newPerk;
    }
    if (cleanEndpoint === '/programas/perks/reclamar' && method === 'POST') {
      let recs = getItem(STORAGE_KEYS.RECLAMACIONES);
      const perks = getItem(STORAGE_KEYS.PERKS);
      const startups = getItem(STORAGE_KEYS.STARTUPS);
      const myStartup = startups.find(s => s.user_id === currentUser.id) || startups[0];
      const targetPerk = perks.find(p => p.id == data.perk_id) || perks[0];

      const newRec = {
        id: Date.now(),
        perk_id: data.perk_id,
        startup_id: myStartup?.id || 101,
        estado: 'pendiente',
        created_at: new Date().toISOString(),
        Perk: targetPerk,
        Startup: myStartup
      };
      recs.push(newRec);
      setItem(STORAGE_KEYS.RECLAMACIONES, recs);

      // Actualizar perk con estado local para vista
      const perkIdx = perks.findIndex(p => p.id == data.perk_id);
      if (perkIdx !== -1) {
        perks[perkIdx].reclamacion_estado = 'pendiente';
        setItem(STORAGE_KEYS.PERKS, perks);
      }
      return newRec;
    }
    if (cleanEndpoint === '/programas/perks/reclamaciones') {
      return getItem(STORAGE_KEYS.RECLAMACIONES);
    }
    if (cleanEndpoint.startsWith('/programas/perks/reclamaciones') && method === 'PATCH') {
      let recs = getItem(STORAGE_KEYS.RECLAMACIONES);
      recs = recs.map(r => (r.id == data.id || cleanEndpoint.includes(r.id) ? { ...r, estado: data.estado } : r));
      setItem(STORAGE_KEYS.RECLAMACIONES, recs);
      return { success: true };
    }

    // ── MENTORES & RESERVAS ─────────────────────────────────────────────────
    if (cleanEndpoint === '/programas/mentores/disponibles' || cleanEndpoint === '/programas/mentores/mis-mentores') {
      return getItem(STORAGE_KEYS.MENTORES);
    }
    if (cleanEndpoint === '/programas/mentores' && method === 'POST') {
      let mentores = getItem(STORAGE_KEYS.MENTORES);
      const aceleradoras = getItem(STORAGE_KEYS.ACELERADORAS);
      const myAcel = aceleradoras.find(a => a.user_id === currentUser.id) || aceleradoras[0];

      const newM = {
        id: Date.now(),
        aceleradora_id: myAcel?.id || 201,
        nombre: data.nombre,
        especialidad: data.especialidad,
        linkedin_url: data.linkedin_url,
        foto_url: data.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      };
      mentores.push(newM);
      setItem(STORAGE_KEYS.MENTORES, mentores);
      return newM;
    }
    if (cleanEndpoint === '/programas/mentores/mis-reservas' || cleanEndpoint === '/programas/mentores/reservas') {
      return getItem(STORAGE_KEYS.RESERVAS);
    }
    if (cleanEndpoint === '/programas/mentores/reservar' && method === 'POST') {
      let reservas = getItem(STORAGE_KEYS.RESERVAS);
      const mentores = getItem(STORAGE_KEYS.MENTORES);
      const startups = getItem(STORAGE_KEYS.STARTUPS);
      const myStartup = startups.find(s => s.user_id === currentUser.id) || startups[0];
      const targetMentor = mentores.find(m => m.id == data.mentor_id) || mentores[0];

      const newRes = {
        id: Date.now(),
        mentor_id: data.mentor_id,
        startup_id: myStartup?.id || 101,
        fecha_hora: data.fecha_hora,
        notas: data.notas,
        estado: 'pendiente',
        created_at: new Date().toISOString(),
        Mentor: targetMentor,
        Startup: myStartup
      };
      reservas.push(newRes);
      setItem(STORAGE_KEYS.RESERVAS, reservas);
      return newRes;
    }
    if (cleanEndpoint.startsWith('/programas/mentores/reservas') && method === 'PATCH') {
      let reservas = getItem(STORAGE_KEYS.RESERVAS);
      reservas = reservas.map(r => (r.id == data.id || cleanEndpoint.includes(r.id) ? { ...r, estado: data.estado } : r));
      setItem(STORAGE_KEYS.RESERVAS, reservas);
      return { success: true };
    }

    // ── VIRTUAL DEMO DAY ────────────────────────────────────────────────────
    if (cleanEndpoint === '/demoday/startups') {
      const startups = getItem(STORAGE_KEYS.STARTUPS);
      if (params.sector_id) {
        return startups.filter(s => s.sector_id == params.sector_id);
      }
      return startups;
    }
    if (cleanEndpoint === '/demoday/mis-solicitudes' || cleanEndpoint === '/demoday/solicitudes-recibidas') {
      return getItem(STORAGE_KEYS.DEMODAY);
    }
    if (cleanEndpoint === '/demoday/solicitar' && method === 'POST') {
      let dd = getItem(STORAGE_KEYS.DEMODAY);
      const inversores = getItem(STORAGE_KEYS.INVERSORES);
      const startups = getItem(STORAGE_KEYS.STARTUPS);
      const myInv = inversores.find(i => i.user_id === currentUser.id) || inversores[0];
      const targetStartup = startups.find(s => s.id == data.startup_id) || startups[0];

      const newDD = {
        id: Date.now(),
        inversor_id: myInv?.id || 301,
        startup_id: data.startup_id,
        mensaje: data.mensaje,
        estado: 'pendiente',
        created_at: new Date().toISOString(),
        Inversor: myInv,
        Startup: targetStartup
      };
      dd.push(newDD);
      setItem(STORAGE_KEYS.DEMODAY, dd);
      return newDD;
    }
    if (cleanEndpoint.startsWith('/demoday/solicitudes') && method === 'PATCH') {
      let dd = getItem(STORAGE_KEYS.DEMODAY);
      dd = dd.map(s => (s.id == data.id || cleanEndpoint.includes(s.id) ? { ...s, estado: data.estado } : s));
      setItem(STORAGE_KEYS.DEMODAY, dd);
      return { success: true };
    }

    // ── FEEDS SOCIALES & COMENTARIOS ────────────────────────────────────────
    if (cleanEndpoint === '/feed') {
      let posts = getItem(STORAGE_KEYS.FEED_STARTUP);
      if (method === 'GET') return posts;
      if (method === 'POST') {
        const startups = getItem(STORAGE_KEYS.STARTUPS);
        const myStartup = startups.find(s => s.user_id === currentUser.id) || startups[0];

        const newPost = {
          id: Date.now(),
          startup_id: myStartup?.id || 101,
          contenido: typeof data === 'string' ? data : (data?.contenido || data?.get?.('contenido')),
          imagen_url: typeof data?.get === 'function' && data.get('imagen') ? URL.createObjectURL(data.get('imagen')) : null,
          created_at: new Date().toISOString(),
          Startup: myStartup,
          StartupComentarios: []
        };
        posts.unshift(newPost);
        setItem(STORAGE_KEYS.FEED_STARTUP, posts);
        return newPost;
      }
    }
    if (cleanEndpoint.match(/^\/feed\/\d+$/) && method === 'DELETE') {
      const id = parseInt(cleanEndpoint.split('/')[2], 10);
      let posts = getItem(STORAGE_KEYS.FEED_STARTUP);
      posts = posts.filter(p => p.id !== id);
      setItem(STORAGE_KEYS.FEED_STARTUP, posts);
      return { success: true };
    }
    if (cleanEndpoint.match(/^\/feed\/\d+\/comentarios$/) && method === 'POST') {
      const postId = parseInt(cleanEndpoint.split('/')[2], 10);
      let posts = getItem(STORAGE_KEYS.FEED_STARTUP);
      const startups = getItem(STORAGE_KEYS.STARTUPS);
      const myStartup = startups.find(s => s.user_id === currentUser.id) || startups[0];

      const newComm = {
        id: Date.now(),
        startup_id: myStartup?.id || 101,
        contenido: data.contenido,
        created_at: new Date().toISOString(),
        Startup: myStartup
      };

      posts = posts.map(p => {
        if (p.id === postId) {
          return { ...p, StartupComentarios: [...(p.StartupComentarios || []), newComm] };
        }
        return p;
      });

      setItem(STORAGE_KEYS.FEED_STARTUP, posts);
      return newComm;
    }
    if (cleanEndpoint.match(/^\/feed\/comentarios\/\d+$/) && method === 'DELETE') {
      const commId = parseInt(cleanEndpoint.split('/')[3], 10);
      let posts = getItem(STORAGE_KEYS.FEED_STARTUP);
      posts = posts.map(p => ({
        ...p,
        StartupComentarios: (p.StartupComentarios || []).filter(c => c.id !== commId)
      }));
      setItem(STORAGE_KEYS.FEED_STARTUP, posts);
      return { success: true };
    }

    if (cleanEndpoint === '/feed/aceleradora') {
      let posts = getItem(STORAGE_KEYS.FEED_ACELERADORA);
      if (method === 'GET') return posts;
      if (method === 'POST') {
        const aceleradoras = getItem(STORAGE_KEYS.ACELERADORAS);
        const myAcel = aceleradoras.find(a => a.user_id === currentUser.id) || aceleradoras[0];

        const newPost = {
          id: Date.now(),
          aceleradora_id: myAcel?.id || 201,
          contenido: typeof data === 'string' ? data : (data?.contenido || data?.get?.('contenido')),
          imagen_url: null,
          created_at: new Date().toISOString(),
          Aceleradora: myAcel,
          AceleradoraComentarios: []
        };
        posts.unshift(newPost);
        setItem(STORAGE_KEYS.FEED_ACELERADORA, posts);
        return newPost;
      }
    }
    if (cleanEndpoint.match(/^\/feed\/aceleradora\/\d+$/) && method === 'DELETE') {
      const id = parseInt(cleanEndpoint.split('/')[3], 10);
      let posts = getItem(STORAGE_KEYS.FEED_ACELERADORA);
      posts = posts.filter(p => p.id !== id);
      setItem(STORAGE_KEYS.FEED_ACELERADORA, posts);
      return { success: true };
    }
    if (cleanEndpoint.match(/^\/feed\/aceleradora\/\d+\/comentarios$/) && method === 'POST') {
      const postId = parseInt(cleanEndpoint.split('/')[3], 10);
      let posts = getItem(STORAGE_KEYS.FEED_ACELERADORA);
      const aceleradoras = getItem(STORAGE_KEYS.ACELERADORAS);
      const myAcel = aceleradoras.find(a => a.user_id === currentUser.id) || aceleradoras[0];

      const newComm = {
        id: Date.now(),
        aceleradora_id: myAcel?.id || 201,
        contenido: data.contenido,
        created_at: new Date().toISOString(),
        Aceleradora: myAcel
      };

      posts = posts.map(p => {
        if (p.id === postId) {
          return { ...p, AceleradoraComentarios: [...(p.AceleradoraComentarios || []), newComm] };
        }
        return p;
      });

      setItem(STORAGE_KEYS.FEED_ACELERADORA, posts);
      return newComm;
    }
    if (cleanEndpoint.match(/^\/feed\/aceleradora\/comentarios\/\d+$/) && method === 'DELETE') {
      const commId = parseInt(cleanEndpoint.split('/')[4], 10);
      let posts = getItem(STORAGE_KEYS.FEED_ACELERADORA);
      posts = posts.map(p => ({
        ...p,
        AceleradoraComentarios: (p.AceleradoraComentarios || []).filter(c => c.id !== commId)
      }));
      setItem(STORAGE_KEYS.FEED_ACELERADORA, posts);
      return { success: true };
    }

    if (cleanEndpoint === '/feed/inversor') {
      let posts = getItem(STORAGE_KEYS.FEED_INVERSOR);
      if (method === 'GET') return posts;
      if (method === 'POST') {
        const inversores = getItem(STORAGE_KEYS.INVERSORES);
        const myInv = inversores.find(i => i.user_id === currentUser.id) || inversores[0];

        const newPost = {
          id: Date.now(),
          inversor_id: myInv?.id || 301,
          contenido: typeof data === 'string' ? data : (data?.contenido || data?.get?.('contenido')),
          imagen_url: null,
          created_at: new Date().toISOString(),
          Inversor: myInv,
          InversorComentarios: []
        };
        posts.unshift(newPost);
        setItem(STORAGE_KEYS.FEED_INVERSOR, posts);
        return newPost;
      }
    }
    if (cleanEndpoint.match(/^\/feed\/inversor\/\d+$/) && method === 'DELETE') {
      const id = parseInt(cleanEndpoint.split('/')[3], 10);
      let posts = getItem(STORAGE_KEYS.FEED_INVERSOR);
      posts = posts.filter(p => p.id !== id);
      setItem(STORAGE_KEYS.FEED_INVERSOR, posts);
      return { success: true };
    }
    if (cleanEndpoint.match(/^\/feed\/inversor\/\d+\/comentarios$/) && method === 'POST') {
      const postId = parseInt(cleanEndpoint.split('/')[3], 10);
      let posts = getItem(STORAGE_KEYS.FEED_INVERSOR);
      const inversores = getItem(STORAGE_KEYS.INVERSORES);
      const myInv = inversores.find(i => i.user_id === currentUser.id) || inversores[0];

      const newComm = {
        id: Date.now(),
        inversor_id: myInv?.id || 301,
        contenido: data.contenido,
        created_at: new Date().toISOString(),
        Inversor: myInv
      };

      posts = posts.map(p => {
        if (p.id === postId) {
          return { ...p, InversorComentarios: [...(p.InversorComentarios || []), newComm] };
        }
        return p;
      });

      setItem(STORAGE_KEYS.FEED_INVERSOR, posts);
      return newComm;
    }
    if (cleanEndpoint.match(/^\/feed\/inversor\/comentarios\/\d+$/) && method === 'DELETE') {
      const commId = parseInt(cleanEndpoint.split('/')[4], 10);
      let posts = getItem(STORAGE_KEYS.FEED_INVERSOR);
      posts = posts.map(p => ({
        ...p,
        InversorComentarios: (p.InversorComentarios || []).filter(c => c.id !== commId)
      }));
      setItem(STORAGE_KEYS.FEED_INVERSOR, posts);
      return { success: true };
    }

    // ── SOPORTE ─────────────────────────────────────────────────────────────
    if (cleanEndpoint === '/support/reportes' || cleanEndpoint === '/support/mis-reportes') {
      let reports = getItem(STORAGE_KEYS.SUPPORT);
      if (method === 'GET') return { reportes: reports };
      if (method === 'POST') {
        const newRep = {
          id: Date.now(),
          user_id: currentUser.id || 2,
          categoria: data.categoria || 'bug',
          prioridad: data.prioridad || 'media',
          asunto: data.asunto,
          descripcion: data.descripcion,
          pagina_url: data.pagina_url || '/dashboard',
          contexto_tecnico: data.contexto_tecnico || 'Navegador Web',
          estado: 'nuevo',
          created_at: new Date().toISOString(),
          Reporter: currentUser
        };
        reports.unshift(newRep);
        setItem(STORAGE_KEYS.SUPPORT, reports);
        return newRep;
      }
    }
    if (cleanEndpoint.startsWith('/support/reportes') && method === 'PATCH') {
      let reports = getItem(STORAGE_KEYS.SUPPORT);
      const parts = cleanEndpoint.split('/');
      const repId = parseInt(parts[3] || data.id, 10);
      reports = reports.map(r => (r.id === repId ? { ...r, estado: data.estado } : r));
      setItem(STORAGE_KEYS.SUPPORT, reports);
      return { success: true };
    }

    // ── CONTACTO PÚBLICO & JARVIS CHATBOT ──────────────────────────────────
    if (cleanEndpoint.includes('/contacto-publico')) {
      let msgs = getItem(STORAGE_KEYS.CONTACT);
      msgs.push({ id: Date.now(), ...data, created_at: new Date().toISOString() });
      setItem(STORAGE_KEYS.CONTACT, msgs);
      return { message: 'Mensaje de contacto enviado con éxito' };
    }

    if (cleanEndpoint.includes('/ai/chat')) {
      const userText = data?.message || '';
      return {
        response: `Entendido señor. En relación a "${userText}", he verificado las métricas en nuestro almacenamiento local de Nexus Cobalt. El ecosistema se encuentra operando en parámetros óptimos con startups activas, aceleradoras y fondos registrados.`
      };
    }

    if (cleanEndpoint.includes('/ai/classify-request')) {
      return {
        tipo: 'Solicitud de Inversión / Aceleración',
        confianza: 0.94,
        razon: 'El mensaje contiene palabras clave relacionadas con startups, métricas y financiamiento.',
        requiere_revision: false
      };
    }

    if (cleanEndpoint === '/indicadores/tc') {
      return {
        usd_crc: 512.40,
        eur_usd: 1.085,
        btc_usd: 64250.00,
        fecha: new Date().toISOString()
      };
    }

    // Fallback genérico para cualquier otra ruta
    return { status: 'success', data: [], message: 'Operación simulada en LocalStorage' };
  }
};
