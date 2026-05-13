import React, { useState } from 'react';
import '../../styles/PerfilPrivInversor.css';
import { useEffect } from 'react';
import Services from '../../services/Services';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function PerfilPrivadoInversor() {
    const [inversores, setInversores] = useState([])
    const [inversorFiltrado, setInversorFiltrado] = useState([])
    const [idInversor, setIdInversor] = useState("")
    const [nombreInversor, setNombreInversor] = useState("")
    const [correoInversor, setCorreoInversor] = useState("")
    const [contrasenaInversor, setContrasenaInversor] = useState("")
    const [tesisInversor, setTesisInversor] = useState("")
    const [sectoresInteresInversor, setSectoresInteresInversor] = useState([])
    const [nombreSector, setNombreSector] = useState("")
    const [portafolioInversor, setPortafolioInversor] = useState([])
    const [nombreStartup, setNombreStartup] = useState("")
    const [sectorStartup, setSectorStartup] = useState("")
    const [rondaActualStartup, setRondaActualStartup] = useState("")
    const [inversionStartup, setInversionStartup] = useState("")
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"))
    const navigate = useNavigate();
    useEffect(() => {
        async function obtenerInversores() {
            const data = await Services.getInversores()
            const filtro = data.filter(inversor => inversor.id == usuarioLogueado.id)
            setInversores(data)
            setInversorFiltrado(filtro)
            setIdInversor(filtro[0].id)
            setNombreInversor(filtro[0].nombre)
            setCorreoInversor(filtro[0].correo)
            setContrasenaInversor(filtro[0].contrasena)
            setTesisInversor(filtro[0].tesis)
            setSectoresInteresInversor(filtro[0].sectoresInteres)
            setPortafolioInversor(filtro[0].portafolio)
        }
        obtenerInversores()
    }, [])

    async function editarInversor(id) {
        const inversorEditado = {
            nombre: nombreInversor,
            correo: correoInversor,
            contrasena: contrasenaInversor,
            rol: "inversor",
            tesis: tesisInversor,
            sectoresInteres: sectoresInteresInversor,
            portafolio: portafolioInversor
        }
        await Services.putInversores(id, inversorEditado)
        alert("Inversor editado exitosamente")
    }

    async function anadirSector() {
        const nuevosSectores = [...sectoresInteresInversor, nombreSector];
        await Services.patchInversores(idInversor, { sectoresInteres: nuevosSectores });
        setSectoresInteresInversor(nuevosSectores);
    }

    async function anadirInversion() {
        const startup = {
            nombre: nombreStartup,
            sector: sectorStartup,
            rondaActual: rondaActualStartup,
            inversion: inversionStartup
        };
        const nuevoPortafolio = [...portafolioInversor, startup];
        await Services.patchInversores(idInversor, { portafolio: nuevoPortafolio });
        setPortafolioInversor(nuevoPortafolio);
        setNombreStartup("");
        setSectorStartup("");
        setRondaActualStartup("");
        setInversionStartup("");
    }

    async function eliminarStartup(startupAEliminar) {
        const nuevoPortafolio = portafolioInversor.filter(startup => startup.nombre !== startupAEliminar.nombre);
        await Services.patchInversores(idInversor, { portafolio: nuevoPortafolio });
        setPortafolioInversor(nuevoPortafolio);
    }

    const irPerfilPublico = () => {
        navigate('/PublicoInversores');
    }
    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display div-principal">
            {/* SideNavBar */}
            <aside className="w-64 border-r border-darkBorder bg-darkSurface hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-6 flex items-center gap-3">
                    <h2 className="text-xl font-bold tracking-tight text-primary">Nexus Cobalt</h2>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all" href="#">
                        <span className="material-symbols-outlined">star</span>
                        <span className="text-sm font-medium"><Link to="/Mapa">Startups</Link></span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all" href="#">
                        <span className="material-symbols-outlined">person</span>
                        <span className="text-sm font-medium"><Link to="/PerfilPrivadoInversor">Perfil</Link></span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all" href="/MensajesInversores">
                        <span className="material-symbols-outlined">mail</span>
                        <span className="text-sm font-medium">Mensajes</span>
                    </a>
                </nav>
                <div className="p-4 mt-auto border-t border-primary/10">
                    <div className="flex items-center gap-3 p-2">
                        <div className="size-10 rounded-full bg-primary/20 border border-primary/30 overflow-hidden">
                            <img className="size-10 rounded-lg object-cover" alt="Profile picture of the accelerator manager" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDml_1P6uo55yBJGbThGG2kMKtXHO6Y9gTOdqda92fkzcQG6J0WCNXI9YndAEO6WEvjoLiA87h-ODTPkGUDQ5tTKZZ-PwK-W-Er0-rxCcrFsjW_5qwNWXB04Gb_eIed3-bJ5GIEEMWltWMvh6tWzumWPyomlKizVbLk2s7HL42vCxTHY_ZT-5cjIc3ellAD3pCdhT2hcYoFf_fm_we4w4DeBfKJ71mC4aDW3X5b40gdxyjfmz4KCK1-ngMTtwoBV1yau9xY0T8eyZL" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold truncate">{nombreInversor ? nombreInversor : 'Desconocido'}</span>
                            <span className="text-xs text-slate-500">Inversor</span>
                        </div>
                    </div>
                    <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-sm font-bold hover:bg-red-500/10 hover:text-red-500 transition-all">
                        <span className="material-symbols-outlined text-sm">logout</span>
                        <Link to="/Login">Ir a Login</Link>
                    </button>
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* Header */}
                <header className="h-16 border-b border-darkBorder bg-darkSurface/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
                    <h1 className="text-lg font-bold">Editar Perfil</h1>
                    <div className="flex items-center gap-4">
                        <button className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={irPerfilPublico}>
                            Ver Perfil Pºblico
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all" onClick={() => editarInversor(idInversor)}>
                            Guardar Cambios
                        </button>
                    </div>
                </header>
                <div className="max-w-4xl mx-auto w-full p-8 space-y-12">
                    {/* Profile Section */}
                    <section>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative group">
                                <div className="size-24 rounded-full border-4 border-primary/20 overflow-hidden bg-slate-800">
                                    <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400"><span className="material-symbols-outlined text-5xl">person</span></div>
                                </div>
                                <button className="absolute bottom-0 right-0 size-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg border-2 border-background-dark">
                                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                                </button>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Informaci³n Personal</h2>
                                <p className="text-slate-500 dark:text-slate-400">Actualiza tus datos de contacto y biograf­a pºblica.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium px-1">Nombre</label>
                                <input className="w-full bg-slate-800 border-none text-sm rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary outline-none transition-all text-white" type="text" value={nombreInversor} onChange={(e) => setNombreInversor(e.target.value)} />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium px-1">Email Profesional</label>
                                <input className="w-full bg-slate-800 border-none text-sm rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary outline-none transition-all text-white" type="email" value={correoInversor} onChange={(e) => setCorreoInversor(e.target.value)} />
                            </div>
                        </div>
                    </section>
                    <hr className="border-darkBorder" />
                    {/* Investment Thesis */}
                    <section className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">Tesis de Inversi³n</h2>
                            <p className="text-slate-500 dark:text-slate-400">Describe qu© buscas en las startups y cu¡l es tu valor anadido.</p>
                        </div>
                        <div className="space-y-2">
                            <textarea className="w-full bg-slate-800 border-none text-sm rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary outline-none transition-all text-white" placeholder="Escribe tu tesis aqu­..." rows="4" value={tesisInversor} onChange={(e) => setTesisInversor(e.target.value)} />
                        </div>
                    </section>
                    {/* Interested Sectors */}
                    <section className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">Sectores de Inter©s</h2>
                            <p className="text-slate-500 dark:text-slate-400">Selecciona los mercados donde prefieres invertir.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {sectoresInteresInversor.map((sector) =>(
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold transition-all shadow-md">
                                <span className="material-symbols-outlined text-lg">payments</span>
                                {sector}
                            </button>
                            ))}
                            <button className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-darkBorder rounded-full text-sm font-semibold text-slate-400 hover:border-primary/60 transition-all" data-bs-toggle="modal" data-bs-target={`#exampleModal`}>
                                <span className="material-symbols-outlined text-lg">add</span>
                                Anadir
                            </button>
                            <div className="modal fade" id={`exampleModal`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Detalles</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className='row'>
                                                    <label htmlFor="nombre" className="col-form-label">Nombre</label>
                                                    <input id='nombre' type="text" className="form-control" placeholder="Nombre" value={nombreSector} onChange={(e) => setNombreSector(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={anadirSector}>Anadir</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <hr className="border-darkBorder" />
                    {/* Portfolio Management */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Gesti³n de Portafolio</h2>
                                <p className="text-slate-500 dark:text-slate-400">Listado de startups en las que has invertido.</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors" data-bs-toggle="modal" data-bs-target={`#exampleModal2`}>
                                <span className="material-symbols-outlined text-sm">add</span>
                                Nueva Inversi³n
                            </button>
                            <div className="modal fade" id={`exampleModal2`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                    <input id='nombre' type="text" className="form-control" placeholder="Nombre" value={nombreStartup} onChange={(e) => setNombreStartup(e.target.value)} />
                                                </div>
                                                <div className='col'>
                                                    <label htmlFor="nombre" className="col-form-label">Sector</label>
                                                    <input id='nombre' type="text" className="form-control" placeholder="Nombre" value={sectorStartup} onChange={(e) => setSectorStartup(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col'>
                                                    <label htmlFor="nombre" className="col-form-label">Ronda Actual</label>
                                                    <input id='nombre' type="text" className="form-control" placeholder="Nombre" value={rondaActualStartup} onChange={(e) => setRondaActualStartup(e.target.value)} />
                                                </div>
                                                <div className='col'>
                                                    <label htmlFor="nombre" className="col-form-label">Inversion Actual</label>
                                                    <input id='nombre' type="text" className="form-control" placeholder="Nombre" value={inversionStartup} onChange={(e) => setInversionStartup(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={anadirInversion}>Anadir</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {/* Portfolio Item 1 */}
                            {portafolioInversor.map((startup) =>(
                            <div className="flex items-center gap-4 p-4 bg-darkSurface border border-darkBorder rounded-xl hover:border-primary/30 transition-all group">
                                <div className="size-12 rounded-lg bg-slate-800 flex items-center justify-center">
                                    <img alt="Startup Logo" className="w-8 h-8 object-contain" data-alt="Abstract minimalist startup logo design" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR05hXUVDxwLjYW4UwiuSHecW7XBcYTeK8ZTph5Xt1cTeWEFTESbb7qQ4eW7UAaLf0W9MMezXG6_-gDugBCYi-FKs2QOBR6YIkQ4n-iJFl4RiNnB-A2Di4NMgCw2jF2mG8BcF9Gw6VTPQnzXzmUkJNp-99lbgNmv2GZ2VMHLmw_HLao7HZC86lN5tZA4PkVDiVHbb1i6HNtKsjVJ23xWJ9YaALn5eKWH9GE2pU7Ty2oYSVaDfQOIusHEdJ19QWaIe6gCxLNx0odxOj" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold truncate">{startup.nombre}</h4>
                                    <p className="text-xs text-slate-500">{startup.sector} â€¢ {startup.rondaActual}</p>
                                </div>
                                <div className="text-right px-4">
                                    <span className="block text-sm font-bold">{startup.inversion}</span>

                                </div>
                                <button className="p-2 text-slate-400 hover:text-red-500 transition-colors" onClick={() => eliminarStartup(startup)}>
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                            ))}
                        </div>
                    </section>
                    {/* Save Changes Fixed Bottom for Mobile */}
                    <div className="md:hidden pt-8">
                        <button className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20">
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PerfilPrivadoInversor;




