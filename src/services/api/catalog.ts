import { api } from '../../core/api/client';
import type { 
  Product, 
  Section, 
  BannerConfig, 
  ContactConfig 
} from '../../core/types/catalog';

const mapProduct = (p: any): Product => ({
  ...p,
  id: p.id?.toString() ?? '',
  sectionId: p.sectionId?.toString() ?? p.section_id?.toString() ?? '',
  imageUrl: p.imageUrl ?? p.image_url ?? '',
  price: Number(p.price || 0),
  description: p.description ?? '',
  name: p.name ?? ''
});

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
    try {
      const data = await api.get<any>('/sections');
      if (!Array.isArray(data)) return [];
      return data.map(s => ({
        ...s,
        isActive: s.isActive ?? s.is_active ?? true,
        id: s.id?.toString() ?? ''
      }));
    } catch {
      return [];
    }
  },

  createSection: async (data: Omit<Section, 'id'>): Promise<Section> => {
    const payload = {
      ...data,
      is_active: data.isActive,
      order_num: data.order
    };
    const s = await api.post<any>('/sections', payload);
    return {
      ...s,
      isActive: s.isActive ?? s.is_active ?? true,
      id: s.id?.toString() ?? ''
    };
  },

  updateSection: async (id: string, data: Partial<Section>): Promise<Section> => {
    const payload = {
      ...data,
      ...(data.isActive !== undefined && { is_active: data.isActive }),
      ...(data.order !== undefined && { order_num: data.order })
    };
    const s = await api.put<any>(`/sections/${id}`, payload);
    return {
      ...s,
      isActive: s.isActive ?? s.is_active ?? true,
      id: s.id?.toString() ?? ''
    };
  },

  deleteSection: async (id: string): Promise<void> => {
    await api.delete(`/sections/${id}`);
  },

  getProducts: async (sectionId?: string): Promise<Product[]> => {
    try {
      const url = sectionId ? `/products?sectionId=${sectionId}` : '/products';
      const data = await api.get<any>(url);
      if (!Array.isArray(data)) return [];
      return data.map(mapProduct);
    } catch {
      return [];
    }
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    try {
      const p = await api.get<any>(`/products/${id}`);
      if (!p) return undefined;
      return mapProduct(p);
    } catch (error) {
      return undefined;
    }
  },

  createProduct: async (data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const payload = {
      ...data,
      section_id: data.sectionId,
      image_url: data.imageUrl
    };
    const p = await api.post<any>('/products', payload);
    return mapProduct(p);
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    const payload = {
      ...data,
      ...(data.sectionId !== undefined && { section_id: data.sectionId }),
      ...(data.imageUrl !== undefined && { image_url: data.imageUrl })
    };
    const p = await api.put<any>(`/products/${id}`, payload);
    return mapProduct(p);
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
          } else if (item.key === 'landing' && typeof item.value === 'string') {
            try { bannerData = JSON.parse(item.value).banner; } catch {}
          }
        });
      } else if (settingsResult && typeof settingsResult === 'object') {
        bannerData = settingsResult.landing?.banner || settingsResult.banner;
      }

      if (bannerData) {
        return {
          ...defaultBanner,
          ...bannerData,
          isActive: bannerData.isActive ?? bannerData.is_active ?? defaultBanner.isActive,
          imageUrl: bannerData.imageUrl ?? bannerData.image_url ?? defaultBanner.imageUrl
        };
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
          } else if (item.key === 'landing' && typeof item.value === 'string') {
            try { contactData = JSON.parse(item.value).contact; } catch {}
          }
        });
      } else if (settingsResult && typeof settingsResult === 'object') {
        contactData = settingsResult.landing?.contact || settingsResult.contact;
      }

      if (contactData) {
        return {
          ...defaultContact,
          ...contactData,
          isActive: contactData.isActive ?? contactData.is_active ?? defaultContact.isActive,
          imageUrl: contactData.imageUrl ?? contactData.image_url ?? defaultContact.imageUrl
        };
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
