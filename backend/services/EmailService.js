const nodemailer = require('nodemailer');

const isConfigured = () => {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
};

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!isConfigured()) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
};

/**
 * Envía un correo electrónico.
 * @param {object} options - { to, subject, html }
 * @returns {Promise<boolean>} true si se envió, false si no hay configuración SMTP
 */
const enviarCorreo = async ({ to, subject, html }) => {
  const t = getTransporter();
  if (!t) return false;
  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error al enviar correo:', error.message);
    return false;
  }
};

/**
 * Envía notificación por correo cuando una solicitud es aprobada o rechazada.
 */
const notificarEstadoSolicitud = async (solicitud, userEmail, userName) => {
  const estado = solicitud.estado;
  const esAprobada = estado === 'Aprobada';
  const subject = `Solicitud ${esAprobada ? 'aprobada' : 'rechazada'} — Ecosistema Startups`;
  const html = `
    <h2>Solicitud de incorporación</h2>
    <p>Hola <strong>${userName}</strong>,</p>
    <p>Tu solicitud para unirte como <strong>${solicitud.tipo}</strong> ha sido <strong>${esAprobada ? 'aprobada' : 'rechazada'}</strong>.</p>
    ${solicitud.comentarios_admin ? `<p><strong>Comentario del administrador:</strong> ${solicitud.comentarios_admin}</p>` : ''}
    <hr>
    <p>Saludos,<br>Equipo Ecosistema Startups</p>
  `;
  return await enviarCorreo({ to: userEmail, subject, html });
};

module.exports = { enviarCorreo, notificarEstadoSolicitud, isConfigured };
