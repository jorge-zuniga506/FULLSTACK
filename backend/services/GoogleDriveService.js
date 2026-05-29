/**
 * services/GoogleDriveService.js
 * 
 * Servicio para descargar y extraer texto de PDFs públicos de Google Drive
 * (admite tanto IDs de archivos directos como IDs de carpetas públicas).
 */
const { PDFParse } = require('pdf-parse');

class GoogleDriveService {

  /**
   * Descarga un archivo PDF de Google Drive por su ID y extrae su texto
   * @param {string} fileId - El ID del archivo de Google Drive
   * @returns {Promise<string>} El texto extraído del PDF
   */
  async extractTextFromFile(fileId) {
    try {
      const url = `https://docs.google.com/uc?export=download&id=${fileId}`;
      console.log(`[GoogleDriveService] Descargando archivo: ${fileId}...`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Fallo al descargar el archivo con estado HTTP: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      console.log(`[GoogleDriveService] Archivo ${fileId} descargado con éxito (${buffer.length} bytes). Parseando PDF...`);
      
      const parser = new PDFParse({ data: buffer });
      const data = await parser.getText();
      console.log(`[GoogleDriveService] PDF ${fileId} parseado exitosamente. Caracteres extraídos: ${data.text?.length || 0}`);
      
      return data.text || '';
    } catch (error) {
      console.error(`[GoogleDriveService] Error al procesar el archivo ${fileId}:`, error.message);
      return '';
    }
  }

  /**
   * Obtiene la lista de IDs de archivos contenidos en una carpeta pública de Google Drive
   * parseando la vista HTML pública del folderview.
   * @param {string} folderId - El ID de la carpeta pública de Google Drive
   * @returns {Promise<Array<{id: string, name: string}>>} Lista de archivos encontrados
   */
  async getFilesInFolder(folderId) {
    try {
      const url = `https://drive.google.com/embeddedfolderview?id=${folderId}`;
      console.log(`[GoogleDriveService] Escaneando carpeta pública: ${folderId}...`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Fallo al leer la carpeta con estado HTTP: ${response.status}`);
      }

      const html = await response.text();
      const files = [];

      // Regex para buscar enlaces de visor de archivos de Drive que contienen el ID del archivo
      // Ejemplo: href="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
      const fileIdRegex = /\/file\/d\/([a-zA-Z0-9_-]{28,})/g;
      
      let match;
      const seenIds = new Set();
      while ((match = fileIdRegex.exec(html)) !== null) {
        const fileId = match[1];
        if (!seenIds.has(fileId)) {
          seenIds.add(fileId);
          // Intentamos buscar un nombre aproximado cerca en el HTML, o le ponemos un nombre por defecto
          files.push({
            id: fileId,
            name: `Documento_${fileId.slice(0, 6)}.pdf`
          });
        }
      }

      console.log(`[GoogleDriveService] Se encontraron ${files.length} archivos en la carpeta pública ${folderId}.`);
      return files;
    } catch (error) {
      console.error(`[GoogleDriveService] Error al listar archivos de la carpeta ${folderId}:`, error.message);
      return [];
    }
  }

  /**
   * Extrae el texto de todos los archivos PDF en una carpeta pública o una lista de archivos
   * @param {string} folderId - ID de la carpeta pública
   * @param {Array<string>} [directFileIds] - Lista opcional de IDs de archivos específicos
   * @returns {Promise<Array<{id: string, name: string, text: string}>>} Lista de documentos con su texto
   */
  async loadDocuments(folderId, directFileIds = []) {
    let files = [];

    // 1. Si hay IDs de archivos directos especificados, los usamos
    if (directFileIds && directFileIds.length > 0) {
      files = directFileIds.map(id => ({ id, name: `Documento_${id.slice(0, 6)}.pdf` }));
    } 
    // 2. Si no hay archivos directos pero hay un folderId, escaneamos la carpeta
    else if (folderId) {
      files = await this.getFilesInFolder(folderId);
    }

    const documents = [];
    for (const file of files) {
      const text = await this.extractTextFromFile(file.id);
      if (text && text.trim().length > 0) {
        documents.push({
          id: file.id,
          name: file.name,
          text: text
        });
      }
    }

    return documents;
  }
}

module.exports = new GoogleDriveService();
