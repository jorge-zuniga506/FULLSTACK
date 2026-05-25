class HaciendaService {
  /**
   * Consulta el nombre completo de una persona en la API pública de Hacienda de Costa Rica
   * @param {string} cedula - Cédula física o jurídica (9 a 12 dígitos)
   * @returns {Promise<{nombreCompleto: string}>}
   */
  static async consultarCedula(cedula) {
    try {
      const cleanCedula = cedula.replace(/[^0-9]/g, '');
      const response = await fetch(`https://api.hacienda.go.cr/fe/ae?identificacion=${cleanCedula}`);
      
      if (!response.ok) {
        throw new Error(`API de Hacienda respondió con status ${response.status}`);
      }

      const data = await response.json();
      if (data && data.nombre) {
        return { nombreCompleto: data.nombre };
      }

      throw new Error('No se encontró nombre asociado a esta cédula en Hacienda.');
    } catch (error) {
      console.error('Error al consultar cédula en Hacienda:', error.message);
      throw error;
    }
  }
}

module.exports = HaciendaService;
