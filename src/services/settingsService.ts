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

// Función auxiliar para desempaquetar arreglos key-value del backend
function normalizeSettings(data: any): AppSettings {
  // Empezar con una copia segura de los defaults
  const normalized: AppSettings = JSON.parse(JSON.stringify(defaultSettings));

  if (!data) return normalized;

  // CASO 1: El backend devuelve un arreglo de tipo [{ key: "branding.businessName", value: "Tini" }]
  if (Array.isArray(data)) {
    data.forEach(item => {
      // Ignoramos items que no tengan el formato correcto
      if (!item || typeof item.key !== 'string') return;
      
      const parts = item.key.split('.');
      if (parts.length >= 2) {
        const section = parts[0] as keyof AppSettings;
        const field = parts.slice(1).join('.');
        
        // Verificamos que sea una sección conocida
        if (normalized[section] !== undefined && typeof normalized[section] === 'object') {
           // Parseamos booleanos o números si es necesario
           let parsedValue = item.value;
           if (parsedValue === 'true') parsedValue = true;
           else if (parsedValue === 'false') parsedValue = false;
           else if (!isNaN(Number(parsedValue)) && parsedValue !== '') parsedValue = Number(parsedValue);

           (normalized[section] as any)[field] = parsedValue;
        }
      } else if (parts.length === 1) {
         // Si la key es solo la sección y el value es un objeto plano JSON
         const section = parts[0] as keyof AppSettings;
         if (normalized[section] !== undefined && typeof item.value === 'object' && item.value !== null) {
            normalized[section] = { ...normalized[section], ...item.value };
         } else if (normalized[section] !== undefined && typeof item.value === 'string') {
            try {
              const parsed = JSON.parse(item.value);
              if (typeof parsed === 'object' && parsed !== null) {
                normalized[section] = { ...normalized[section], ...parsed };
              }
            } catch (e) {
              // Not a JSON string
            }
         }
      }
    });
    return normalized;
  }

  // CASO 2: El backend devuelve un objeto anidado o un objeto con keys parciales
  if (typeof data === 'object' && !Array.isArray(data)) {
    const keys = Object.keys(data);
    
    // Si tiene keys de primer nivel como 'branding', 'contact', etc.
    const hasSettingKeys = keys.some(k => k in defaultSettings);
    if (!hasSettingKeys && keys.includes('data') && Array.isArray(data.data)) {
       // Podría ser un wrapper no capturado por el cliente general que devuelva la tabla key/value dentro de "data"
       return normalizeSettings(data.data); 
    }

    // Unir objeto anidado de forma segura asegurando la forma base
    return {
      branding: { ...defaultSettings.branding, ...(data.branding || {}) },
      contact: { ...defaultSettings.contact, ...(data.contact || {}) },
      media: { ...defaultSettings.media, ...(data.media || {}) },
      checkout: { ...defaultSettings.checkout, ...(data.checkout || {}) },
      notifications: { ...defaultSettings.notifications, ...(data.notifications || {}) },
      maps: { ...defaultSettings.maps, ...(data.maps || {}) },
    };
  }

  // Fallback si la data es basura
  return normalized;
}

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const data = await api.get<any>('/settings');
    return normalizeSettings(data);
  } catch (e) {
    console.error('Failed to fetch settings from API, using default', e);
    return JSON.parse(JSON.stringify(defaultSettings));
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  await api.put<AppSettings>('/settings', settings);
};
