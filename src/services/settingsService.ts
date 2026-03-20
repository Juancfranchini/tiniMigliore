import type { AppSettings } from '../types/settings';
import { api } from '../core/api/client';

const defaultSettings: AppSettings = {
  branding: {
    businessName: 'Tini Migliore',
    logoUrl: '',
  },
  contact: {
    instagramUrl: 'https://instagram.com/tinimigliore',
    tiktokUrl: '',
    whatsappUrl: '',
    email: 'contacto@tinimigliore.com',
  },
  media: {
    cloudinaryCloudName: '',
    cloudinaryUploadPreset: '',
    cloudinaryFolder: 'tinimigliore',
  },
  checkout: {
    defaultShippingFee: 0,
    pickupEnabled: true,
    deliveryEnabled: true,
    storePickupLabel: 'Retiro por nuestro local',
  },
  notifications: {
    senderName: 'Tini Migliore',
    supportEmail: 'soporte@tinimigliore.com',
    orderConfirmationEnabled: false,
  },
  maps: {
    googleMapsApiKey: '',
    sellerAddress: '',
    sellerAddressLabel: 'Punto de Retiro',
    mapsEnabled: false,
  }
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const data = await api.get<AppSettings>('/settings');
    // Si backend devuelve un objeto validamos combinando con defaultSettings
    if (data && Object.keys(data).length > 0) {
      return {
        branding: { ...defaultSettings.branding, ...(data.branding || {}) },
        contact: { ...defaultSettings.contact, ...(data.contact || {}) },
        media: { ...defaultSettings.media, ...(data.media || {}) },
        checkout: { ...defaultSettings.checkout, ...(data.checkout || {}) },
        notifications: { ...defaultSettings.notifications, ...(data.notifications || {}) },
        maps: { ...defaultSettings.maps, ...(data.maps || {}) },
      };
    }
    return defaultSettings;
  } catch (e) {
    console.error('Failed to fetch settings from API, using default', e);
    return defaultSettings; // Volver a los default si falla la petición
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  await api.put<AppSettings>('/settings', settings);
};
