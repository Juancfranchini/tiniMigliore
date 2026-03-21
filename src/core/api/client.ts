/**
 * Cliente HTTP genérico para comunicarse con el backend.
 * Envuelve `fetch` de forma didáctica para manejar errores y URLs base
 * centralizadamente, en lugar de repetirlo en cada servicio.
 */

// Obtenemos la URL base del archivo .env (y caemos en un default si no existe)
// En Vite las variables de entorno se exponen en import.meta.env
// IMPORTANTE: En producción no usamos localhost como fallback.
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '');

/**
 * Función principal para hacer peticiones.
 * @param endpoint El endpoint (ej: '/products')
 * @param options Opciones nativas de fetch (método, headers, body)
 */
export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Por defecto, asumimos que siempre enviaremos y recibiremos JSON
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    // Si la respuesta no es OK (ej: 404, 500)
    if (!response.ok) {
      // Intentamos leer el mensaje de error del backend si viene en formato JSON
      let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
        else if (errorData.error) errorMessage = errorData.error;
      } catch {
        // Si no es JSON, mantenemos el error genérico
      }
      throw new Error(errorMessage);
    }

    // Si es un status 204 (No Content) o la respuesta está vacía, evitamos parsear json
    if (response.status === 204) {
      return {} as T; 
    }

    const data = await response.json();
    
    // Normalizar si el backend devuelve un wrapper tipo { success: true, data: [...] }
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data as T;
    }

    return data as T;
  } catch (error) {
    // Aquí podríamos agregar lógica extra como reportar a un servicio como Sentry
    console.error(`[API Client Error] fetching ${url}:`, error);
    throw error;
  }
};

// Utilidades rápidas para métodos comunes
export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestInit, 'method'>) => 
    apiClient<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, data: any, options?: Omit<RequestInit, 'method' | 'body'>) => 
    apiClient<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
    
  put: <T>(endpoint: string, data: any, options?: Omit<RequestInit, 'method' | 'body'>) => 
    apiClient<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
    
  delete: <T>(endpoint: string, options?: Omit<RequestInit, 'method'>) => 
    apiClient<T>(endpoint, { ...options, method: 'DELETE' })
};
