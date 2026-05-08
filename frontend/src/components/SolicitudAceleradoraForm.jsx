
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Services from '../services/Services';
import '../styles/SolicitudAceleradoraForm.css';

function SolicitudAceleradoraForm() {
    const [nombre, setNombre] = useState("")
    const [url, setUrl] = useState("")
    const [correo, setCorreo] = useState("")
    const [contraseña, setContraseña] = useState("")
    const [logotipo, setLogotipo] = useState("")
    const [startupsAceleradas, setStartupsAceleradas] = useState([])
    const [modeloAceleracion, setModeloAceleracion] = useState("")
    const [etapaObjetivo, setEtapaObjetivo] = useState("")
    const [listaServicios, setListaServicios] = useState([])
    const [nombreServicio, setNombreServicio] = useState("")
    const [descripcionServicio, setDescripcionServicio] = useState("")
    const [duracionServicio, setDuracionServicio] = useState("")
    const [inversionServicio, setInversionServicio] = useState("")
    const [ubicacion, setUbicacion] = useState("")
    const [nombreMentorAceleradora, setNombreMentorAceleradora] = useState("")
    const [funcionMentorAceleradora, setFuncionMentorAceleradora] = useState("")
    const [listaMentoresAceleradora, setListaMentoresAceleradora] = useState([])
    const [descripcion, setDescripcion] = useState("")
    const [rol, setRol] = useState("aceleradora")
    const validatePassword = (pass) => {
        // At least 8 characters, one uppercase, one number
        const re = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        return re.test(pass);
    };

    function enviarSolicitud() {
        const objAceleradora = {
            nombre: nombre,
            url: url,
            correo: correo,
            contraseña: contraseña,
            logotipo: logotipo,
            startupsAceleradas: startupsAceleradas,
            modeloAceleracion: modeloAceleracion,
            etapaObjetivo: etapaObjetivo,
            servicios: listaServicios,
            ubicacion: ubicacion,
            descripcion: descripcion,
            rol: rol,
            mentores: listaMentoresAceleradora,
            aplicacionesRecibidas: 0,
            startupsSeleccionadas: 0,
            startupsActivas: 0,
            startupsGraduadas: 0
        }
        if (!nombre || !url || !correo || !contraseña || !logotipo || !descripcion) {
            alert("Coloca Todos los datos")
            return;
        }

        if (!validatePassword(contraseña)) {
            alert("La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula y un número.");
            return;
        }

        async function enviarSolicitudes(objAceleradora) {
            const enviar = await Services.postSolicitudesAceleradoras(objAceleradora)
            console.log(enviar)
        }
        enviarSolicitudes(objAceleradora)
        alert("Solicitud Enviada")
    }

    function agregarMentor() {
        if (!nombreMentorAceleradora || !funcionMentorAceleradora) return;
        const objMentorAceleradora = {
            nombre: nombreMentorAceleradora,
            funcion: funcionMentorAceleradora
        }
        setListaMentoresAceleradora([...listaMentoresAceleradora, objMentorAceleradora])
        setNombreMentorAceleradora("")
        setFuncionMentorAceleradora("")
    }

    function agregarServicio(){
        if (!nombreServicio || !descripcionServicio) return;
        const objServicio = {
            nombre: nombreServicio,
            descripcion: descripcionServicio,
            duracion: duracionServicio,
            inversion: inversionServicio
        }
        setListaServicios([...listaServicios, objServicio])
        setNombreServicio("")
        setDescripcionServicio("")
        setDuracionServicio("")
        setInversionServicio("")
    }

    return (
        <div className="min-h-screen bg-darkBg text-slate-100 font-sans form-gradient-bg">
            <nav className="flex items-center justify-between px-8 py-6 border-b border-darkBorder bg-darkSurface/30 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg text-white flex items-center justify-center">
                        <span className="material-symbols-outlined">rocket_launch</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">StartupHub</span>
                </div>
                <Link to="/" className="btn-secondary-custom flex items-center gap-2 no-underline">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Volver a inicio
                </Link>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Registro de Aceleradora</h1>
                    <p className="text-slate-400 text-lg">Complete el formulario para solicitar su cuenta de plataforma y conectar con startups.</p>
                </div>

                <div className="glass-panel p-8 md:p-10 space-y-10">
                    {/* Sección: Información Básica */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined">info</span>
                            <h2 className="text-xl font-bold text-slate-100">Información Básica</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="input-group-custom">
                                <label className="input-label">Nombre de la empresa</label>
                                <input className="input-field" placeholder="Ej. InnovaTech" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            </div>
                            <div className="input-group-custom">
                                <label className="input-label">URL del sitio web</label>
                                <input className="input-field" placeholder="https://www.aceleradora.com" type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
                            </div>
                            <div className="input-group-custom">
                                <label className="input-label">Correo electrónico de contacto</label>
                                <input className="input-field" placeholder="ejemplo@correo.com" type="text" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                            </div>
                             <div className="input-group-custom">
                                 <label className="input-label">Contraseña</label>
                                 <input className="input-field" placeholder="••••••••" type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} />
                                 <p className="text-[10px] text-slate-500 mt-2 italic">Mínimo 8 caracteres, incluyendo una mayúscula y un número.</p>
                             </div>
                        </div>
                        <div className="mt-6">
                            <label className="input-label mb-2 block">Logotipo de la aceleradora</label>
                            <div className="flex items-center gap-4">
                                <div className="file-input-wrapper">
                                    <button className="btn-secondary-custom flex items-center gap-2">
                                        <span className="material-symbols-outlined">upload_file</span>
                                        Elegir archivo
                                    </button>
                                    <input type="file" onChange={(e) => setLogotipo(e.target.value)} />
                                </div>
                                <span className="text-sm text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px]">
                                    {logotipo ? logotipo.split('\\').pop() : 'No se ha seleccionado archivo'}
                                </span>
                            </div>
                        </div>
                    </section>

                    <div className="section-divider"></div>

                    {/* Sección: Detalles por Programa */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined">dashboard</span>
                            <h2 className="text-xl font-bold text-slate-100">Detalles del Programa</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="input-group-custom">
                                <label className="input-label">Startups Aceleradas</label>
                                <input className="input-field" placeholder="Cantidad Total" type="text" value={startupsAceleradas} onChange={(e) => setStartupsAceleradas(e.target.value)} />
                            </div>
                            <div className="input-group-custom">
                                <label className="input-label">Modelo de Aceleración</label>
                                <input className="input-field" placeholder="Ej. Remoto, Híbrido" type="text" value={modeloAceleracion} onChange={(e) => setModeloAceleracion(e.target.value)} />
                            </div>
                            <div className="input-group-custom">
                                <label className="input-label">Etapa Objetivo</label>
                                <input className="input-field" placeholder="Ej. Pre-Seed, Seed" type="text" value={etapaObjetivo} onChange={(e) => setEtapaObjetivo(e.target.value)} />
                            </div>
                            <div className="input-group-custom">
                                <label className="input-label">Ubicación</label>
                                <input className="input-field" placeholder="Ciudad, País" type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
                            </div>
                        </div>
                        <div className="mt-6 input-group-custom">
                            <label className="input-label">Descripción</label>
                            <textarea 
                                className="input-field min-h-[120px]" 
                                placeholder="Describa su solución, mercado objetivo y problema que resuelve..." 
                                value={descripcion} 
                                onChange={(e) => setDescripcion(e.target.value)} 
                            />
                        </div>
                    </section>

                    <div className="section-divider"></div>

                    {/* Sección: Miembros */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-primary">
                                <span className="material-symbols-outlined">groups</span>
                                <h2 className="text-xl font-bold text-slate-100">Mentores</h2>
                            </div>
                            <span className="badge-count text-white">{listaMentoresAceleradora.length}</span>
                        </div>
                        
                        <div className="bg-darkBg/30 p-6 rounded-xl border border-darkBorder mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="input-group-custom">
                                    <label className="input-label">Nombre</label>
                                    <input className="input-field" placeholder="Nombre completo" type="text" value={nombreMentorAceleradora} onChange={(e) => setNombreMentorAceleradora(e.target.value)} />
                                </div>
                                <div className="input-group-custom">
                                    <label className="input-label">Función</label>
                                    <input className="input-field" placeholder="Ej. Mentor principal" type="text" value={funcionMentorAceleradora} onChange={(e) => setFuncionMentorAceleradora(e.target.value)} />
                                </div>
                            </div>
                            <button onClick={agregarMentor} className="btn-secondary-custom mt-4 flex items-center gap-2 w-full justify-center">
                                <span className="material-symbols-outlined text-sm">person_add</span>
                                Añadir Mentor
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {listaMentoresAceleradora.map((mentor, index) => (
                                <div key={index} className="list-item-card">
                                    <div>
                                        <p className="font-bold text-slate-100">{mentor.nombre}</p>
                                        <p className="text-sm text-slate-400">{mentor.funcion}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-500">face</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="section-divider"></div>

                    {/* Sección: Servicios */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-primary">
                                <span className="material-symbols-outlined">handshake</span>
                                <h2 className="text-xl font-bold text-slate-100">Servicios Brindados</h2>
                            </div>
                            <span className="badge-count text-white">{listaServicios.length}</span>
                        </div>

                        <div className="bg-darkBg/30 p-6 rounded-xl border border-darkBorder mb-6 space-y-4">
                            <div className="input-group-custom">
                                <label className="input-label">Nombre del servicio</label>
                                <input className="input-field" placeholder="Ej. Mentoría estratégica" type="text" value={nombreServicio} onChange={(e) => setNombreServicio(e.target.value)}/>
                            </div>
                            <div className="input-group-custom">
                                <label className="input-label">Descripción</label>
                                <textarea className="input-field min-h-[80px]" placeholder="Breve detalle..." value={descripcionServicio} onChange={(e) => setDescripcionServicio(e.target.value)}/>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="input-group-custom">
                                    <label className="input-label">Duración</label>
                                    <input className="input-field" placeholder="Ej. 12 semanas" type="text" value={duracionServicio} onChange={(e) => setDuracionServicio(e.target.value)}/>
                                </div>
                                <div className="input-group-custom">
                                    <label className="input-label">Inversión</label>
                                    <input className="input-field" placeholder="Ej. $50k" type="text" value={inversionServicio} onChange={(e) => setInversionServicio(e.target.value)}/>
                                </div>
                            </div>
                            <button onClick={agregarServicio} className="btn-secondary-custom flex items-center gap-2 w-full justify-center">
                                <span className="material-symbols-outlined text-sm">add_task</span>
                                Añadir Servicio
                            </button>
                        </div>

                        <div className="space-y-4">
                            {listaServicios.map((servicio, index) => (
                                <div key={index} className="list-item-card">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-bold text-slate-100">{servicio.nombre}</p>
                                            <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-full font-bold uppercase tracking-widest">{servicio.duracion}</span>
                                            {servicio.inversion && <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-bold uppercase tracking-widest">{servicio.inversion}</span>}
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">{servicio.descripcion}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-500">category</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="section-divider"></div>

                    {/* Footer de envío */}
                    <div className="pt-6">
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8">
                            <div className="flex gap-4 items-start">
                                <span className="material-symbols-outlined text-primary">verified_user</span>
                                <div>
                                    <p className="text-sm font-bold text-slate-100 mb-1">Nota importante</p>
                                    <p className="text-xs text-slate-400 leading-relaxed text-pretty">
                                        Al enviar esta solicitud, acepta nuestros términos de servicio y políticas de privacidad. Si su solicitud es aceptada, deberá iniciar sesión con los datos proporcionados.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={enviarSolicitud} 
                            className="btn-primary-custom w-full text-lg py-4 shadow-xl shadow-primary/20"
                        >
                            <span className="material-symbols-outlined">send</span>
                            Enviar Solicitud de Registro
                        </button>
                        
                        <p className="text-center text-slate-500 text-xs mt-6">
                            © 2024 Startup Platform Inc. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SolicitudAceleradoraForm;
