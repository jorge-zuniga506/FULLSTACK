const nodemailer = require('nodemailer');

const APP_NAME = process.env.APP_NAME || 'NEXUS COBALT';
const APP_URL = process.env.APP_URL || '';
const APP_LOGO_URL = process.env.APP_LOGO_URL || process.env.BRAND_LOGO_URL || '';

const resolveCredentials = () => ({
  user: process.env.SMTP_USER || process.env.EMAIL_USER,
  pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
});

const isConfigured = () => {
  const { user, pass } = resolveCredentials();
  return !!(user && pass);
};

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!isConfigured()) return null;

  const { user, pass } = resolveCredentials();
  const smtpHost = process.env.SMTP_HOST;

  transporter = smtpHost
    ? nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass }
    })
    : nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: { user, pass }
    });

  return transporter;
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildEmailLayout = ({ preheader, title, bodyHtml, footerHtml = '' }) => {
  const safePreheader = escapeHtml(preheader || '');
  const safeTitle = escapeHtml(title || APP_NAME);

  const logoBlock = APP_LOGO_URL
    ? `<img src="${escapeHtml(APP_LOGO_URL)}" alt="${escapeHtml(APP_NAME)}" width="42" height="42" style="display:block;border-radius:10px;border:0;outline:none;text-decoration:none;" />`
    : '<div style="width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,#0ea5e9,#7c3aed);"></div>';

  const appNameBlock = APP_URL
    ? `<a href="${escapeHtml(APP_URL)}" style="font-size:18px;font-weight:800;line-height:1.1;color:#f8fafc;text-decoration:none;">${escapeHtml(APP_NAME)}</a>`
    : `<span style="font-size:18px;font-weight:800;line-height:1.1;color:#f8fafc;">${escapeHtml(APP_NAME)}</span>`;

  const defaultFooter = `Este es un mensaje automatico de ${escapeHtml(APP_NAME)}. Si no reconoces esta actividad, protege tu cuenta de inmediato.`;

  return `
  <!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="x-ua-compatible" content="ie=edge" />
      <title>${safeTitle}</title>
    </head>
    <body style="margin:0;padding:0;background:#0b1220;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        ${safePreheader}
      </div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0b1220;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;background:#111827;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;background:linear-gradient(135deg,#0f172a,#1e293b);border-bottom:1px solid #1f2937;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="52" valign="middle">${logoBlock}</td>
                      <td valign="middle">${appNameBlock}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 24px 12px 24px;">
                  <h1 style="margin:0;font-size:28px;line-height:1.2;color:#f8fafc;font-weight:800;">${safeTitle}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:4px 24px 10px 24px;color:#cbd5e1;font-size:16px;line-height:1.65;">
                  ${bodyHtml}
                </td>
              </tr>
              <tr>
                <td style="padding:14px 24px 24px 24px;color:#94a3b8;font-size:13px;line-height:1.55;border-top:1px solid #1f2937;">
                  ${footerHtml || defaultFooter}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

/**
 * Envia un correo electronico.
 * @param {object} options - { to, subject, html }
 * @returns {Promise<boolean>} true si se envio, false si no hay configuracion SMTP
 */
const enviarCorreo = async ({ to, subject, html }) => {
  if (process.env.NODE_ENV === 'test') return false;

  const t = getTransporter();
  if (!t) return false;

  try {
    const { user } = resolveCredentials();

    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM || user,
      to,
      subject,
      html
    });

    return true;
  } catch (error) {
    console.error('Error al enviar correo:', error.message);
    return false;
  }
};

/**
 * Envia el correo cuando el usuario restablece su codigo de verificacion 2FA.
 */
const notificarCodigoRestablecido = async ({ to, userName, code }) => {
  if (!to || !code) return false;

  const safeName = escapeHtml(userName || 'usuario');
  const safeCode = escapeHtml(code);
  const subject = `${APP_NAME} - Codigo de verificacion restablecido`;

  const html = buildEmailLayout({
    preheader: 'Tu codigo de verificacion fue restablecido.',
    title: 'Codigo de verificacion restablecido',
    bodyHtml: `
      <p style="margin:0 0 14px 0;">Hola <strong>${safeName}</strong>,</p>
      <p style="margin:0 0 18px 0;">Se genero un nuevo codigo de verificacion para tu cuenta.</p>
      <div style="margin:0 0 18px 0;padding:16px 18px;background:#0b1324;border:1px solid #334155;border-radius:12px;text-align:center;">
        <div style="font-size:13px;letter-spacing:0.6px;text-transform:uppercase;color:#93c5fd;margin-bottom:8px;">Codigo de seguridad</div>
        <div style="font-family:'Courier New',monospace;font-size:34px;font-weight:700;letter-spacing:8px;color:#f8fafc;">${safeCode}</div>
      </div>
      <p style="margin:0;">Este codigo expira en 24 horas.</p>
    `
  });

  return await enviarCorreo({ to, subject, html });
};

/**
 * Envia el codigo temporal de verificacion cuando se intenta iniciar sesion.
 */
const notificarCodigoInicioSesion = async ({ to, userName, code, expiresMinutes = 10 }) => {
  if (!to || !code) return false;

  const safeName = escapeHtml(userName || 'usuario');
  const safeCode = escapeHtml(code);
  const safeMinutes = escapeHtml(expiresMinutes);
  const subject = `${APP_NAME} - Codigo de verificacion para iniciar sesion`;

  const html = buildEmailLayout({
    preheader: `Tu codigo temporal es ${code}. Expira en ${expiresMinutes} minutos.`,
    title: 'Verificacion de inicio de sesion',
    bodyHtml: `
      <p style="margin:0 0 14px 0;">Hola <strong>${safeName}</strong>,</p>
      <p style="margin:0 0 18px 0;">Detectamos un intento de inicio de sesion con este correo. Para continuar, usa este codigo temporal:</p>
      <div style="margin:0 0 18px 0;padding:16px 18px;background:#0b1324;border:1px solid #334155;border-radius:12px;text-align:center;">
        <div style="font-size:13px;letter-spacing:0.6px;text-transform:uppercase;color:#93c5fd;margin-bottom:8px;">Codigo temporal</div>
        <div style="font-family:'Courier New',monospace;font-size:36px;font-weight:700;letter-spacing:10px;color:#f8fafc;">${safeCode}</div>
      </div>
      <p style="margin:0 0 12px 0;"><strong>Vigencia:</strong> ${safeMinutes} minutos.</p>
      <p style="margin:0;padding:12px 14px;background:#1f2937;border-left:3px solid #f59e0b;border-radius:8px;color:#e5e7eb;">
        Si no fuiste tu, cambia tu contrasena inmediatamente y revisa la seguridad de tu cuenta.
      </p>
    `
  });

  return await enviarCorreo({ to, subject, html });
};

/**
 * Envia un correo de agradecimiento cuando se recibe un reporte de soporte.
 */
const notificarReporteSoporteRecibido = async ({
  to,
  userName,
  asunto,
  categoria,
  prioridad
}) => {
  if (!to || !asunto) return false;

  const safeName = escapeHtml(userName || 'usuario');
  const safeAsunto = escapeHtml(asunto);
  const safeCategoria = escapeHtml(categoria || 'otro');
  const safePrioridad = escapeHtml(prioridad || 'media');

  const subject = `${APP_NAME} - Recibimos tu reporte de soporte`;

  const html = buildEmailLayout({
    preheader: 'Gracias por ayudarnos a mejorar la plataforma.',
    title: 'Reporte recibido con exito',
    bodyHtml: `
      <p style="margin:0 0 14px 0;">Hola <strong>${safeName}</strong>,</p>
      <p style="margin:0 0 14px 0;">Gracias por reportarnos lo ocurrido. Tu mensaje ya llego al equipo de soporte de <strong>${escapeHtml(APP_NAME)}</strong>.</p>
      <div style="margin:0 0 18px 0;padding:16px 18px;background:#0b1324;border:1px solid #334155;border-radius:12px;">
        <p style="margin:0 0 8px 0;color:#e2e8f0;"><strong>Asunto:</strong> ${safeAsunto}</p>
        <p style="margin:0 0 8px 0;color:#e2e8f0;"><strong>Categoria:</strong> ${safeCategoria}</p>
        <p style="margin:0;color:#e2e8f0;"><strong>Prioridad:</strong> ${safePrioridad}</p>
      </div>
      <p style="margin:0 0 12px 0;">Nuestro equipo revisara tu caso y daremos seguimiento dentro de la plataforma.</p>
      <p style="margin:0;padding:12px 14px;background:#1f2937;border-left:3px solid #22c55e;border-radius:8px;color:#e5e7eb;">
        Tu retroalimentacion es clave para mejorar cada version de Nexus Cobalt. Gracias por confiar en nosotros.
      </p>
    `
  });

  return await enviarCorreo({ to, subject, html });
};

/**
 * Envia notificacion por correo cuando una solicitud es aprobada o rechazada.
 */
const notificarEstadoSolicitud = async (solicitud, userEmail, userName) => {
  const estado = solicitud.estado;
  const esAprobada = estado === 'Aprobada';
  const subject = `Solicitud ${esAprobada ? 'aprobada' : 'rechazada'} - ${APP_NAME}`;

  const html = buildEmailLayout({
    preheader: `Tu solicitud fue ${esAprobada ? 'aprobada' : 'rechazada'}.`,
    title: 'Actualizacion de solicitud',
    bodyHtml: `
      <p style="margin:0 0 12px 0;">Hola <strong>${escapeHtml(userName || 'usuario')}</strong>,</p>
      <p style="margin:0 0 12px 0;">Tu solicitud para unirte como <strong>${escapeHtml(solicitud.tipo)}</strong> ha sido <strong>${esAprobada ? 'aprobada' : 'rechazada'}</strong>.</p>
      ${solicitud.comentarios_admin ? `<p style="margin:0;"><strong>Comentario del administrador:</strong> ${escapeHtml(solicitud.comentarios_admin)}</p>` : ''}
    `
  });

  return await enviarCorreo({ to: userEmail, subject, html });
};

module.exports = {
  enviarCorreo,
  notificarEstadoSolicitud,
  notificarCodigoRestablecido,
  notificarCodigoInicioSesion,
  notificarReporteSoporteRecibido,
  isConfigured
};
