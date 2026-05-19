const { Session } = require('../models');

class SessionService {
    static async crearSession(data) {
        return await Session.create(data);
    }

    static async obtenerSessions() {
        return await Session.findAll();
    }

    static async obtenerSessionPorId(id) {
        const session = await Session.findByPk(id);
        if (!session) throw new Error('Session no encontrada');
        return session;
    }

    static async editarSession(id, data) {
        const session = await this.obtenerSessionPorId(id);
        return await session.update(data);
    }

    static async eliminarSession(id) {
        const session = await this.obtenerSessionPorId(id);
        await session.destroy();
        return true;
    }
}

module.exports = SessionService;
