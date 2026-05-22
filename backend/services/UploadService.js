const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// ── Configuración condicional: solo configura Cloudinary si hay credenciales ──
const isConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET);
};

if (isConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
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

module.exports = { upload, uploadFile, isConfigured };
