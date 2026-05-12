import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Services from '../../services/Services';
import '../../styles/SolicitudForm.css';

function SolicitudForm() {
    const [nombre, setNombre] = useState("");
    const [url, setUrl] = useState("");
    const [region, setRegion] = useState("");
    const [latitud, setLatitud] = useState("");
    const [longitud, setLongitud] = useState("");
    const [ano, setAno] = useState("2024");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [logotipo, setLogotipo] = useState("");
    const [arr, setArr] = useState("");
    const [usuarios, setUsuarios] = useState("");
    const [crecimiento, setCrecimiento] = useState("");
    const [sector, setSector] = useState("0");
    const [etapa, setEtapa] = useState("0");
    const [modelo, setModelo] = useState("0");
    const [raise, setRaise] = useState("");
    const [pitch, setPitch] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [rol, setRol] = useState("startup");
    const [nombreMiembro, setNombreMiembro] = useState("");
    const [funcionMiembro, setFuncionMiembro] = useState("");
    const [listaMiembros, setListaMiembros] = useState([]);

    async function subirImagen(file) {
        try {
            const urlImg = await Services.uploadImage(file);
            setLogotipo(urlImg);
        } catch (error) {
            console.error(error);
        }
    }

    const validatePassword = (pass) => {
        // At least 8 characters, one uppercase, one number
        const re = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        return re.test(pass);
    };

    function agregarMiembro(){
        if(!nombreMiembro || !funcionMiembro){
            alert("Por favor, coloca todos los datos del miembro.");
            return;
        }
        const nuevoMiembro = {
            nombre: nombreMiembro,
            funcion: funcionMiembro
        };
        setListaMiembros([...listaMiembros, nuevoMiembro]);
        setNombreMiembro("");
        setFuncionMiembro("");
    }

    function enviarSolicitud() {
        const objSolicitud = {
            nombre, miembros: listaMiembros, url, region, latitud, longitud,
            ano, correo, contrasena, logotipo, arr, usuarios, crecimiento,
            sector, etapa, modelo, raise, pitch, descripcion, rol
        };

        if (!nombre || listaMiembros.length === 0 || !url || region === "0" || !latitud || !longitud || !correo || !contrasena || !logotipo || !arr || !usuarios || !crecimiento || sector === "0" || etapa === "0" || modelo === "0" || !raise || !pitch || !descripcion) {
            alert("Por favor, coloca todos los datos y asegºrate de agregar al menos un miembro.");
            return;
        }

        if (!validatePassword(contrasena)) {
            alert("La contrasena debe tener al menos 8 caracteres, incluyendo una mayºscula y un nºmero.");
            return;
        }

        const fetchSolicitud = async () => {
            const enviar = await Services.postSolicitudes(objSolicitud);
            console.log(enviar);
        };
        fetchSolicitud();
        alert("Solicitud Enviada");
    }

    return (
        <div className="startup-theme dark min-h-screen flex flex-col">
            <header className="flex items-center justify-between border-b border-darkBorder px-6 md:px-20 lg:px-40 py-4 bg-darkSurface/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    
                    <h2 className="text-slate-100 text-lg font-bold font-display">Nexus Cobalt</h2>
                </div>
                <Link to="/" className="text-slate-400 hover:text-primary transition-colors text-sm font-medium">Volver al Inicio</Link>
            </header>

            <main className="flex flex-1 justify-center py-10 px-4">
                <div className="max-w-[800px] flex-1 flex flex-col gap-8">

                    <div className="p-4">
                        <h1 className="text-slate-100 text-4xl font-black tracking-tight mb-3">Solicitud de Registro</h1>
                        <p className="text-slate-400 text-base">Conecta tu startup con los mejores inversores de la regi³n.</p>
                    </div>

                    <section className="bg-darkSurface/30 p-6 rounded-xl border border-darkBorder">
                        <div className="flex items-center gap-2 mb-6 border-b border-darkBorder pb-2">
                            <span className="material-symbols-outlined text-primary">info</span>
                            <h2 className="text-slate-100 text-xl font-bold">Informaci³n B¡sica</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label>
                                <p className="text-slate-300 text-sm mb-2 font-medium">Nombre de la Empresa</p>
                                <input className="form-input-custom" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. InnovaTech" />
                            </label>
                            <label>
                                <p className="text-slate-300 text-sm mb-2 font-medium">URL Sitio Web</p>
                                <input className="form-input-custom" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
                            </label>
                            <label>
                                <p className="text-slate-300 text-sm mb-2 font-medium">Correo Electr³nico</p>
                                <input className="form-input-custom" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="correo@empresa.com" />
                            </label>
                             <label>
                                 <p className="text-slate-300 text-sm mb-2 font-medium">Contrasena</p>
                                 <input className="form-input-custom" type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" shade="dark" />
                                 <p className="text-[10px] text-slate-500 mt-2 italic">M­nimo 8 caracteres, incluyendo una mayºscula y un nºmero.</p>
                             </label>
                        </div>

                        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-darkBorder">
                            <p className="text-slate-100 font-bold mb-4">Equipo Fundador</p>
                            <div className="flex flex-wrap gap-4 mb-4">
                                <input className="form-input-custom !h-11" placeholder="Nombre" value={nombreMiembro} onChange={(e) => setNombreMiembro(e.target.value)} />
                                <input className="form-input-custom !h-11" placeholder="Funci³n (CEO, CTO...)" value={funcionMiembro} onChange={(e) => setFuncionMiembro(e.target.value)} />
                                <button onClick={agregarMiembro} className="bg-primary/20 text-primary border border-primary/40 px-4 rounded-custom hover:bg-primary/30 transition-all font-bold">
                                    + Agregar
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {listaMiembros.map((m, i) => (
                                    <span key={i} className="bg-darkSurface px-3 py-1 rounded-full text-xs border border-darkBorder text-slate-300">
                                        {m.nombre} ({m.funcion})
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <label>
                                <p className="text-slate-300 text-sm mb-2 font-medium">Latitud</p>
                                <input className="form-input-custom" value={latitud} onChange={(e) => setLatitud(e.target.value)} placeholder="Ej. 13.6894" />
                            </label>
                            <label>
                                <p className="text-slate-300 text-sm mb-2 font-medium">Longitud</p>
                                <input className="form-input-custom" value={longitud} onChange={(e) => setLongitud(e.target.value)} placeholder="Ej. -89.1872" />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <label>
                                <p className="text-slate-300 text-sm mb-2 font-medium">Regi³n</p>
                                <select className="form-input-custom" value={region} onChange={(e) => setRegion(e.target.value)}>
                                    <option value="0">Selecciona...</option>
                                    <option value="america">Am©rica</option>
                                    <option value="europa">Europa</option>
                                    <option value="asia">Asia</option>
                                </select>
                            </label>
                            <label>
                                <p className="text-slate-300 text-sm mb-2 font-medium">Ano de Fundaci³n: <span className="text-primary">{ano}</span></p>
                                <input type="range" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" min={2010} max={2025} value={ano} onChange={(e) => setAno(e.target.value)} />
                            </label>
                        </div>

                        <div className="mt-6">
                            <p className="text-slate-300 text-sm mb-2">Logotipo</p>
                            <div className="border-2 border-dashed border-darkBorder rounded-custom p-6 text-center hover:border-primary/50 transition-colors relative">
                                <span className="material-symbols-outlined text-3xl text-slate-500 mb-2">cloud_upload</span>
                                <p className="text-sm text-slate-400">{logotipo ? "âœ… Imagen Cargada" : "Haz clic para subir logo"}</p>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => subirImagen(e.target.files[0])} />
                            </div>
                        </div>
                    </section>

                    <section className="bg-darkSurface/30 p-6 rounded-xl border border-darkBorder">
                        <div className="flex items-center gap-2 mb-6 border-b border-darkBorder pb-2">
                            <span className="material-symbols-outlined text-primary">campaign</span>
                            <h2 className="text-slate-100 text-xl font-bold">Pitch & Proyecto</h2>
                        </div>
                        <div className="flex flex-col gap-6">
                            <label>
                                <p className="text-slate-300 text-sm mb-2">Short Pitch (One-liner)</p>
                                <input className="form-input-custom" value={pitch} onChange={(e) => setPitch(e.target.value)} placeholder="Ej. Uber para agricultura..." />
                            </label>
                            <label>
                                <p className="text-slate-300 text-sm mb-2">Descripci³n Completa</p>
                                <textarea className="form-input-custom !h-32" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Detalla tu soluci³n..." />
                            </label>
                        </div>
                    </section>

                    <section className="bg-darkSurface/30 p-6 rounded-xl border border-darkBorder">
                        <div className="flex items-center gap-2 mb-6 border-b border-darkBorder pb-2">
                            <span className="material-symbols-outlined text-primary">analytics</span>
                            <h2 className="text-slate-100 text-xl font-bold">M©tricas & Fundraising</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <label>
                                <p className="text-slate-300 text-xs mb-1">ARR ($)</p>
                                <input className="form-input-custom !h-12" value={arr} onChange={(e) => setArr(e.target.value)} placeholder="0.00" />
                            </label>
                            <label>
                                <p className="text-slate-300 text-xs mb-1">Usuarios</p>
                                <input className="form-input-custom !h-12" value={usuarios} onChange={(e) => setUsuarios(e.target.value)} placeholder="Total" />
                            </label>
                            <label>
                                <p className="text-slate-300 text-xs mb-1">Crecimiento %</p>
                                <input className="form-input-custom !h-12" value={crecimiento} onChange={(e) => setCrecimiento(e.target.value)} placeholder="MoM" />
                            </label>
                            <label>
                                <p className="text-slate-300 text-xs mb-1">Target Raise ($)</p>
                                <input className="form-input-custom !h-12" value={raise} onChange={(e) => setRaise(e.target.value)} placeholder="Ej. 500,000" />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <select className="form-input-custom" value={sector} onChange={(e) => setSector(e.target.value)}>
                                <option value="0">Sector...</option>
                                <option value="1">FinTech</option>
                                <option value="4">SaaS</option>
                                <option value="7">AI</option>
                            </select>
                            <select className="form-input-custom" value={etapa} onChange={(e) => setEtapa(e.target.value)}>
                                <option value="0">Etapa...</option>
                                <option value="10">Seed</option>
                                <option value="11">Series A</option>
                            </select>
                            <select className="form-input-custom" value={modelo} onChange={(e) => setModelo(e.target.value)}>
                                <option value="0">Modelo de Negocio...</option>
                                <option value="B2B">B2B</option>
                                <option value="B2C">B2C</option>
                            </select>
                        </div>
                    </section>

                    <div className="flex flex-col items-center gap-4 py-10">
                        <button onClick={enviarSolicitud} className="w-full max-w-md bg-primary hover:bg-primary-dark text-white h-14 rounded-custom font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group">
                            Enviar Solicitud
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                        </button>
                        <p className="text-xs text-slate-500 text-center max-w-xs">
                            Al enviar, aceptas los t©rminos de servicio para fundadores de StartupHub.
                        </p>
                    </div>
                </div>
            </main>

            <footer className="p-8 text-center text-slate-500 text-sm border-t border-darkBorder">
                © 2024 Startup Platform Inc. Todos los derechos reservados.
            </footer>
        </div>
    );
}

export default SolicitudForm;



