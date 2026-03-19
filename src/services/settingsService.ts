import type { AppSettings } from '../types/settings';

const SETTINGS_STORAGE_KEY = 'tinimigliore_settings';

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
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Merge with defaultSettings to ensure all fields exist
      return {
        branding: { ...defaultSettings.branding, ...(parsed.branding || {}) },
        contact: { ...defaultSettings.contact, ...(parsed.contact || {}) },
        media: { ...defaultSettings.media, ...(parsed.media || {}) },
        checkout: { ...defaultSettings.checkout, ...(parsed.checkout || {}) },
        notifications: { ...defaultSettings.notifications, ...(parsed.notifications || {}) },
        maps: { ...defaultSettings.maps, ...(parsed.maps || {}) },
      };
    } catch (e) {
      console.error('Failed to parse settings from localStorage', e);
    }
  }
  
  return defaultSettings;
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};
