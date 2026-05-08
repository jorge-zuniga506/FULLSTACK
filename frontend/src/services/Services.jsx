async function getAdministradores() { // Se coloca async para que el await fetch espere a que la funcion sea invocada
    try {
        const response = await fetch("http://localhost:3001/administradores")
        let datosAdministradores = await response.json()
        return datosAdministradores
    } catch (error) {
        console.error("Error al obtener las atracciones: ", error)
    }
}

async function postAdministradores(administrador) {
    try {
        const peticion = await fetch("http://localhost:3001/administradores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(administrador)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al agregar el usuario administrador:", error);
    }
}

async function putAdministradores(administrador, id) {
    try {
        const peticion = await fetch("http://localhost:3001/administradores/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(administrador)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar el usuario administrador:", error);
    }
}

async function patchAdministradores(administrador, id) {
    try {
        const peticion = await fetch("http://localhost:3001/administradores/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(administrador)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar el usuario administrador:", error);
    }
}

async function deleteAdministradores(id) {
    try {
        const peticion = await fetch("http://localhost:3001/administradores/" + id, {
            method: "DELETE",
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al eliminar el usuario administrador:", error);
    }
}

async function getSolicitudes() { // Se coloca async para que el await fetch espere a que la funcion sea invocada
    try {
        const response = await fetch("http://localhost:3001/solicitudes")
        let datosSolicitudes = await response.json()
        return datosSolicitudes
    } catch (error) {
        console.error("Error al obtener las solicitudes: ", error)
    }
}

async function postSolicitudes(solicitud) {
    try {
        const peticion = await fetch("http://localhost:3001/solicitudes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(solicitud)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al agregar la solicitud:", error);
    }
}

async function putSolicitudes(solicitud, id) {
    try {
        const peticion = await fetch("http://localhost:3001/solicitudes/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(solicitud)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar la solicitud:", error);
    }
}

async function patchSolicitudes(solicitud, id) {
    try {
        const peticion = await fetch("http://localhost:3001/solicitudes/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(solicitud)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar la solicitud:", error);
    }
}

async function deleteSolicitudes(id) {
    try {
        const peticion = await fetch("http://localhost:3001/solicitudes/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await peticion.json();
        return data
    } catch (error) {
        console.error("Error al eliminar la solicitud:", error);
    }
}

async function getStartups() { // Se coloca async para que el await fetch espere a que la funcion sea invocada
    try {
        const response = await fetch("http://localhost:3001/startups")
        let datosStartups = await response.json()
        return datosStartups
    } catch (error) {
        console.error("Error al obtener las startups: ", error)
    }
}

async function postStartups(startup) {
    try {
        const peticion = await fetch("http://localhost:3001/startups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(startup)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al agregar la aceleradora:", error);
    }
}

async function putStartup(id, startup) {
    try {
        const peticion = await fetch("http://localhost:3001/startups/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(startup)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar la startup:", error);
    }
}

async function patchStartup(startup, id) {
    try {
        const peticion = await fetch("http://localhost:3001/startups/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(startup)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar la startup:", error);
    }
}

async function deleteStartup(id) {
    try {
        const peticion = await fetch("http://localhost:3001/startups/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await peticion.json();
        return data
    } catch (error) {
        console.error("Error al eliminar la startup:", error);
    }
}

async function getSolicitudesAceleradoras() { // Se coloca async para que el await fetch espere a que la funcion sea invocada
    try {
        const response = await fetch("http://localhost:3001/solicitudesAceleradoras")
        let datosSolicitudesAceleradoras = await response.json()
        return datosSolicitudesAceleradoras
    } catch (error) {
        console.error("Error al obtener las aceleradoras: ", error)
    }
}

async function postSolicitudesAceleradoras(solicitudAceleradora) {
    try {
        const peticion = await fetch("http://localhost:3001/solicitudesAceleradoras", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(solicitudAceleradora)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al agregar la aceleradora:", error);
    }
}

async function putSolicitudesAceleradoras(solicitudAceleradora, id) {
    try {
        const peticion = await fetch("http://localhost:3001/solicitudesAceleradoras/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(solicitudAceleradora)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar la aceleradora:", error);
    }
}

async function patchSolicitudesAceleradoras(solicitudAceleradora, id) {
    try {
        const peticion = await fetch("http://localhost:3001/solicitudesAceleradoras/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(solicitudAceleradora)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar la aceleradora:", error);
    }
}

async function deleteSolicitudesAceleradoras(id) {
    try {
        const peticion = await fetch("http://localhost:3001/solicitudesAceleradoras/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await peticion.json();
        return data
    } catch (error) {
        console.error("Error al eliminar la aceleradora:", error);
    }
}

async function getAceleradoras() { // Se coloca async para que el await fetch espere a que la funcion sea invocada
    try {
        const response = await fetch("http://localhost:3001/aceleradoras")
        let datosAceleradoras = await response.json()
        return datosAceleradoras
    } catch (error) {
        console.error("Error al obtener las aceleradoras: ", error)
    }
}

async function postAceleradoras(aceleradora) {
    try {
        const peticion = await fetch("http://localhost:3001/aceleradoras", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(aceleradora)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al agregar la aceleradora:", error);
    }
}

async function putAceleradoras(id, aceleradora) {
    try {
        const peticion = await fetch("http://localhost:3001/aceleradoras/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(aceleradora)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar la aceleradora:", error);
    }
}

async function patchAceleradoras(id, aceleradora) {
    try {
        const peticion = await fetch("http://localhost:3001/aceleradoras/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(aceleradora)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar la aceleradora:", error);
    }
}

async function deleteAceleradoras(id) {
    try {
        const peticion = await fetch("http://localhost:3001/aceleradoras/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await peticion.json();
        return data
    } catch (error) {
        console.error("Error al eliminar la aceleradora:", error);
    }
}

async function getInversores() { // Se coloca async para que el await fetch espere a que la funcion sea invocada
    try {
        const response = await fetch("http://localhost:3001/inversores")
        let datosInversores = await response.json()
        return datosInversores
    } catch (error) {
        console.error("Error al obtener las aceleradoras: ", error)
    }
}

async function postInversores(inversor) {
    try {
        const peticion = await fetch("http://localhost:3001/inversores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(inversor)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al agregar el inversor:", error);
    }
}

async function putInversores (id, inversor) {
    try {
        const peticion = await fetch("http://localhost:3001/inversores/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(inversor)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar el inversor:", error);
    }
}

async function patchInversores(inversor, id) {
    try {
        const peticion = await fetch("http://localhost:3001/inversores/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(inversor)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar el inversor:", error);
    }
}

async function deleteInversores(id) {
    try {
        const peticion = await fetch("http://localhost:3001/inversores/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await peticion.json();
        return data
    } catch (error) {
        console.error("Error al eliminar el inversor:", error);
    }
}

async function getChatsStartupsYAceleradoras() { // Se coloca async para que el await fetch espere a que la funcion sea invocada
    try {
        const response = await fetch("http://localhost:3001/chatsStartupsYAceleradoras")
        let datosMensajes = await response.json()
        return datosMensajes
    } catch (error) {
        console.error("Error al obtener los chats: ", error)
    }
}

async function getChatsStartupsYAceleradorasPorId(id) { // Se coloca async para que el await fetch espere a que la funcion sea invocada
    try {
        const response = await fetch("http://localhost:3001/chatsStartupsYAceleradoras/"+ id)
        let datosMensajes = await response.json()
        return datosMensajes
    } catch (error) {
        console.error("Error al obtener los chats: ", error)
    }
}

async function postChatsStartupsYAceleradoras(chat) {
    try {
        const peticion = await fetch("http://localhost:3001/chatsStartupsYAceleradoras", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(chat)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al agregar el chat:", error);
    }
}

async function putChatsStartupsYAceleradoras(id, chat) {
    try {
        const peticion = await fetch("http://localhost:3001/chatsStartupsYAceleradoras/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(chat)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar el chat:", error);
    }
}

async function patchChatsStartupsYAceleradoras(id, chat) {
    try {
        const peticion = await fetch("http://localhost:3001/chatsStartupsYAceleradoras/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(chat)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar el chat:", error);
    }
}

async function deleteChatsStartupsYAceleradoras(id) {
    try {
        const peticion = await fetch("http://localhost:3001/chatsStartupsYAceleradoras/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await peticion.json();
        return data
    } catch (error) {
        console.error("Error al eliminar el chat:", error);
    }
}

async function getChatsInversoresYStartups() { // Se coloca async para que el await fetch espere a que la funcion sea invocada
    try {
        const response = await fetch("http://localhost:3001/chatsInversoresYStartups")
        let datosMensajes = await response.json()
        return datosMensajes
    } catch (error) {
        console.error("Error al obtener los mensajes: ", error)
    }
}

async function getChatsInversoresYStartupsPorId(id) { // Se coloca async para que el await fetch espere a que la funcion sea invocada
    try {
        const response = await fetch("http://localhost:3001/chatsInversoresYStartups/"+ id)
        let datosMensajes = await response.json()
        return datosMensajes
    } catch (error) {
        console.error("Error al obtener los chats: ", error)
    }
}

async function postChatsInversoresYStartups(chat) {
    try {
        const peticion = await fetch("http://localhost:3001/chatsInversoresYStartups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(chat)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al agregar el chat:", error);
    }
}

async function putChatsInversoresYStartups(id, chat) {
    try {
        const peticion = await fetch("http://localhost:3001/chatsInversoresYStartups/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(chat)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar el chat:", error);
    }
}

async function patchChatsInversoresYStartups(id, chat) {
    try {
        const peticion = await fetch("http://localhost:3001/chatsInversoresYStartups/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(chat)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al actualizar el chat:", error);
    }
}

async function deleteChatsInversoresYStartups(id) {
    try {
        const peticion = await fetch("http://localhost:3001/chatsInversoresYStartups/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await peticion.json();
        return data
    } catch (error) {
        console.error("Error al eliminar el chat:", error);
    }
}




// services/Services.js

const uploadImage = async (file) => {
  const data = new FormData()
  data.append("file", file)
  data.append("upload_preset", "imagenes")

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dcdktvkrk/image/upload", {
      method: "POST",
      body: data
    })

    const result = await res.json()
    return result.secure_url // 👈 retornas la URL
  } catch (error) {
    console.error("Error subiendo imagen:", error)
    throw error
  }
}

async function getMensajesContactanos() { // Se coloca async para que el await fetch espere a que la funcion sea invocada
    try {
        const response = await fetch("http://localhost:3001/MensajesContactanos")
        let datosMensajes = await response.json()
        return datosMensajes   
    } catch (error) {
        console.error("Error al obtener los mensajes: ", error)
    }
}

async function postMensajesContactanos(mensaje) {
    try {
        const peticion = await fetch("http://localhost:3001/MensajesContactanos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(mensaje)
        });
        return await peticion.json();
    } catch (error) {
        console.error("Error al agregar el mensaje:", error);
    }
}

async function deleteMensajesContactanos(id) {
    try {
        const peticion = await fetch("http://localhost:3001/MensajesContactanos/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await peticion.json();
        return data
    } catch (error) {
        console.error("Error al eliminar el mensaje:", error);
    }
}

export default {
    getAdministradores, postAdministradores, putAdministradores, patchAdministradores, deleteAdministradores,
    getSolicitudes, postSolicitudes, putSolicitudes, patchSolicitudes, deleteSolicitudes,
    getStartups, postStartups, putStartup, patchStartup, deleteStartup,
    getSolicitudesAceleradoras, postSolicitudesAceleradoras, putSolicitudesAceleradoras, patchSolicitudesAceleradoras, deleteSolicitudesAceleradoras,
    getAceleradoras, postAceleradoras, putAceleradoras, patchAceleradoras, deleteAceleradoras,
    getInversores, postInversores, putInversores, patchInversores, deleteInversores, uploadImage, getMensajesContactanos, postMensajesContactanos, deleteMensajesContactanos,
    getChatsStartupsYAceleradoras, postChatsStartupsYAceleradoras, putChatsStartupsYAceleradoras, patchChatsStartupsYAceleradoras, deleteChatsStartupsYAceleradoras,
    getChatsInversoresYStartups, getChatsInversoresYStartupsPorId, postChatsInversoresYStartups, putChatsInversoresYStartups, patchChatsInversoresYStartups, deleteChatsInversoresYStartups
}
