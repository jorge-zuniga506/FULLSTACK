import React, { useEffect } from 'react';
import '../../styles/PerfilPrivStartup.css';
import { useState } from 'react'
import Services from '../../services/Services';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function PerfilPrivadoStartup() {
    const [startups, setStartups] = useState([])
    const [startupFiltrada, setStartupFiltrada] = useState([])
    const [idStartup, setIdStartup] = useState("")
    const [nombreStartup, setNombreStartup] = useState("")
    const [sectorStartup, setSectorStartup] = useState("")
    const [miembrosStartup, setMiembrosStartup] = useState([])
    const [nombreMiembro, setNombreMiembro] = useState("")
    const [funcionMiembro, setFuncionMiembro] = useState("")
    const [urlStartup, setUrlStartup] = useState("")
    const [region, setRegion] = useState("")
    const [latitud, setLatitud] = useState("")
    const [longitud, setLongitud] = useState("")
    const [ano, setAno] = useState("")
    const [correoStartup, setCorreoStartup] = useState("")
    const [contrasenaStartup, setContrasenaStartup] = useState("")
    const [logoStartup, setLogoStartup] = useState("")
    const [arrStartup, setArrStartup] = useState("")
    const [usuariosStartup, setUsuariosStartup] = useState("")
    const [crecimientoStartup, setCrecimientoStartup] = useState("")
    const [sector, setSector] = useState("")
    const [etapa, setEtapa] = useState("")
    const [modelo, setModelo] = useState("")
    const [rondaActualStartup, setRondaActualStartup] = useState("")
    const [raiseStartup, setRaiseStartup] = useState("")
    const [pitchStartup, setPitchStartup] = useState("")
    const [descripcionStartup, setDescripcionStartup] = useState("")
    const [nombre, setNombre] = useState("");
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"))
    const [miembroAEliminar, setMiembroAEliminar] = useState("")
    const [nombreMiembroAEliminar, setNombreMiembroAEliminar] = useState("")
    const [funcionMiembroAEliminar, setFuncionMiembroAEliminar] = useState("")
    const navigate = useNavigate();
    async function anadirMiembro() {
        const nuevoMiembro = {
            nombre: nombreMiembro,
            funcion: funcionMiembro
        };
        const nuevosMiembros = [...miembrosStartup, nuevoMiembro];
        await Services.patchStartups(idStartup, { miembros: nuevosMiembros });
        setMiembrosStartup(nuevosMiembros);
        setNombreMiembro("");
        setFuncionMiembro("");
    }

    useEffect(() => {
        async function obtenerStartups() {
            const data = await Services.getStartups();
            const filtro = data.filter((start) => start.id === usuarioLogueado.id)
            console.log(data);
            console.log(filtro);
            setStartupFiltrada(filtro[0])
            console.log(startupFiltrada);
            if (filtro.length > 0) {
                setIdStartup(filtro[0].id)
                setNombreStartup(filtro[0].nombre)
                setUrlStartup(filtro[0].url)
                setRegion(filtro[0].region)
                setLatitud(filtro[0].latitud)
                setLongitud(filtro[0].longitud)
                setAno(filtro[0].ano)
                setCorreoStartup(filtro[0].correo)
                setContrasenaStartup(filtro[0].contrasena)
                setLogoStartup(filtro[0].logotipo)
                setArrStartup(filtro[0].arr)
                setUsuariosStartup(filtro[0].usuarios)
                setCrecimientoStartup(filtro[0].crecimiento)
                setEtapa(filtro[0].etapa)
                setModelo(filtro[0].modelo)
                setSector(filtro[0].sector)
                setRaiseStartup(filtro[0].raise)
                setPitchStartup(filtro[0].pitch)
                setDescripcionStartup(filtro[0].descripcion)
                setMiembrosStartup(filtro[0].miembros)
                console.log(miembrosStartup);
            }
        }
        obtenerStartups();
    }, [startups])

    async function editarStartup(id) {
        const startupEditada = {
            nombre: nombreStartup,
            miembros: miembrosStartup,
            url: urlStartup,
            region: region,
            latitud: latitud,
            longitud: longitud,
            ano: ano,
            correo: correoStartup,
            contrasena: contrasenaStartup,
            logotipo: logoStartup,
            arr: arrStartup,
            usuarios: usuariosStartup,
            crecimiento: crecimientoStartup,
            sector: sector,
            etapa: etapa,
            modelo: modelo,
            raise: raiseStartup,
            pitch: pitchStartup,
            descripcion: descripcionStartup,
            rol: "startup"
        }
        await Services.putStartup(id, startupEditada)
        alert("Startup editada exitosamente")
    }

    async function eliminarMiembro(miembroAEliminar) {
        const nuevosMiembros = miembrosStartup.filter(miembro => miembro.nombre !== miembroAEliminar.nombre || miembro.funcion !== miembroAEliminar.funcion);
        await Services.patchStartups(idStartup, { miembros: nuevosMiembros });
        setMiembrosStartup(nuevosMiembros);
    }
    const verPerfilPublico = () => {
        navigate('/PublicoStartups');
    }
    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display div-principal">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-darkSurface border-r border-darkBorder flex flex-col fixed h-full z-20">
                <div className="p-6">
                    <div className="d-flex align-items-center gap-2">
                        <div className="logo-box">âš¡</div>
                        <span className="logo-text">
                            Nexxus<span className="text-primary">Cobalt</span>
                        </span>
                    </div>
                    <nav className="space-y-1">
                        <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-[8px] transition-all" href="/">
                            <span className="material-symbols-outlined">home</span>
                            <span className="text-sm font-medium">Inicio</span>
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-[8px] transition-all" href="/AceleradorasBuscador">
                            <span className="material-symbols-outlined">business</span>
                            <span className="text-sm font-medium">Aceleradoras</span>
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-[8px] transition-all" href="#">
                            <span className="material-symbols-outlined">chat_bubble</span>
                            <span className="text-sm font-medium"><Link to="/MensajesStartups">Mensajes</Link></span>
                        </a>
                    </nav>
                </div>
                <div className="mt-auto p-4 border-t border-darkBorder">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold"></span>
                            <span className="text-xs text-slate-500"></span>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-200 border-darkBorder">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-100 bg-slate-800/50">
                        <img className="size-10 rounded-lg object-cover" alt="Profile picture of the accelerator manager" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDml_1P6uo55yBJGbThGG2kMKtXHO6Y9gTOdqda92fkzcQG6J0WCNXI9YndAEO6WEvjoLiA87h-ODTPkGUDQ5tTKZZ-PwK-W-Er0-rxCcrFsjW_5qwNWXB04Gb_eIed3-bJ5GIEEMWltWMvh6tWzumWPyomlKizVbLk2s7HL42vCxTHY_ZT-5cjIc3ellAD3pCdhT2hcYoFf_fm_we4w4DeBfKJ71mC4aDW3X5b40gdxyjfmz4KCK1-ngMTtwoBV1yau9xY0T8eyZL" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{startupFiltrada.nombre || 'Desconocido'}</p>
                            <p className="text-xs text-slate-500 truncate">Startup</p>
                        </div>
                    </div>
                </div>
            </aside>
            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto pb-16">
                <header className="max-w-4xl mx-auto flex flex-wrap justify-between items-end gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black mb-2">Edita el perfil</h1>
                        <p className="text-slate-500 dark:text-slate-400">Actualiza tu perfil para que los inversores te conozcan mejor.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-[8px] border border-darkBorder text-slate-400 text-sm font-semibold hover:bg-slate-800 hover:text-white transition-all" onClick={verPerfilPublico}>
                            Ver Perfil Pºblico
                        </button>

                    </div>
                </header>
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Basic Info Section */}
                    <section className="bg-darkSurface rounded-[8px] border border-darkBorder p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">info</span>
                            Basic Info
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 flex items-center gap-6 mb-2">
                                <div className="relative group">
                                    <div className="size-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden">
                                        <span className="material-symbols-outlined text-slate-400 text-3xl">add_photo_alternate</span>
                                    </div>
                                    <button className="px-6 py-2 rounded-[8px] bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                </div>
                                <div>
                                    <p className="font-bold mb-1">Company Logo</p>
                                    <p className="text-sm text-slate-500">SVG, PNG or JPG (min. 400x400px)</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 mb-1 block">Nombre</label>
                                <input className="w-full bg-slate-800 border-none text-sm rounded-[8px] px-4 py-2.5 focus:ring-1 focus:ring-primary text-white transition-all" type="text" value={nombreStartup} onChange={(e) => setNombreStartup(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 mb-1 block">URL del sitio web</label>
                                <input className="w-full bg-slate-800 border-none text-sm rounded-[8px] px-4 py-2.5 focus:ring-1 focus:ring-primary text-white transition-all" type="url" value={urlStartup} onChange={(e) => setUrlStartup(e.target.value)} />
                            </div>
                        </div>
                    </section>
                    {/* Pitch & Description */}
                    <section className="bg-darkSurface rounded-[8px] border border-darkBorder p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">campaign</span>
                            Pitch &amp; Descripci³n
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 mb-1 block">Short Pitch (una oraci³n)</label>
                                <input className="w-full bg-slate-800 border-none text-sm rounded-[8px] px-4 py-2.5 focus:ring-1 focus:ring-primary text-white transition-all" type="text" value={pitchStartup} onChange={(e) => setPitchStartup(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 mb-1 block">Descripci³n Completa</label>
                                <textarea className="w-full bg-slate-800 border-none text-sm rounded-[8px] px-4 py-2.5 focus:ring-1 focus:ring-primary text-white transition-all" rows="4" value={descripcionStartup} onChange={(e) => setDescripcionStartup(e.target.value)} />
                            </div>
                        </div>
                    </section>
                    {/* Key Metrics */}
                    <section className="bg-darkSurface rounded-[8px] border border-darkBorder p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">query_stats</span>
                            Metricas Clave
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 mb-1 block">ARR ($)</label>
                                <input className="w-full bg-slate-800 border-none text-sm rounded-[8px] px-4 py-2.5 focus:ring-1 focus:ring-primary text-white transition-all" type="text" value={arrStartup} onChange={(e) => setArrStartup(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 mb-1 block">Active Users</label>
                                <input className="w-full bg-slate-800 border-none text-sm rounded-[8px] px-4 py-2.5 focus:ring-1 focus:ring-primary text-white transition-all" type="text" value={usuariosStartup} onChange={(e) => setUsuariosStartup(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 mb-1 block">MoM Growth (%)</label>
                                <input className="w-full bg-slate-800 border-none text-sm rounded-[8px] px-4 py-2.5 focus:ring-1 focus:ring-primary text-white transition-all" type="text" value={crecimientoStartup} onChange={(e) => setCrecimientoStartup(e.target.value)} />
                            </div>
                        </div>
                    </section>
                    {/* Team Members */}
                    <section className="bg-darkSurface rounded-[8px] border border-darkBorder p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">groups</span>
                                Miembros del Equipo
                            </h2>
                            <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline" data-bs-toggle="modal" data-bs-target={`#exampleModal`}>
                                <span className="material-symbols-outlined text-sm">add</span> Anadir Miembro
                            </button>
                        </div>
                        <div className="space-y-4">
                            {miembrosStartup.map((miembro) => (
                                <div key={miembro.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-[8px]">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover" data-alt="Team member Alex Rivera" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuArw9GmdLBkFWnHwagVJaqm-fG6AzrvK-UpDN-OMAjjiJvDEkEjb71iIAh99JPNqPEzGtTY7n8PTG-h2z4IqTh8ABcFvdwm1wydGDCjvo9FIv2UWo_8UeLjKdCPbbJWLmT4Q07l6APTS5JTBCs-2J2cV-2C-WGxrwyzdI04veN7-Jq1UoA6b8_Txd7GJQFCUQ58NJB_7SL98AOwBT4pkEhySQuhUTTZZowAQVY_0ovApPdsh4JhFmpcCEzVPHxW0PIvHjobRgDBHTen')" }}></div>
                                        <div>
                                            <p className="text-sm font-bold">{miembro.nombre}</p>
                                            <p className="text-xs text-slate-500">{miembro.funcion}</p>
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-red-500 transition-colors" onClick={() => eliminarMiembro(miembro)}>
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            ))}
                            <div className="modal fade" id={`exampleModal`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Detalles</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <label htmlFor="nombre" className="col-form-label">Nombre</label>
                                                    <input id='nombre' type="text" className="form-control" placeholder="Nombre" value={nombreMiembro} onChange={(e) => setNombreMiembro(e.target.value)} />
                                                </div>
                                                <div className='col'>
                                                    <label htmlFor="nombre" className="col-form-label">Funcion</label>
                                                    <input id='nombre' type="text" className="form-control" placeholder="Nombre" value={funcionMiembro} onChange={(e) => setFuncionMiembro(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={anadirMiembro}>Anadir</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Fundraising Status */}
                    <section className="bg-darkSurface rounded-[8px] border border-darkBorder p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">monetization_on</span>
                            Estado del Fundraising
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 mb-1 block">Funding Round</label>
                                <select className="w-full bg-slate-800 border-none text-sm rounded-[8px] px-4 py-2.5 focus:ring-1 focus:ring-primary text-white transition-all" value={etapa} onChange={(e) => setEtapa(e.target.value)}>
                                    <option value="Pre Seed">Pre Seed</option>
                                    <option value="Seed">Seed</option>
                                    <option value="Series A">Series A</option>
                                    <option value="Series B">Series B</option>
                                    <option value="Series C+">Series C+</option>
                                    <option value="Late Stage">Growth/Late Stage</option>
                                    <option value="Public">Public (IPO)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 mb-1 block">Target Raise ($)</label>
                                <input className="w-full bg-slate-800 border-none text-sm rounded-[8px] px-4 py-2.5 focus:ring-1 focus:ring-primary text-white transition-all" type="text" value={raiseStartup} onChange={(e) => setRaiseStartup(e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-[8px]">
                                    <input defaultChecked className="mt-0.5 rounded border-darkBorder bg-slate-800 text-primary focus:ring-primary focus:ring-offset-slate-900" id="open-round" type="checkbox" />
                                    <label className="text-sm text-slate-400 leading-relaxed cursor-pointer" htmlFor="open-round">
                                        Currently seeking investment. Make profile visible to verified investors.
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Action Footer */}
                    <div className="flex items-center justify-end gap-4 py-8 border-t border-slate-200 dark:border-slate-800">
                        <button className="px-4 py-2 rounded-[8px] border border-darkBorder text-slate-400 text-sm font-semibold hover:bg-slate-800 hover:text-white transition-all" onClick ={
                            () => {
                                setNombreStartup("")
                                setUrlStartup("")
                                setCorreoStartup("")
                                setPitchStartup("")
                                setDescripcionStartup("")
                                setArrStartup("")
                                setUsuariosStartup("")
                                setCrecimientoStartup("")
                                setRondaActualStartup("")
                                setRaiseStartup("")
                            }

                        }>
                            Cancelar
                        </button>
                        <button className="px-6 py-2 rounded-[8px] bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all" onClick={() => editarStartup(idStartup)}>
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PerfilPrivadoStartup;




