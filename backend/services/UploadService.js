const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// ── Configuración condicional: solo configura Cloudinary si hay credenciales ──
const isConfigured = () => {
  const hasKeys = !!(process.env.CLOUDINARY_CLOUD_NAME &&
                     process.env.CLOUDINARY_API_KEY &&
                     process.env.CLOUDINARY_API_SECRET);
  const hasUrl = !!process.env.CLOUDINARY_URL;
  return hasKeys || hasUrl;
};

if (isConfigured()) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
    console.log('[UploadService] Cloudinary configurado mediante CLOUDINARY_URL.');
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('[UploadService] Cloudinary configurado mediante credenciales individuales.');
  }
} else {
  console.warn('[UploadService] ADVERTENCIA: Cloudinary no está configurado en .env. Se usará el almacenamiento local fallback en /uploads/.');
}

// ── Storage: Cloudinary si configurado, local si no ─────────────────────────
let storage;
let upload;

if (isConfigured()) {
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'ecosistema-startups',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 500, height: 500, crop: 'limit', quality: 'auto' }]
    }
  });
} else {
  const path = require('path');
  const fs = require('fs');
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, unique + path.extname(file.originalname));
    }
  });
}

upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato no permitido. Usa JPG, PNG, GIF o WebP.'), false);
    }
  }
});

/**
 * Sube un archivo a Cloudinary o almacenamiento local.
 * @param {object} file - El archivo de multer (req.file)
 * @returns {Promise<string>} URL pública del archivo subido
 */
const uploadFile = async (file) => {
  if (isConfigured()) {
    return file.path; // Cloudinary devuelve la URL directamente en file.path
  }
  // Fallback local: devuelve la ruta relativa
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3007}`;
  return `${baseUrl}/uploads/${file.filename}`;
};

/**
 * Sube una imagen en formato Base64 a Cloudinary o almacenamiento local.
 * @param {string} base64Str - La cadena de datos Base64 (data:image/...)
 * @returns {Promise<string>} URL de la imagen subida
 */
const uploadBase64 = async (base64Str) => {
  if (isConfigured()) {
    try {
      const res = await cloudinary.uploader.upload(base64Str, {
        folder: 'ecosistema-startups/profiles',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'limit', quality: 'auto' }]
      });
      return res.secure_url || res.url;
    } catch (err) {
      console.error('Error al subir Base64 a Cloudinary:', err.message);
    }
  }

  // Fallback de almacenamiento local: guardar Base64 como archivo físico
  try {
    const path = require('path');
    const fs = require('fs');

    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Formato Base64 inválido.');
    }

    const mimeType = matches[1];
    const ext = mimeType.split('/')[1] || 'png';
    const buffer = Buffer.from(matches[2], 'base64');

    const filename = `profile-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const uploadsDir = path.join(__dirname, '..', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    fs.writeFileSync(path.join(uploadsDir, filename), buffer);

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3007}`;
    return `${baseUrl}/uploads/${filename}`;
  } catch (err) {
    console.error('Error al guardar Base64 localmente:', err.message);
    throw new Error('No se pudo guardar la imagen de perfil.');
  }
};

module.exports = { upload, uploadFile, uploadBase64, isConfigured };
