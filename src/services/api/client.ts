/**
 * Cliente de API base para conectar el frontend con el backend.
 * Utiliza VITE_API_URL desde las variables de entorno.
 */
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '');

export const apiClient = {
  /**
   * Realiza una prueba de conexión simple contra el endpoint /health
   * Retorna un booleano indicando si la conexión fue exitosa.
   */
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (!response.ok) {
        throw new Error(`Respuesta no ok: ${response.status}`);
      }
      const data = await response.json();
      return data.ok === true;
    } catch (error) {
      console.error('Error al probar conexión con el backend:', error);
      throw error;
    }
  }
};
