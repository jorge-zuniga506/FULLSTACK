import React from 'react';
import '../../styles/PerfilPrivAceleradora.css';
import { useState, useEffect } from 'react';
import Services from '../../services/Services';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
function PerfilPrivadoAceleradora() {
    const [aceleradoraFiltrada, setAceleradoraFiltrada] = useState(null);
    const [mentoresAceleradora, setMentoresAceleradora] = useState([]);
    const [serviciosAceleradora, setServiciosAceleradora] = useState([]);
    const navigate = useNavigate();
    // Estados para los formularios de edici³n
    const [nombreServicio, setNombreServicio] = useState("");
    const [descripcionServicio, setDescripcionServicio] = useState("");
    const [duracionServicio, setDuracionServicio] = useState("");
    const [inversionServicio, setInversionServicio] = useState("");
    const [servicioAEditar, setServicioAEditar] = useState(null);

    const [nombreMentor, setNombreMentor] = useState("");
    const [funcionMentor, setFuncionMentor] = useState("");

    // Estado unificado para los datos de la aceleradora
    const [formData, setFormData] = useState({
        nombre: "",
        url: "",
        descripcion: "",
        correo: "",
        contrasena: "",
        logotipo: "",
        startupsAceleradas: "",
        modeloAceleracion: "",
        etapaObjetivo: "",
        ubicacion: "",
        aplicacionesRecibidas: "",
        startupsSeleccionadas: "",
        startupsActivas: "",
        startupsGraduadas: "",
    });

    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

    // 2. Efectos
    useEffect(() => {
        async function obtenerAceleradoras() {
            const data = await Services.getAceleradoras();
            if (!usuarioLogueado) return;
            const filtro = data.filter(ac => ac.id == usuarioLogueado.id);

            if (filtro.length > 0) {
                const ac = filtro[0];
                setAceleradoraFiltrada(ac);
                setFormData({
                    nombre: ac.nombre || "",
                    url: ac.url || "",
                    correo: ac.correo || "",
                    contrasena: ac.contrasena || "",
                    logotipo: ac.logotipo || "",
                    startupsAceleradas: ac.startupsAceleradas || "",
                    modeloAceleracion: ac.modeloAceleracion || "",
                    etapaObjetivo: ac.etapaObjetivo || "",
                    ubicacion: ac.ubicacion || "",
                    descripcion: ac.descripcion || "",
                    aplicacionesRecibidas: ac.aplicacionesRecibidas || "",
                    startupsSeleccionadas: ac.startupsSeleccionadas || "",
                    startupsActivas: ac.startupsActivas || "",
                    startupsGraduadas: ac.startupsGraduadas || "",
                });
                setMentoresAceleradora(ac.mentores || []);
                setServiciosAceleradora(ac.servicios || []);
            }
        }
        obtenerAceleradoras();
    }, [usuarioLogueado]);

    // 3. Funciones de l³gica
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    async function eliminarServicio(servicio) {
        const nuevos = serviciosAceleradora.filter(s => s.nombre !== servicio.nombre);
        await Services.patchAceleradoras(aceleradoraFiltrada.id, { servicios: nuevos });
        setServiciosAceleradora(nuevos);
    }

    async function actualizarServicio(id) {
        const nuevosServicios = serviciosAceleradora.map((s, index) => {
            if (index === servicioAEditar) {
                return {
                    ...s,
                    nombre: nombreServicio,
                    descripcion: descripcionServicio,
                    duracion: duracionServicio,
                    inversion: inversionServicio
                };
            }
            return s;
        });
        await Services.patchAceleradoras(id, { servicios: nuevosServicios });
        setServiciosAceleradora(nuevosServicios);
    }

    async function anadirMentor() {
        if (!nombreMentor || !funcionMentor) return;
        const nuevoMentor = { nombre: nombreMentor, funcion: funcionMentor };
        const nuevosMentores = [...mentoresAceleradora, nuevoMentor];
        await Services.patchAceleradoras(aceleradoraFiltrada.id, { mentores: nuevosMentores });
        setMentoresAceleradora(nuevosMentores);
        setNombreMentor("");
        setFuncionMentor("");
    }

    async function eliminarMentor(mentorAEliminar) {
        const nuevos = mentoresAceleradora.filter(m => m.nombre !== mentorAEliminar.nombre);
        await Services.patchAceleradoras(aceleradoraFiltrada.id, { mentores: nuevos });
        setMentoresAceleradora(nuevos);
    }

    async function EditarDatosAceleradora() {
        if (!aceleradoraFiltrada) return;
        await Services.putAceleradoras(aceleradoraFiltrada.id, {
            ...formData,
            mentores: mentoresAceleradora,
            servicios: serviciosAceleradora,
            rol: "aceleradora"
        });
        alert("Cambios guardados");
    }
    const irPerfilPublico = () => {
        navigate('/PublicoAceleradoras');
    }
    return (
        <div className="flex h-screen overflow-hidden div-principal font-display text-slate-900 dark:text-slate-100 min-h-screen bg-darkBg">
            {/* Sidebar Navigation */}
            <aside className="w-72 border-r border-slate-200 flex flex-col bg-darkSurface border-darkBorder">
                <div className="p-6 flex items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                        <div className="logo-box">âš¡</div>
                        <span className="logo-text">
                            Nexxus<span className="text-primary">Cobalt</span>
                        </span>
                    </div>
                </div>
                <nav className="flex-1 px-4 space-y-2 py-4">
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" href="/">
                        <span className="material-symbols-outlined">home</span>
                        <span className="text-sm font-medium">Inicio</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 bg-primary/10 rounded-xl transition-colors bg-primary text-white" href="#">
                        <span className="material-symbols-outlined">corporate_fare</span>
                        <span className="text-sm font-medium">Perfil de Aceleradora</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" href="/PrincipalAceleradoras">
                        <span className="material-symbols-outlined">handyman</span>
                        <span className="text-sm font-medium">Startups</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" href="/MensajesAceleradoras">
                        <span className="material-symbols-outlined">mail</span>
                        <span className="text-sm font-medium">Mensajes</span>
                    </a>
                </nav>
                <div className="p-4 border-t border-slate-200 border-darkBorder">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-100 bg-slate-800/50">
                        <img className="size-10 rounded-lg object-cover" alt="Profile picture of the accelerator manager" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDml_1P6uo55yBJGbThGG2kMKtXHO6Y9gTOdqda92fkzcQG6J0WCNXI9YndAEO6WEvjoLiA87h-ODTPkGUDQ5tTKZZ-PwK-W-Er0-rxCcrFsjW_5qwNWXB04Gb_eIed3-bJ5GIEEMWltWMvh6tWzumWPyomlKizVbLk2s7HL42vCxTHY_ZT-5cjIc3ellAD3pCdhT2hcYoFf_fm_we4w4DeBfKJ71mC4aDW3X5b40gdxyjfmz4KCK1-ngMTtwoBV1yau9xY0T8eyZL" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{formData.nombre || 'Desconocido'}</p>
                            <p className="text-xs text-slate-500 truncate">Aceleradora</p>
                        </div>
                    </div>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <header className="top-0 z-10 backdrop-blur-md border-b border-slate-200 px-8 py-6 bg-darkSurface/50 border-darkBorder">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold">Edici³n de Perfil</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Gestiona la informaci³n y los detalles t©cnicos de tu programa de aceleraci³n.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={irPerfilPublico}>
                                Ver Perfil Pºblico
                            </button>
                            <button className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity" onClick={() => (EditarDatosAceleradora(aceleradoraFiltrada))}>
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </header>
                <div className="max-w-5xl mx-auto p-8 space-y-12">
                    {/* General Information */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-primary">info</span>
                            <h3 className="text-lg font-bold">Informaci³n General</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200 shadow-sm bg-darkSurface border-darkBorder">
                            <div className="md:col-span-2 flex items-center gap-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="relative group">
                                    <div className="size-24 rounded-2xl bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                        <img className="w-full h-full object-cover" alt="Modern tech startup office lobby" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm0MSaIscG9Ik_QmVnDW0eCGyTw2r_x2ZeW72eVAFN9ttiYczUCG1djvl4TW21I473mXrqsJYnSaa3IPpQtABWL-jdRfsoya6LV32-tJS8cDpfMFuFGkTdKAGcqby_EQvfw6xlqUr5Ux0d45ZsX9eALr6m9tKqxzIOdIUOWJt0ujyOYgKY7-NJMXk2AiCYfIlCpZRrptSZtwttcAGEWXmJTmk5V-8YE8UbuaWapzs8k00jUa8in21Lxlgt_X3VEeJEbtwZxtxZ54I4" />
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-slate-900">
                                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                                    </button>
                                </div>
                                <div>
                                    <h4 className="font-bold">Logotipo de la Aceleradora</h4>
                                    <p className="text-xs text-slate-500 mt-1">Recomendado: 400x400px. Formatos: PNG, JPG.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre de la Aceleradora</label>
                                <input className="w-full border-slate-200 rounded-xl focus:ring-primary focus:border-primary bg-slate-800/50 border-darkBorder text-slate-200" type="text" name="nombre" // ¡Importante!
                                    value={formData.nombre}
                                    onChange={handleInputChange} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sitio Web</label>
                                <input className="w-full border-slate-200 rounded-xl focus:ring-primary focus:border-primary bg-slate-800/50 border-darkBorder text-slate-200" type="url" name="url" // ¡Importante!
                                    value={formData.url}
                                    onChange={handleInputChange} />
                            </div>
                            <div className="md:col-span-2 flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Descripci³n del Programa</label>
                                <textarea className="w-full border-slate-200 rounded-xl focus:ring-primary focus:border-primary bg-slate-800/50 border-darkBorder text-slate-200" rows="4" name="descripcion" // ¡Importante!
                                    value={formData.descripcion}
                                    onChange={handleInputChange} ></textarea>
                            </div>
                        </div>
                    </section>
                    {/* Program Details */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-primary">calendar_today</span>
                            <h3 className="text-lg font-bold">Programas</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200 shadow-sm bg-darkSurface border-darkBorder">
                            <Table striped bordered hover variant="dark">
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Detalles</th>
                                        <th scope='col'>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviciosAceleradora.map((servicio, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <th>{index + 1}</th>
                                                <th>{servicio.nombre}</th>
                                                <th><button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#exampleModal${index}`} onClick={() => {
                                                    setServicioAEditar(index);
                                                    setNombreServicio(servicio.nombre);
                                                    setDescripcionServicio(servicio.descripcion);
                                                    setDuracionServicio(servicio.duracion);
                                                    setInversionServicio(servicio.inversion);
                                                }}>Detalles del servicio</button></th>
                                                <th style={{ width: "200px" }}><button className='btn btn-danger' onClick={() => eliminarServicio(servicio)}>Eliminar</button></th>
                                            </tr>
                                            <div className="modal fade" id={`exampleModal${index}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Detalles</h1>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <div className='row'>
                                                                <div className="col">
                                                                    <label htmlFor={`nombre-${index}`} className="col-form-label">Nombre</label>
                                                                    <input id={`nombre-${index}`} type="text" className="form-control" placeholder="Nombre" value={servicioAEditar === index ? nombreServicio : servicio.nombre} onChange={(e) => setNombreServicio(e.target.value)} />
                                                                </div>

                                                                <div className="col">
                                                                    <label htmlFor={`descripcion-${index}`} className="col-form-label">Descripcion</label>
                                                                    <input id={`descripcion-${index}`} type="text" className="form-control" placeholder="Descripcion" value={servicioAEditar === index ? descripcionServicio : servicio.descripcion} onChange={(e) => setDescripcionServicio(e.target.value)} />
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col">
                                                                    <label htmlFor={`duracion-${index}`} className="col-form-label">Duracion</label>
                                                                    <input id={`duracion-${index}`} type="text" className="form-control" placeholder="Duracion" value={servicioAEditar === index ? duracionServicio : servicio.duracion} onChange={(e) => setDuracionServicio(e.target.value)} />
                                                                </div>
                                                                <div className="col">
                                                                    <label htmlFor={`inversion-${index}`} className="col-form-label">Inversion</label>
                                                                    <input id={`inversion-${index}`} type="text" className="form-control" placeholder="Inversion" value={servicioAEditar === index ? inversionServicio : servicio.inversion} onChange={(e) => setInversionServicio(e.target.value)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button className='btn btn-success' onClick={() => actualizarServicio(aceleradoraFiltrada.id)} data-bs-dismiss="modal">Actualizar</button>
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </section>
                    {/* Mentors Management */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">psychology</span>
                                <h3 className="text-lg font-bold">Mentores Destacados</h3>
                            </div>
                            <button className="flex items-center gap-2 text-sm font-semibold hover:underline text-primary" data-bs-toggle="modal" data-bs-target={`#exampleModal`}>
                                <span className="material-symbols-outlined text-sm">add</span>Anadir Mentor
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Mentor Card 1 */}
                            {mentoresAceleradora.map((mentor) => (
                                <div key={mentor.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 group relative">
                                    <img className="size-14 rounded-full object-cover" alt="Portrait of a male mentor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4S1OF9j4cOtrUu14nR4IcVwGOXe-Llwx_FykeUwsz9Bhr8k3s86-WG4pqBBuU_gHHCn_nz5GSQPmG4L84XKNN0nH4qHnXeQQrhUg-xy6QOlv1oV33x6y34k-MLLc0_VipiYzO6gHs17k8knMy4_-p9-4SmGjwtUGj6kjeVkkwWKtCwrqlYRAxAzYoC4_EYN-afe9ankMobAagTyPvrpmfhYN8IBoRIiGo1r76khMXRb92sV16ZyZd1e85x_JH4hAW_9T9EcsRSuZ-" />
                                    <div className="min-w-0">
                                        <h4 className="font-bold truncate">{mentor.nombre}</h4>
                                        <p className="text-xs text-slate-500">{mentor.funcion}</p>
                                    </div>
                                    <button className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => eliminarMentor(mentor)}>
                                        <span className="material-symbols-outlined text-lg">close</span>
                                    </button>
                                </div>
                            ))}
                            {/* Mentor Card 2 */}
                            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Detalles</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className="col">
                                                    <label htmlFor="nombre" className="col-form-label">Nombre</label>
                                                    <input id='nombre' type="text" className="form-control" placeholder="Nombre" value={nombreMentor} onChange={(e) => setNombreMentor(e.target.value)} />
                                                </div>
                                                <div className="col">
                                                    <label htmlFor="funcion" className="col-form-label">Funcion</label>
                                                    <input id='funcion' type="text" className="form-control" placeholder="Funcion" value={funcionMentor} onChange={(e) => setFuncionMentor(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button className='btn btn-success' onClick={anadirMentor} data-bs-dismiss="modal">Anadir</button>
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default PerfilPrivadoAceleradora;




