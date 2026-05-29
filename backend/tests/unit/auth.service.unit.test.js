jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn()
  },
  Session: {
    create: jest.fn(),
    update: jest.fn()
  }
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

jest.mock('../../services/EmailService', () => ({
  notificarCodigoInicioSesion: jest.fn().mockResolvedValue(true)
}));

const AuthService = require('../../services/AuthService');
const { User, Session } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { notificarCodigoInicioSesion } = require('../../services/EmailService');

describe('AuthService unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lanza error si faltan credenciales', async () => {
    await expect(AuthService.login('', '')).rejects.toThrow(/Por favor ingrese email/);
  });

  it('lanza error si usuario no existe', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(AuthService.login('x@test.com', '123456')).rejects.toThrow(/Credenciales/);
  });

  it('login exitoso crea sesion y retorna usuario sin hash', async () => {
    const mockUser = {
      id: 10,
      email: 'demo@test.com',
      role_id: 2,
      password_hash: 'hash',
      update: jest.fn().mockResolvedValue(true),
      toJSON: jest.fn().mockReturnValue({
        id: 10,
        email: 'demo@test.com',
        role_id: 2,
        password_hash: 'hash'
      })
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('jwt-token');
    Session.create.mockResolvedValue({ id: 1 });
    const result = await AuthService.login('demo@test.com', '123456');

    expect(jwt.sign).toHaveBeenCalled();
    expect(Session.create).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 10,
        token_jwt: 'jwt-token',
        es_valido: true
      })
    );
    expect(mockUser.update).toHaveBeenCalledWith(
      expect.objectContaining({
        two_factor_code: expect.stringMatching(/^\d{6}$/),
        two_factor_expires_at: expect.any(Date),
        is_role_whitelisted: false
      })
    );
    expect(notificarCodigoInicioSesion).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'demo@test.com'
      })
    );
    expect(result.token).toBe('jwt-token');
    expect(result.usuario.password_hash).toBeUndefined();
    expect(result.redirectPath).toBe('/dashboard/startup');
  });

  it('logout invalida sesiones activas por token', async () => {
    Session.update.mockResolvedValue([1]);

    const out = await AuthService.logout('jwt-token');

    expect(Session.update).toHaveBeenCalledWith(
      { es_valido: false },
      { where: { token_jwt: 'jwt-token', es_valido: true } }
    );
    expect(out).toBe(true);
  });

  it('logout falla si no hay sesiones activas', async () => {
    Session.update.mockResolvedValue([0]);

    await expect(AuthService.logout('jwt-token')).rejects.toThrow('Sesion no encontrada o ya invalida.');
  });

  it('getMe falla cuando usuario no existe', async () => {
    User.findByPk.mockResolvedValue(null);

    await expect(AuthService.getMe(99)).rejects.toThrow('Usuario no encontrado.');
  });
});
