jest.mock('../../models', () => ({
  User: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn()
  }
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn()
}));

const UserService = require('../../services/UserService');
const { User } = require('../../models');
const bcrypt = require('bcrypt');

describe('UserService unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('crearUsuario hashea password y no expone hash', async () => {
    bcrypt.hash.mockResolvedValue('hashed-pass');
    User.create.mockResolvedValue({
      toJSON: () => ({
        id: 1,
        cedula: '123',
        email: 'u@test.com',
        password_hash: 'hashed-pass'
      })
    });

    const out = await UserService.crearUsuario({
      cedula: '123',
      nombre_hacienda: 'Nombre',
      email: 'u@test.com',
      password_hash: '123456',
      role_id: 2
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password_hash: 'hashed-pass',
        survey_completed: true,
        is_role_whitelisted: false
      })
    );
    expect(out.password_hash).toBeUndefined();
  });

  it('obtenerUsuarios excluye password_hash', async () => {
    User.findAll.mockResolvedValue([{ id: 1 }]);

    const out = await UserService.obtenerUsuarios();

    expect(User.findAll).toHaveBeenCalledWith({
      attributes: { exclude: ['password_hash'] }
    });
    expect(out).toEqual([{ id: 1 }]);
  });

  it('actualizarUsuario bloquea cambio de role_id', async () => {
    await expect(UserService.actualizarUsuario(1, { role_id: 1 })).rejects.toThrow(
      'No se permite cambiar el rol del usuario desde este endpoint.'
    );
  });

  it('actualizarUsuario aplica hash cuando llega password nueva', async () => {
    const update = jest.fn().mockResolvedValue(true);
    const toJSON = jest.fn().mockReturnValue({ id: 1, email: 'new@test.com', password_hash: 'x' });

    User.findByPk.mockResolvedValue({ update, toJSON });
    bcrypt.hash.mockResolvedValue('new-hash');

    const out = await UserService.actualizarUsuario(1, {
      cedula: '999',
      nombre_hacienda: 'Nuevo',
      email: 'new@test.com',
      password_hash: 'abcdef'
    });

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        cedula: '999',
        nombre_hacienda: 'Nuevo',
        email: 'new@test.com',
        password_hash: 'new-hash'
      })
    );
    expect(out.password_hash).toBeUndefined();
  });

  it('eliminarUsuario destruye registro existente', async () => {
    const destroy = jest.fn().mockResolvedValue(true);
    User.findByPk.mockResolvedValue({ destroy });

    const out = await UserService.eliminarUsuario(7);

    expect(destroy).toHaveBeenCalled();
    expect(out).toBe(true);
  });
});
