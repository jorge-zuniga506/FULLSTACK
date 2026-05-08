import React, { useEffect, useState } from 'react';
import '../styles/MensajesStartups.css';
import Services from '../services/Services';

function MensajesStartups() {
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"))
    const [chatsInversores, setChatsInversores] = useState([]);
    const [chatsAceleradoras, setChatsAceleradoras] = useState([]);
    const [datosStartups, setDatosStartups] = useState([]);
    const [datosInversores, setDatosInversores] = useState([]);
    const [datosAceleradoras, setDatosAceleradoras] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [activeChatType, setActiveChatType] = useState(null); // 'inversor' or 'aceleradora'
    const [texto, setTexto] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEntityId, setSelectedEntityId] = useState(null);
    const [selectedEntityType, setSelectedEntityType] = useState('inversor');

    const fetchData = async () => {
        const chatsInv = await Services.getChatsInversoresYStartups();
        const chatsAce = await Services.getChatsStartupsYAceleradoras();
        const startups = await Services.getStartups();
        const inversores = await Services.getInversores();
        const aceleradoras = await Services.getAceleradoras();

        setChatsInversores(chatsInv || []);
        setChatsAceleradoras(chatsAce || []);
        setDatosStartups(startups || []);
        setDatosInversores(inversores || []);
        setDatosAceleradoras(aceleradoras || []);

        if ((chatsInv && chatsInv.length > 0) || (chatsAce && chatsAce.length > 0)) {
            if (chatsInv.length > 0) {
                setActiveChatId(chatsInv[0].id);
                setActiveChatType('inversor');
            } else {
                setActiveChatId(chatsAce[0].id);
                setActiveChatType('aceleradora');
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const allChats = [
        ...chatsInversores.map(c => ({ ...c, entityType: 'inversor' })),
        ...chatsAceleradoras.map(c => ({ ...c, entityType: 'aceleradora' }))
    ].filter(chat => chat.idStartup === usuarioLogueado.id);

    const activeChat = allChats.find(chat => chat.id === activeChatId && chat.entityType === activeChatType);

    async function enviarMensaje(texto) {
        if (!texto.trim() || !activeChat) return;
        const nuevoMensaje = {
            id: activeChat.mensajes.length > 0 ? Math.max(...activeChat.mensajes.map(m => Number(m.id) || 0)) + 1 : 1,
            idEmisor: usuarioLogueado.id,
            mensaje: texto,
            fecha: new Date().toISOString(),
            hora: new Date().toISOString()
        }

        const chatActualizado = {
            ...activeChat,
            mensajes: [...activeChat.mensajes, nuevoMensaje]
        };
        // Remove entityType added for internal state tracking before sending to server
        delete chatActualizado.entityType;

        if (activeChat.entityType === 'inversor') {
            await Services.putChatsInversoresYStartups(activeChatId, chatActualizado);
        } else {
            await Services.putChatsStartupsYAceleradoras(activeChatId, chatActualizado);
        }

        const updatedInv = await Services.getChatsInversoresYStartups();
        const updatedAce = await Services.getChatsStartupsYAceleradoras();
        setChatsInversores(updatedInv || []);
        setChatsAceleradoras(updatedAce || []);
        setTexto("");
    }

    async function nuevoChat() {
        const entityIdToUse = selectedEntityId || (selectedEntityType === 'inversor' 
            ? (datosInversores.length > 0 ? datosInversores[0].id : null)
            : (datosAceleradoras.length > 0 ? datosAceleradoras[0].id : null));

        if (!entityIdToUse) return;

        const nuevoChatObj = {
            idStartup: usuarioLogueado.id,
            mensajes: []
        };

        let createdChat;
        if (selectedEntityType === 'inversor') {
            nuevoChatObj.idInversor = entityIdToUse;
            createdChat = await Services.postChatsInversoresYStartups(nuevoChatObj);
        } else {
            nuevoChatObj.idAceleradora = entityIdToUse;
            createdChat = await Services.postChatsStartupsYAceleradoras(nuevoChatObj);
        }

        const updatedInv = await Services.getChatsInversoresYStartups();
        const updatedAce = await Services.getChatsStartupsYAceleradoras();
        setChatsInversores(updatedInv || []);
        setChatsAceleradoras(updatedAce || []);

        if (createdChat && createdChat.id) {
            setActiveChatId(createdChat.id);
            setActiveChatType(selectedEntityType);
        }

        setIsModalOpen(false);
        setSelectedEntityId(null);
    }

    function getNombreEntidad(id, type) {
        if (type === 'inversor') {
            const ent = datosInversores.find(i => i.id == id);
            return ent ? ent.nombre : "Inversor";
        } else {
            const ent = datosAceleradoras.find(a => a.id == id);
            return ent ? ent.nombre : "Aceleradora";
        }
    }

    return (
        <div className="bg-darkBg font-sans text-slate-100 flex h-screen overflow-hidden div-principal">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-darkBorder flex flex-col bg-darkSurface transition-all duration-300">
                <div className="p-6 border-b border-darkBorder">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                            <span className="material-symbols-outlined">rocket_launch</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight">StartupHub</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Startup Platform</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-custom transition-all" href="/PerfilPrivadoStartup">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                        <span className="text-sm font-medium">Profile</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-custom transition-colors" href="#">
                        <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                        <span className="text-sm font-medium">Messages</span>
                    </a>
                </nav>
            </aside>
            <div className="w-80 flex-shrink-0 border-r border-darkBorder flex flex-col bg-darkSurface/30 transition-all duration-300">
                <div className="p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Messages</h2>
                    <button className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg" onClick={() => setIsModalOpen(true)}>
                        <span className="material-symbols-outlined">edit_square</span>
                    </button>
                </div>
                <div className="px-6 mb-4">
                    <div className="relative flex items-center bg-darkBg/50 rounded-xl border border-darkBorder px-3 py-2">
                        <span className="material-symbols-outlined text-slate-500 text-[20px] mr-2">search</span>
                        <input className="bg-transparent border-none focus:ring-0 text-sm p-0 w-full placeholder:text-slate-500" placeholder="Search messages..." type="text" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-3 space-y-1">
                    {allChats.map((chat) => (
                        <div key={`${chat.entityType}-${chat.id}`} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${activeChatId === chat.id && activeChatType === chat.entityType ? 'bg-primary text-white' : 'hover:bg-darkSurface text-slate-300'}`} onClick={() => { setActiveChatId(chat.id); setActiveChatType(chat.entityType); }}>
                            <div className="size-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                                <span className="material-symbols-outlined">{chat.entityType === 'inversor' ? 'person' : 'support_agent'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <p className="text-sm font-bold truncate">{getNombreEntidad(chat.idInversor || chat.idAceleradora, chat.entityType)}</p>
                                    <span className="text-[10px] opacity-70">{chat.entityType === 'inversor' ? 'Investor' : 'Accelerator'}</span>
                                </div>
                                <p className="text-xs opacity-80 truncate">{chat.mensajes && chat.mensajes.length > 0 ? chat.mensajes[chat.mensajes.length - 1].mensaje : "No hay mensajes"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Main Chat Window */}
            <main className="flex-1 flex flex-col relative bg-darkBg overflow-y-auto">
                {activeChat ? (
                    <>
                        {/* Header */}
                        <header className="h-16 flex items-center justify-between px-6 border-b border-darkBorder bg-darkSurface/50 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-full dark:bg-slate-800 flex items-center justify-center text-slate-500 bg-slate-800" data-alt="Default user avatar profile image">
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold">{getNombreEntidad(activeChat.idInversor || activeChat.idAceleradora, activeChat.entityType)}</h2>
                                </div>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </header>
                        {/* Message History */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {activeChat.mensajes.map((mensaje, idx) => (
                                <React.Fragment key={mensaje.id || idx}>
                                    {mensaje.idEmisor === usuarioLogueado.id ? (
                                        <div className="flex flex-row-reverse items-end gap-3 max-w-[80%] ml-auto">
                                            <div className="bg-darkSurface px-4 py-3 rounded-2xl rounded-bl-none text-sm leading-relaxed border border-darkBorder" data-alt="Your profile avatar placeholder">
                                                <span className="material-symbols-outlined text-sm">person</span>
                                            </div>
                                            <div className="flex flex-col gap-1.5 items-end">
                                                <p className="text-[11px] font-medium text-slate-500 mr-1">You</p>
                                                <div className="bg-primary text-white px-4 py-3 rounded-2xl rounded-br-none text-sm leading-relaxed shadow-sm">
                                                    {mensaje.mensaje}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-end gap-3 max-w-[80%]">
                                            <div className="bg-darkSurface px-4 py-3 rounded-2xl rounded-bl-none text-sm leading-relaxed border border-darkBorder">
                                                <span className="material-symbols-outlined text-sm">{activeChat.entityType === 'inversor' ? 'person' : 'support_agent'}</span>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <p className="text-[11px] font-medium text-slate-500 ml-1">{getNombreEntidad(activeChat.idInversor || activeChat.idAceleradora, activeChat.entityType)}</p>
                                                <div className="bg-darkSurface px-4 py-3 rounded-2xl rounded-bl-none text-sm leading-relaxed border border-darkBorder">
                                                    <p>{mensaje.mensaje}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        {/* Input Area */}
                        <div className="p-6 bg-darkBg">
                            <div className="relative flex items-center gap-2 bg-darkSurface p-2 rounded-xl border border-darkBorder">
                                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">attach_file</span>
                                </button>
                                <input className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 placeholder:text-slate-400 dark:text-white" placeholder="Escribe un mensaje..." type="text" value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && enviarMensaje(texto)} />
                                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">sentiment_satisfied</span>
                                </button>
                                <button className="bg-primary text-white p-2.5 rounded-custom flex items-center justify-center shadow-md hover:bg-primary-dark transition-colors" onClick={() => enviarMensaje(texto)}>
                                    <span className="material-symbols-outlined text-[20px]">send</span>
                                </button>
                            </div>
                            <p className="text-center text-[10px] text-slate-400 mt-3">Press Enter to send message</p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500 p-6">
                        <p>Selecciona un chat para ver los mensajes</p>
                    </div>
                )}
            </main>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-darkSurface rounded-xl border border-darkBorder w-full max-w-md shadow-xl">
                        <div className="p-6 border-b border-darkBorder flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">Nuevo Chat</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Tipo de entidad</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="entityType" value="inversor" checked={selectedEntityType === 'inversor'} onChange={() => { setSelectedEntityType('inversor'); setSelectedEntityId(null); }} />
                                        Inversor
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="entityType" value="aceleradora" checked={selectedEntityType === 'aceleradora'} onChange={() => { setSelectedEntityType('aceleradora'); setSelectedEntityId(null); }} />
                                        Aceleradora
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="entitySelect" className="block text-sm font-medium mb-2">
                                    Selecciona un{selectedEntityType === 'inversor' ? ' inversor' : 'a aceleradora'}
                                </label>
                                <select className="w-full bg-darkBg border border-darkBorder rounded-lg p-2 text-white" id="entitySelect" value={selectedEntityId || ""} onChange={(e) => setSelectedEntityId(e.target.value)}>
                                    <option value="" disabled>Selecciona una opción</option>
                                    {selectedEntityType === 'inversor' 
                                        ? datosInversores.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)
                                        : datosAceleradoras.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-darkBorder flex justify-end gap-3">
                            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium" onClick={() => setIsModalOpen(false)}>
                                Cerrar
                            </button>
                            <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium" onClick={nuevoChat}>
                                Nuevo Chat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MensajesStartups;