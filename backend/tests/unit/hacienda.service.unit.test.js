jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn()
  }
}));

const { User } = require('../../models');
const HaciendaService = require('../../services/HaciendaService');

describe('HaciendaService unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('lanza 400 cuando la cedula es invalida', async () => {
    await expect(HaciendaService.consultarCedula('abc')).rejects.toMatchObject({
      statusCode: 400
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('retorna nombre desde Hacienda cuando la consulta es exitosa', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(JSON.stringify({ nombre: 'Juan Perez' }))
    });

    const result = await HaciendaService.consultarCedula('120130740');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.hacienda.go.cr/fe/ae?identificacion=120130740'),
      expect.objectContaining({ method: 'GET' })
    );
    expect(result).toEqual({
      nombreCompleto: 'Juan Perez',
      source: 'hacienda'
    });
  });

  it('usa fallback local cuando Hacienda responde 404', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      text: jest.fn().mockResolvedValue(JSON.stringify({ status: 'Not Found' }))
    });

    User.findOne.mockResolvedValue({ nombre_hacienda: 'Nombre Local' });

    const result = await HaciendaService.consultarCedula('120130741');

    expect(result).toEqual({
      nombreCompleto: 'Nombre Local',
      source: 'local'
    });
  });

  it('lanza 429 cuando Hacienda limita y no hay fallback local', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 429,
      text: jest.fn().mockResolvedValue(JSON.stringify({ status: 'Too Many Requests' }))
    });

    User.findOne.mockResolvedValue(null);

    await expect(HaciendaService.consultarCedula('120130742')).rejects.toMatchObject({
      statusCode: 429
    });
  });

  it('lanza 503 cuando no conecta con Hacienda y no hay fallback local', async () => {
    global.fetch.mockRejectedValue(new Error('network down'));
    User.findOne.mockResolvedValue(null);

    await expect(HaciendaService.consultarCedula('120130743')).rejects.toMatchObject({
      statusCode: 503
    });
  });
});
