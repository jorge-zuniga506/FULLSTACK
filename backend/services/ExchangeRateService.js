const HACIENDA_DOLAR_URL = process.env.HACIENDA_DOLAR_URL || 'https://api.hacienda.go.cr/indicadores/tc/dolar';
const HACIENDA_EURO_URL = process.env.HACIENDA_EURO_URL || 'https://api.hacienda.go.cr/indicadores/tc/euro';
const COINGECKO_SIMPLE_PRICE_URL = process.env.COINGECKO_SIMPLE_PRICE_URL || 'https://api.coingecko.com/api/v3/simple/price';
const COINGECKO_COIN_ID = (process.env.COINGECKO_COIN_ID || 'bitcoin').trim().toLowerCase();
const COINGECKO_VS_CURRENCY = (process.env.COINGECKO_VS_CURRENCY || 'usd').trim().toLowerCase();
const COINGECKO_DEMO_API_KEY = (process.env.COINGECKO_DEMO_API_KEY || '').trim();
const REQUEST_TIMEOUT_MS = parseInt(process.env.HACIENDA_TIMEOUT_MS || '7000', 10);

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const fetchJsonWithTimeout = async (url, sourceLabel = 'API', timeoutMs = REQUEST_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`${sourceLabel} respondio ${response.status}. ${body || 'Sin detalle.'}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

const normalizeDolar = (raw = {}) => {
  const compra = toNumber(raw?.compra?.valor);
  const venta = toNumber(raw?.venta?.valor);
  const fecha = raw?.compra?.fecha || raw?.venta?.fecha || null;

  if (compra === null && venta === null) {
    throw new Error('Respuesta invalida en tipo de cambio de dolar.');
  }

  return { compra, venta, fecha };
};

const normalizeEuro = (raw = {}) => {
  const colones = toNumber(raw?.colones);
  const dolares = toNumber(raw?.dolares);
  const fecha = raw?.fecha || null;

  if (colones === null) {
    throw new Error('Respuesta invalida en tipo de cambio de euro.');
  }

  return { colones, dolares, fecha };
};

const buildCoinGeckoUrl = () => {
  const params = new URLSearchParams({
    vs_currencies: COINGECKO_VS_CURRENCY,
    ids: COINGECKO_COIN_ID
  });

  if (COINGECKO_DEMO_API_KEY) {
    params.set('x_cg_demo_api_key', COINGECKO_DEMO_API_KEY);
  }

  return `${COINGECKO_SIMPLE_PRICE_URL}?${params.toString()}`;
};

const normalizeBitcoin = (raw = {}) => {
  const price = toNumber(raw?.[COINGECKO_COIN_ID]?.[COINGECKO_VS_CURRENCY]);

  if (price === null) {
    throw new Error('Respuesta invalida en precio de bitcoin.');
  }

  return {
    id: COINGECKO_COIN_ID,
    currency: COINGECKO_VS_CURRENCY.toUpperCase(),
    price,
    price_usd: price
  };
};

const getBitcoinQuote = async () => {
  const coinGeckoUrl = buildCoinGeckoUrl();
  const raw = await fetchJsonWithTimeout(coinGeckoUrl, 'CoinGecko');
  const normalized = normalizeBitcoin(raw);

  return {
    ...normalized,
    fuente: 'api.coingecko.com',
    url: coinGeckoUrl
  };
};

class ExchangeRateService {
  static async getCurrentRates() {
    const [rawDolar, rawEuro] = await Promise.all([
      fetchJsonWithTimeout(HACIENDA_DOLAR_URL, 'Hacienda dolar'),
      fetchJsonWithTimeout(HACIENDA_EURO_URL, 'Hacienda euro')
    ]);

    const dolar = normalizeDolar(rawDolar);
    const euro = normalizeEuro(rawEuro);

    let bitcoin = null;
    let bitcoinError = null;

    try {
      bitcoin = await getBitcoinQuote();
    } catch (error) {
      bitcoinError = error.message;
    }

    const crcToUsd = dolar.venta ? 1 / dolar.venta : null;
    const crcToEur = euro.colones ? 1 / euro.colones : null;
    const btcToCrc = bitcoin?.price_usd && dolar.venta ? bitcoin.price_usd * dolar.venta : null;
    const crcToBtc = btcToCrc ? 1 / btcToCrc : null;

    return {
      fuente: {
        hacienda: 'api.hacienda.go.cr',
        bitcoin: bitcoin?.fuente || 'api.coingecko.com'
      },
      obtenido_en: new Date().toISOString(),
      dolar,
      euro,
      bitcoin: bitcoin ? {
        id: bitcoin.id,
        currency: bitcoin.currency,
        price: bitcoin.price,
        price_usd: bitcoin.price_usd
      } : null,
      conversiones: {
        crc_to_usd: crcToUsd,
        crc_to_eur: crcToEur,
        btc_to_crc: btcToCrc,
        crc_to_btc: crcToBtc
      },
      curl: {
        dolar: `curl "${HACIENDA_DOLAR_URL}"`,
        euro: `curl "${HACIENDA_EURO_URL}"`,
        bitcoin: `curl "${COINGECKO_SIMPLE_PRICE_URL}?vs_currencies=${COINGECKO_VS_CURRENCY}&ids=${COINGECKO_COIN_ID}"`
      },
      warnings: bitcoinError ? [bitcoinError] : []
    };
  }
}

module.exports = ExchangeRateService;
