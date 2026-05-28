const nodemailer = require('nodemailer');

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

  // If SMTP_HOST is not provided, default to Gmail service for EMAIL_USER/EMAIL_PASS.
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

  const subject = '¡Código Restablecido!';
  const html = `
    <h2>¡Código Restablecido!</h2>
    <p>Hola <strong>${userName || 'usuario'}</strong>,</p>
    <p>Tu nuevo codigo de verificacion es:</p>
    <div style="font-family: monospace; font-size: 22px; font-weight: 700; letter-spacing: 1px;">${code}</div>
    <p>Este codigo expira en 24 horas.</p>
  `;

  return await enviarCorreo({ to, subject, html });
};

/**
 * Envia notificacion por correo cuando una solicitud es aprobada o rechazada.
 */
const notificarEstadoSolicitud = async (solicitud, userEmail, userName) => {
  const estado = solicitud.estado;
  const esAprobada = estado === 'Aprobada';
  const subject = `Solicitud ${esAprobada ? 'aprobada' : 'rechazada'} - Ecosistema Startups`;
  const html = `
    <h2>Solicitud de incorporacion</h2>
    <p>Hola <strong>${userName}</strong>,</p>
    <p>Tu solicitud para unirte como <strong>${solicitud.tipo}</strong> ha sido <strong>${esAprobada ? 'aprobada' : 'rechazada'}</strong>.</p>
    ${solicitud.comentarios_admin ? `<p><strong>Comentario del administrador:</strong> ${solicitud.comentarios_admin}</p>` : ''}
    <hr>
    <p>Saludos,<br>Equipo Ecosistema Startups</p>
  `;
  return await enviarCorreo({ to: userEmail, subject, html });
};

module.exports = { enviarCorreo, notificarEstadoSolicitud, notificarCodigoRestablecido, isConfigured };
