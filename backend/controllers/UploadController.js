const StartupService = require('../services/StartupService');
const { uploadFile } = require('../services/UploadService');

const subirLogoStartup = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se envió ningún archivo.' });
    }
    const startupId = req.params.id || req.params.id_Startup;
    const logoUrl = await uploadFile(req.file);
    const startup = await StartupService.editarStartup(startupId, { logo_url: logoUrl });
    res.status(200).json({ message: 'Logo subido exitosamente', logo_url: logoUrl, startup });
  } catch (error) {
    if (error.message === 'Startup no encontrada') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al subir el logo', error: error.message });
  }
};

module.exports = { subirLogoStartup };
