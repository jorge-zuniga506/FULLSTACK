/**
 * services/WhatsAppService.js
 * Envio OTP por WhatsApp con proveedor configurable.
 *
 * Proveedores:
 * - callmebot: key numerica clasica.
 * - textmebot: key alfanumerica tipo dashboard.
 * - auto (default): detecta por formato de API key.
 */

const WHATSAPP_PROVIDER = (process.env.WHATSAPP_OTP_PROVIDER || 'auto').toLowerCase();
const CALLMEBOT_BASE_URL = process.env.WHATSAPP_CALLMEBOT_URL || 'https://api.callmebot.com/whatsapp.php';
const TEXTMEBOT_BASE_URL = process.env.WHATSAPP_TEXTMEBOT_URL || 'https://api.textmebot.com/send.php';

const normalizePhone = (rawPhone = '') => {
  const trimmed = String(rawPhone || '').trim();
  if (!trimmed) return '';

  const digits = trimmed.replace(/[^\d+]/g, '');
  if (!digits) return '';

  if (digits.startsWith('+')) {
    return `+${digits.slice(1).replace(/\D/g, '')}`;
  }

  return `+${digits.replace(/\D/g, '')}`;
};

const maskPhone = (rawPhone = '') => {
  const normalized = normalizePhone(rawPhone);
  if (!normalized) return '';

  const digits = normalized.replace(/\D/g, '');
  if (digits.length <= 4) return `+***${digits.slice(-2)}`;

  return `+${digits.slice(0, 2)}***${digits.slice(-2)}`;
};

const buildOtpMessage = ({ appName, userName, code, expiresMinutes }) => {
  const safeAppName = appName || 'NEXUS COBALT';
  const safeUserName = userName || 'usuario';
  const safeCode = String(code || '').trim();
  const ttl = Number.isFinite(Number(expiresMinutes)) ? Number(expiresMinutes) : 10;

  return [
    `*${safeAppName}*`,
    `Hola ${safeUserName},`,
    `Tu codigo de verificacion es: *${safeCode}*`,
    `Expira en ${ttl} minutos.`,
    'Si no fuiste tu, cambia tu contrasena de inmediato.'
  ].join('\n');
};

const isLikelyTextMeBotKey = (rawKey = '') => {
  const key = String(rawKey || '').trim();
  // Keys tipo TextMeBot suelen ser alfanumericas (ej: 5DqBxMesLcfu)
  return /^[A-Za-z0-9_-]{8,}$/.test(key) && /[A-Za-z]/.test(key);
};

const resolveProvider = ({ apiKey } = {}) => {
  if (WHATSAPP_PROVIDER === 'callmebot' || WHATSAPP_PROVIDER === 'textmebot') {
    return WHATSAPP_PROVIDER;
  }

  if (WHATSAPP_PROVIDER === 'auto') {
    return isLikelyTextMeBotKey(apiKey) ? 'textmebot' : 'callmebot';
  }

  // Fallback defensivo si llega un valor desconocido en env.
  return 'callmebot';
};

const bodyContainsError = (text = '') => {
  const body = String(text || '').toLowerCase();
  return (
    body.includes('error') ||
    body.includes('invalid') ||
    body.includes('not allowed') ||
    body.includes('not authorized') ||
    body.includes('missing') ||
    body.includes('denied') ||
    body.includes('wrong') ||
    body.includes('blocked') ||
    body.includes('forbidden')
  );
};

const sendWithCallMeBot = async ({ phone, apiKey, message }) => {
  const normalizedPhone = normalizePhone(phone);
  const resolvedApiKey = (apiKey || process.env.WHATSAPP_CALLMEBOT_APIKEY || '').trim();

  if (!normalizedPhone) {
    return { ok: false, error: 'Debes ingresar un numero de WhatsApp valido.' };
  }

  if (!resolvedApiKey) {
    return {
      ok: false,
      error: 'Falta API key de WhatsApp gratis (CallMeBot). Agregala en login o en WHATSAPP_CALLMEBOT_APIKEY.'
    };
  }

  try {
    const url = new URL(CALLMEBOT_BASE_URL);
    url.searchParams.set('phone', normalizedPhone);
    url.searchParams.set('text', message);
    url.searchParams.set('apikey', resolvedApiKey);

    const response = await fetch(url.toString(), { method: 'GET' });
    const rawBody = await response.text().catch(() => '');
    const bodyText = String(rawBody || '').trim();
    // CallMeBot puede responder 200 con mensaje de error en texto plano.
    const bodyLooksLikeError = bodyContainsError(bodyText);

    if (!response.ok || bodyLooksLikeError) {
      return {
        ok: false,
        error: `CallMeBot respondio ${response.status}. ${bodyText || 'No se pudo enviar el OTP por WhatsApp.'}`
      };
    }

    return { ok: true, destinationMasked: maskPhone(normalizedPhone) };
  } catch (error) {
    return { ok: false, error: `Error enviando OTP por WhatsApp: ${error.message}` };
  }
};

const sendWithTextMeBot = async ({ phone, apiKey, message }) => {
  const normalizedPhone = normalizePhone(phone);
  const recipientDigits = normalizedPhone.replace(/\D/g, '');
  const resolvedApiKey = (apiKey || process.env.WHATSAPP_TEXTMEBOT_APIKEY || '').trim();

  if (!normalizedPhone) {
    return { ok: false, error: 'Debes ingresar un numero de WhatsApp valido.' };
  }

  if (!resolvedApiKey) {
    return {
      ok: false,
      error: 'Falta API key de TextMeBot. Ingresa tu key alfanumerica en el login o configura WHATSAPP_TEXTMEBOT_APIKEY.'
    };
  }

  try {
    const url = new URL(TEXTMEBOT_BASE_URL);
    url.searchParams.set('recipient', recipientDigits);
    url.searchParams.set('text', message);
    url.searchParams.set('apikey', resolvedApiKey);
    url.searchParams.set('json', 'yes');

    const response = await fetch(url.toString(), { method: 'GET' });
    const rawBody = await response.text().catch(() => '');
    const bodyText = String(rawBody || '').trim();

    let parsed = null;
    try {
      parsed = bodyText ? JSON.parse(bodyText) : null;
    } catch (_ignore) {
      parsed = null;
    }

    const parsedStatus = String(parsed?.status || '').toLowerCase();
    const parsedComment = String(parsed?.comment || parsed?.message || parsed?.error || '').trim();
    const jsonLooksError =
      Boolean(parsed) &&
      (
        parsed?.success === false ||
        parsedStatus.includes('error') ||
        parsedStatus.includes('fail')
      );

    const textLooksError = bodyContainsError(bodyText);

    if (!response.ok || jsonLooksError || textLooksError) {
      return {
        ok: false,
        error: `TextMeBot respondio ${response.status}. ${parsedComment || bodyText || 'No se pudo enviar el OTP por WhatsApp.'}`
      };
    }

    return { ok: true, destinationMasked: maskPhone(normalizedPhone) };
  } catch (error) {
    return { ok: false, error: `Error enviando OTP por WhatsApp (TextMeBot): ${error.message}` };
  }
};

const sendOtpByWhatsApp = async ({ phone, apiKey, code, userName, expiresMinutes = 10 }) => {
  if (!code) {
    return { ok: false, error: 'No se pudo generar el codigo OTP para WhatsApp.' };
  }

  const appName = process.env.APP_NAME || 'NEXUS COBALT';
  const message = buildOtpMessage({ appName, userName, code, expiresMinutes });
  const provider = resolveProvider({ apiKey });

  if (provider === 'callmebot') {
    return sendWithCallMeBot({ phone, apiKey, message });
  }

  if (provider === 'textmebot') {
    return sendWithTextMeBot({ phone, apiKey, message });
  }

  return {
    ok: false,
    error: `Proveedor WhatsApp no soportado: ${provider}.`
  };
};

module.exports = {
  sendOtpByWhatsApp,
  normalizePhone,
  maskPhone,
  isLikelyTextMeBotKey
};
