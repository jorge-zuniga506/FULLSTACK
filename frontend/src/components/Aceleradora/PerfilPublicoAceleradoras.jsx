import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/PublicoAceleradoras.css"
import Services from '../../services/Services';

function PerfilPublicoAceleradoras() {
  const navigate = useNavigate();
  const [aceleradoras, setAceleradoras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Services.getAceleradoras();
        setAceleradoras(response || []);
      } catch (error) {
        console.error("Error fetching aceleradoras", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-on-surface">Cargando...</div>;
  }

  if (aceleradoras.length === 0) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-on-surface">No se encontraron aceleradoras.</div>;
  }

  const aceleradora = aceleradoras[0];

  const handlePerfilPrivado = () => {
    navigate('/PerfilPrivadoAceleradora');
  };

  return (
    <div className="bg-background text-primary/80 font-body selection:bg-primary/30 antialiased min-h-screen">
      
      {/* TopNavBar Shared Component */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#242b3d] border-b border-white/5 font-['Manrope'] antialiased flex justify-between items-center w-full px-6 py-4 shadow-2xl">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tighter text-[#b4c5ff]">NexxusCobalt</span>
          <nav className="hidden md:flex gap-6">
            <a className="text-[#c3c6d7] font-medium hover:bg-[#2e3545] transition-colors duration-200 px-3 py-1 rounded" href="#">Ecosystem</a>
            <a className="text-[#c3c6d7] font-medium hover:bg-[#2e3545] transition-colors duration-200 px-3 py-1 rounded" href="#">Investors</a>
            <a className="text-[#c3c6d7] font-medium hover:bg-[#2e3545] transition-colors duration-200 px-3 py-1 rounded" href="#">Startups</a>
            <a className="text-[#b4c5ff] font-semibold hover:bg-[#2e3545] transition-colors duration-200 px-3 py-1 rounded" href="#">Insights</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input className="bg-surface-variant border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Buscar..." type="text"/>
          </div>
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-[#2e3545] p-2 rounded-full transition-colors">notifications</button>
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-[#2e3545] p-2 rounded-full transition-colors">settings</button>
          <img alt="User profile" className="w-8 h-8 rounded-full border border-outline-variant/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK4YC9L-YE7rhz3qA9ec_mhi0dsY_n2y-SXK83dl8cHdUUKgksiO_PB8Ci5IxOyUXR2twfR86KfNJGi4_7w2uPg7X7_kahD7L29Anl3tPQNqh9e05p_PHxWY3Vd71i8c69rIh8-Xb3ZCi8RMCzo2UkAZssft6zoWjY9UCpVo6Ph9ycoWPEveNG2gYrEGuG7TBBDBrydkCdAFgK8t0MW_0LLKOlhJpL7AhoKHAl-KCm_QGWqnq4U6YAxg3cp_akR-PbPIyk_KQqT85F"/>
        </div>
      </header>

      {/* Sidebar Shared Component */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#242b3d] border-r border-white/5 flex flex-col py-8 px-4 hidden lg:flex z-40 font-['Inter'] text-sm shadow-2xl">
        <div className="mt-16 mb-10 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container">hub</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-[#b4c5ff] leading-none">{aceleradora.nombre}</h2>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Ecosistema</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          <SidebarLink icon="dashboard" label="Programas" active />
          <SidebarLink icon="group" label="Perfil Privado" onClick={handlePerfilPrivado} />
        </nav>
        <div className="mt-auto px-4 py-4 rounded-2xl glass-card">
          <p className="text-xs text-on-surface-variant leading-relaxed">¿Quieres acelerar tu startup? Aplica a nuestro pr³ximo batch.</p>
          <button className="mt-3 w-full py-2 primary-glow text-on-primary font-semibold rounded-lg text-xs hover:opacity-90 transition-opacity">Aplicar Ahora</button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="lg:ml-64 pt-24 min-h-screen px-6 pb-12">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Header Section */}
          <section className="flex flex-col md:flex-row items-center md:items-end gap-8 pb-10">
            <div className="relative">
              <div className="w-40 h-40 rounded-2xl border-4 border-surface-container-high overflow-hidden shadow-2xl bg-surface-variant flex items-center justify-center">
                {aceleradora.logotipo ? (
                  <img src={aceleradora.logotipo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                   <span className="material-symbols-outlined text-6xl opacity-50 text-on-surface-variant">hub</span>
                )}
              </div>
              <div className="absolute bottom-2 right-2 w-8 h-8 primary-glow rounded-full flex items-center justify-center border-4 border-background">
                <span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Aceleradora Venture</span>
              <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface">{aceleradora.nombre}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span className="text-sm font-medium">{aceleradora.ubicacion || 'Remoto / Global'}</span>
                <span className="mx-2 opacity-30">|</span>
                <span className="material-symbols-outlined text-sm">stars</span>
                <span className="text-sm font-medium text-primary uppercase">{aceleradora.especialidad || 'Tech Equity'}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-xl bg-surface-container-highest text-on-surface font-semibold hover:bg-surface-bright transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">share</span>
                Compartir
              </button>
              <button className="px-8 py-3 rounded-xl primary-glow text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Seguir Aceleradora
              </button>
            </div>
          </section>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-6">
              <div className="p-8 rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-white/10 flex flex-col justify-between h-full relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
                    <h3 className="font-headline text-xl font-bold uppercase tracking-tight text-on-surface-variant">Propuesta de Valor</h3>
                  </div>
                  <p className="font-body text-xl md:text-2xl leading-relaxed text-primary/70 font-light italic">
                    "{aceleradora.descripcion || 'Empoderamos a los fundadores con recursos y red de primer nivel.'}"
                  </p>
                </div>
                <div className="mt-12 grid grid-cols-3 gap-4 border-t border-outline-variant/10 pt-8">
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Ticket Promedio</p>
                    <p className="text-lg font-bold font-headline text-primary">{aceleradora.ticketPromedio || '$50k'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Empresas</p>
                    <p className="text-lg font-bold font-headline text-primary">+120 Batch</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Exits</p>
                    <p className="text-lg font-bold font-headline text-primary">15 totales</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-6">
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-white/5 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary">category</span>
                  <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-on-surface-variant">Sectores de Inter©s</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(aceleradora.sectoresInteres || ['AI', 'B2B', 'SaaS', 'Cloud']).map((sector, idx) => (
                    <span key={idx} className="px-4 py-2 rounded-full bg-surface-container-highest text-on-surface font-medium text-xs border border-outline-variant/20 hover:border-primary/50 transition-colors">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mentors Section */}
            <div className="md:col-span-12 space-y-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="font-headline text-2xl font-extrabold text-on-surface">Red de Mentores</h3>
                  <p className="text-on-surface-variant text-sm mt-1">Expertos de la industria a tu disposici³n.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(aceleradora.mentores || [
                   { nombre: "Elena Garc­a", cargo: "Ex-VP of Growth @ Stripe", desc: "Experta en escalabilidad." },
                   { nombre: "Marc Schmidt", cargo: "CTO @ UnicornAI", desc: "Especialista en ML Operations." },
                   { nombre: "Sara M©ndez", cargo: "Partner @ Capital Ventures", desc: "Asesor­a en fundraising." },
                   { nombre: "David L³pez", cargo: "Founder @ SaaSFlow", desc: "Estrategias de Go-To-Market." }
                ]).map((m, idx) => (
                  <div key={idx} className="group p-6 rounded-2xl bg-slate-800/40 border border-white/5 hover:bg-slate-700/40 transition-all duration-300 text-center">
                    <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-4 border-2 border-darkBorder group-hover:border-primary/50 transition-colors flex items-center justify-center overflow-hidden">
                       <span className="text-2xl font-black text-slate-600">{m.nombre.charAt(0)}</span>
                    </div>
                    <h4 className="font-headline text-lg font-bold text-on-surface mb-1">{m.nombre}</h4>
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-3">{m.cargo}</p>
                    <p className="text-xs text-on-surface-variant line-clamp-2">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-12 flex flex-col md:flex-row justify-between items-center gap-6 p-10 bg-surface-container-lowest rounded-3xl border border-outline-variant/5">
              <div className="text-center md:text-left">
                <p className="text-on-surface-variant font-headline text-lg font-bold">¿Listo para el siguiente nivel?</p>
                <p className="text-on-surface-variant text-sm">Nuestro programa de aceleraci³n abre convocatorias 2 veces al ano.</p>
              </div>
              <div className="flex gap-4">
                <button className="px-10 py-3 rounded-full primary-glow text-on-primary font-bold shadow-xl shadow-primary/20">Programar entrevista</button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-surface-container-high/95 backdrop-blur-md flex justify-around items-center py-4 px-6 border border-outline-variant/10 z-50 rounded-2xl">
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px]">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          <span className="text-[10px] font-bold">Red</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">rocket</span>
          <span className="text-[10px]">Portfolio</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">Perfil</span>
        </button>
      </nav>
    </div>
  );
}

const SidebarLink = ({ icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer ${active ? 'bg-[#2e3545] text-[#ffffff] shadow-[0_0_15px_rgba(37,99,235,0.2)]' : 'text-[#c3c6d7] opacity-70 hover:bg-[#232a3a] hover:text-[#ffffff]'}`}>
    <span className="material-symbols-outlined">{icon}</span>
    <span>{label}</span>
  </div>
);

export default PerfilPublicoAceleradoras;



