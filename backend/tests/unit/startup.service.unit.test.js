jest.mock('../../models', () => ({
  Startup: {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn()
  }
}));

const { Op } = require('sequelize');
const StartupService = require('../../services/StartupService');
const { Startup } = require('../../models');

describe('StartupService unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('crearStartup delega en el modelo', async () => {
    Startup.create.mockResolvedValue({ id: 1 });

    const out = await StartupService.crearStartup({ nombre_comercial: 'Demo' });

    expect(Startup.create).toHaveBeenCalledWith({ nombre_comercial: 'Demo' });
    expect(out).toEqual({ id: 1 });
  });

  it('obtenerStartups aplica paginacion y filtros', async () => {
    Startup.findAndCountAll.mockResolvedValue({
      count: 12,
      rows: [{ id: 1 }, { id: 2 }]
    });

    const out = await StartupService.obtenerStartups({
      page: 2,
      limit: 5,
      sector_id: 3,
      fase: 'Semilla',
      search: 'fin',
      sortBy: 'id',
      order: 'ASC'
    });

    expect(Startup.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          sector_id: 3,
          fase: 'Semilla',
          [Op.or]: [
            { nombre_comercial: { [Op.like]: '%fin%' } },
            { descripcion: { [Op.like]: '%fin%' } }
          ]
        }),
        limit: 5,
        offset: 5,
        order: [['id', 'ASC']]
      })
    );

    expect(out).toEqual({
      totalItems: 12,
      totalPages: 3,
      currentPage: 2,
      startups: [{ id: 1 }, { id: 2 }]
    });
  });

  it('obtenerStartupPorId lanza error si no existe', async () => {
    Startup.findByPk.mockResolvedValue(null);

    await expect(StartupService.obtenerStartupPorId(88)).rejects.toThrow('Startup no encontrada');
  });

  it('editarStartup actualiza la entidad encontrada', async () => {
    const update = jest.fn().mockResolvedValue({ id: 3, nombre_comercial: 'Nuevo' });
    Startup.findByPk.mockResolvedValue({ update });

    const out = await StartupService.editarStartup(3, { nombre_comercial: 'Nuevo' });

    expect(update).toHaveBeenCalledWith({ nombre_comercial: 'Nuevo' });
    expect(out).toEqual({ id: 3, nombre_comercial: 'Nuevo' });
  });

  it('eliminarStartup destruye entidad existente', async () => {
    const destroy = jest.fn().mockResolvedValue(true);
    Startup.findByPk.mockResolvedValue({ destroy });

    const out = await StartupService.eliminarStartup(4);

    expect(destroy).toHaveBeenCalled();
    expect(out).toBe(true);
  });
});
