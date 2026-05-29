const { User } = require('../models');

class HaciendaServiceError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'HaciendaServiceError';
    this.statusCode = statusCode;
  }
}

const HACIENDA_CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes
const DEFAULT_HACIENDA_ENDPOINT = 'https://api.hacienda.go.cr/fe/ae';
const HACIENDA_ENDPOINT = (process.env.HACIENDA_ENDPOINT || DEFAULT_HACIENDA_ENDPOINT).replace(/\/+$/, '');
const HACIENDA_TIMEOUT_MS = Math.max(1000, Number(process.env.HACIENDA_TIMEOUT_MS || 8000));
const HACIENDA_MAX_RETRIES = Math.max(0, Number(process.env.HACIENDA_MAX_RETRIES || 2));
const HACIENDA_RETRY_BASE_MS = Math.max(150, Number(process.env.HACIENDA_RETRY_BASE_MS || 450));

const haciendaCache = new Map();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class HaciendaService {
  static getCachedResult(cedula) {
    const cached = haciendaCache.get(cedula);
    if (!cached) return null;

    if (Date.now() - cached.createdAt > HACIENDA_CACHE_TTL_MS) {
      haciendaCache.delete(cedula);
      return null;
    }

    return cached.value;
  }

  static setCachedResult(cedula, value) {
    haciendaCache.set(cedula, {
      value,
      createdAt: Date.now()
    });
  }

  static extractNombre(payload) {
    if (!payload || typeof payload !== 'object') return null;

    return payload.nombre || payload.nombreCompleto || payload.nombre_hacienda || null;
  }

  static safeParseJson(text) {
    if (!text || typeof text !== 'string') return null;

    try {
      return JSON.parse(text);
    } catch (error) {
      return null;
    }
  }

  static async readResponsePayload(response) {
    const rawText = await response.text().catch(() => '');
    const payload = this.safeParseJson(rawText);
    return { rawText, payload };
  }

  static isNotFoundLike(status, payload, rawText = '') {
    if (status === 404) return true;

    const candidate = `${payload?.message || ''} ${payload?.status || ''} ${rawText}`.toLowerCase();
    return candidate.includes('no se encontro') ||
      candidate.includes('not found') ||
      candidate.includes('inexist');
  }

  static isRateLimitedLike(status, payload, rawText = '') {
    if (status === 429) return true;

    const candidate = `${payload?.message || ''} ${payload?.status || ''} ${rawText}`.toLowerCase();
    return candidate.includes('too many') ||
      candidate.includes('rate limit') ||
      candidate.includes('limite');
  }

  static async consultarLocal(cedula) {
    const usuario = await User.findOne({
      where: { cedula },
      attributes: ['nombre_hacienda']
    });

    if (!usuario?.nombre_hacienda) return null;

    return {
      nombreCompleto: usuario.nombre_hacienda,
      source: 'local'
    };
  }

  static async fallbackOrThrow(cedula, error) {
    const local = await this.consultarLocal(cedula);
    if (local) return local;
    throw error;
  }

  static async fetchHacienda(url) {
    const canAbort = typeof AbortController === 'function';
    const abortController = canAbort ? new AbortController() : null;
    const timeout = canAbort ? setTimeout(() => abortController.abort(), HACIENDA_TIMEOUT_MS) : null;

    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'EcosistemaStartups/1.0'
        }
      };

      if (abortController) {
        requestOptions.signal = abortController.signal;
      }

      return await fetch(url, requestOptions);
    } finally {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }

  static async consultarCedula(cedula) {
    const cleanCedula = String(cedula || '').replace(/[^0-9]/g, '');

    if (!/^\d{9,12}$/.test(cleanCedula)) {
      throw new HaciendaServiceError('La cedula debe contener entre 9 y 12 digitos numericos.', 400);
    }

    const cached = this.getCachedResult(cleanCedula);
    if (cached) return cached;

    const url = new URL(HACIENDA_ENDPOINT);
    url.searchParams.set('identificacion', cleanCedula);

    const maxAttempts = HACIENDA_MAX_RETRIES + 1;
    let lastError = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const response = await this.fetchHacienda(url.toString());
        const { rawText, payload } = await this.readResponsePayload(response);

        if (this.isNotFoundLike(response.status, payload, rawText)) {
          return await this.fallbackOrThrow(
            cleanCedula,
            new HaciendaServiceError('No se encontro informacion para esa cedula en Hacienda.', 404)
          );
        }

        if (this.isRateLimitedLike(response.status, payload, rawText)) {
          return await this.fallbackOrThrow(
            cleanCedula,
            new HaciendaServiceError('Hacienda limito temporalmente las consultas (429). Intente nuevamente en unos minutos.', 429)
          );
        }

        if (!response.ok) {
          const isTransient = response.status >= 500 && response.status <= 599;
          if (isTransient && attempt < maxAttempts) {
            await delay(HACIENDA_RETRY_BASE_MS * attempt);
            continue;
          }

          return await this.fallbackOrThrow(
            cleanCedula,
            new HaciendaServiceError(`Hacienda respondio con estado ${response.status}.`, 503)
          );
        }

        const nombre = this.extractNombre(payload);
        if (!nombre) {
          return await this.fallbackOrThrow(
            cleanCedula,
            new HaciendaServiceError('La respuesta de Hacienda no incluyo un nombre valido.', 404)
          );
        }

        const result = {
          nombreCompleto: nombre,
          source: 'hacienda'
        };

        this.setCachedResult(cleanCedula, result);
        return result;
      } catch (error) {
        if (error instanceof HaciendaServiceError) {
          throw error;
        }

        const isAbort = error?.name === 'AbortError';
        const isNetwork =
          error?.name === 'TypeError' ||
          /network|connect|fetch|socket|econn|timeout/i.test(String(error?.message || ''));

        if ((isAbort || isNetwork) && attempt < maxAttempts) {
          await delay(HACIENDA_RETRY_BASE_MS * attempt);
          continue;
        }

        lastError = error;
        break;
      }
    }

    if (lastError?.name === 'AbortError') {
      return await this.fallbackOrThrow(
        cleanCedula,
        new HaciendaServiceError('Tiempo de espera agotado al consultar Hacienda. Intente nuevamente.', 503)
      );
    }

    return await this.fallbackOrThrow(
      cleanCedula,
      new HaciendaServiceError('No fue posible conectar con Hacienda en este momento.', 503)
    );
  }
}

module.exports = HaciendaService;
