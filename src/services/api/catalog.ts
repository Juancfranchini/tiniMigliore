import { api } from '../../core/api/client';
import type { 
  Product, 
  Section, 
  BannerConfig, 
  ContactConfig 
} from '../../core/types/catalog';

/**
 * Servicio real que interactúa con el backend.
 * Conserva EXACTAMENTE la misma firma que src/services/mock/catalog.ts
 * para que los componentes de React no requieran cambios en su lógica.
 */
export const catalogService = {
  
  /**
   * Obtiene todas las secciones activas ordenadas.
   */
  getSections: async (): Promise<Section[]> => {
    return await api.get<Section[]>('/sections');
  },

  /**
   * Crea una nueva sección.
   */
  createSection: async (data: Omit<Section, 'id'>): Promise<Section> => {
    return await api.post<Section>('/sections', data);
  },

  /**
   * Actualiza los datos de una sección existente.
   */
  updateSection: async (id: string, data: Partial<Section>): Promise<Section> => {
    return await api.put<Section>(`/sections/${id}`, data);
  },

  /**
   * Elimina una sección.
   */
  deleteSection: async (id: string): Promise<void> => {
    await api.delete(`/sections/${id}`);
  },

  /**
   * Obtiene productos de forma dinámica, opcionalmente filtrados por sección.
   */
  getProducts: async (sectionId?: string): Promise<Product[]> => {
    // Si tenemos un sectionId enviamos un query param: /products?sectionId=123
    const url = sectionId ? `/products?sectionId=${sectionId}` : '/products';
    return await api.get<Product[]>(url);
  },

  /**
   * Obtiene un producto individual por ID.
   */
  getProductById: async (id: string): Promise<Product | undefined> => {
    try {
      return await api.get<Product>(`/products/${id}`);
    } catch (error) {
      // Si el backend devuelve 404 para un producto que no existe
      return undefined;
    }
  },

  /**
   * Crea un nuevo producto.
   */
  createProduct: async (data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    return await api.post<Product>('/products', data);
  },

  /**
   * Actualiza los datos de un producto existente.
   */
  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    return await api.put<Product>(`/products/${id}`, data);
  },

  /**
   * Elimina un producto.
   */
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // --- CONFIGURACIÓN DE LA PÁGINA ---

  getBanner: async (): Promise<BannerConfig> => {
    try {
      // Usamos el endpoint genérico /settings del backend
      const settingsResult = await api.get<any>('/settings');
      if (settingsResult?.landing?.banner) {
        return settingsResult.landing.banner;
      }
      throw new Error('Empty');
    } catch (error) {
      return {
        id: 'banner-default',
        imageUrl: '',
        title: '',
        subtitle: '',
        callToActionText: '',
        callToActionUrl: '',
        showTitle: true,
        showSubtitle: true,
        showCta: true,
        isActive: false
      };
    }
  },

  updateBanner: async (data: Partial<BannerConfig>): Promise<BannerConfig> => {
    // Upsert guardando específicamente `landing.banner` vía el flattening de la DB
    await api.put<any>('/settings', { landing: { banner: data } });
    return data as BannerConfig;
  },

  getContact: async (): Promise<ContactConfig> => {
    try {
      // Usamos el endpoint genérico /settings del backend
      const settingsResult = await api.get<any>('/settings');
      if (settingsResult?.landing?.contact) {
        return settingsResult.landing.contact;
      }
      throw new Error('Empty');
    } catch (error) {
      return {
        id: 'contact-default',
        text: '',
        imageUrl: '',
        isActive: false
      };
    }
  },

  updateContact: async (data: Partial<ContactConfig>): Promise<ContactConfig> => {
    // Upsert guardando específicamente `landing.contact` vía el flattening de la DB
    await api.put<any>('/settings', { landing: { contact: data } });
    return data as ContactConfig;
  }
};
