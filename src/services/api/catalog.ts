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
    const data = await api.get<any>('/sections');
    if (!Array.isArray(data)) return [];
    return data.map(s => ({
      ...s,
      isActive: s.isActive ?? s.is_active ?? true,
      id: s.id?.toString() ?? ''
    }));
  },

  createSection: async (data: Omit<Section, 'id'>): Promise<Section> => {
    return await api.post<Section>('/sections', data);
  },

  updateSection: async (id: string, data: Partial<Section>): Promise<Section> => {
    return await api.put<Section>(`/sections/${id}`, data);
  },

  deleteSection: async (id: string): Promise<void> => {
    await api.delete(`/sections/${id}`);
  },

  getProducts: async (sectionId?: string): Promise<Product[]> => {
    const url = sectionId ? `/products?sectionId=${sectionId}` : '/products';
    const data = await api.get<any>(url);
    if (!Array.isArray(data)) return [];
    return data.map(p => ({
      ...p,
      isActive: p.isActive ?? p.is_active ?? true,
      imageUrl: p.imageUrl ?? p.image_url ?? '',
      sectionId: p.sectionId?.toString() ?? p.section_id?.toString() ?? '',
      id: p.id?.toString() ?? ''
    }));
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    try {
      const p = await api.get<any>(`/products/${id}`);
      if (!p) return undefined;
      return {
        ...p,
        isActive: p.isActive ?? p.is_active ?? true,
        imageUrl: p.imageUrl ?? p.image_url ?? '',
        sectionId: p.sectionId?.toString() ?? p.section_id?.toString() ?? '',
        id: p.id?.toString() ?? ''
      };
    } catch (error) {
      return undefined;
    }
  },

  createProduct: async (data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    return await api.post<Product>('/products', data);
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    return await api.put<Product>(`/products/${id}`, data);
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  getBanner: async (): Promise<BannerConfig> => {
    const defaultBanner: BannerConfig = {
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

    try {
      const settingsResult = await api.get<any>('/settings');
      let bannerData = null;

      if (Array.isArray(settingsResult)) {
        settingsResult.forEach(item => {
          if (item.key === 'landing.banner' && typeof item.value === 'object') bannerData = item.value;
          else if (item.key === 'landing.banner' && typeof item.value === 'string') {
            try { bannerData = JSON.parse(item.value); } catch {}
          } else if (item.key === 'landing' && typeof item.value === 'object') {
            bannerData = item.value.banner;
          }
        });
      } else if (settingsResult && typeof settingsResult === 'object') {
        bannerData = settingsResult.landing?.banner || settingsResult.banner;
      }

      if (bannerData) {
        return { ...defaultBanner, ...bannerData };
      }
      return defaultBanner;
    } catch (error) {
      return defaultBanner;
    }
  },

  updateBanner: async (data: Partial<BannerConfig>): Promise<BannerConfig> => {
    await api.put<any>('/settings', { landing: { banner: data } });
    return data as BannerConfig;
  },

  getContact: async (): Promise<ContactConfig> => {
    const defaultContact: ContactConfig = {
      id: 'contact-default',
      text: '',
      imageUrl: '',
      isActive: false
    };

    try {
      const settingsResult = await api.get<any>('/settings');
      let contactData = null;

      if (Array.isArray(settingsResult)) {
        settingsResult.forEach(item => {
          if (item.key === 'landing.contact' && typeof item.value === 'object') contactData = item.value;
          else if (item.key === 'landing.contact' && typeof item.value === 'string') {
            try { contactData = JSON.parse(item.value); } catch {}
          } else if (item.key === 'landing' && typeof item.value === 'object') {
            contactData = item.value.contact;
          }
        });
      } else if (settingsResult && typeof settingsResult === 'object') {
        contactData = settingsResult.landing?.contact || settingsResult.contact;
      }

      if (contactData) {
        return { ...defaultContact, ...contactData };
      }
      return defaultContact;
    } catch (error) {
      return defaultContact;
    }
  },

  updateContact: async (data: Partial<ContactConfig>): Promise<ContactConfig> => {
    await api.put<any>('/settings', { landing: { contact: data } });
    return data as ContactConfig;
  }
};
