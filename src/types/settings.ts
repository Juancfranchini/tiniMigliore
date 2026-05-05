export interface AppSettings {
  branding: {
    businessName: string;
    logoUrl?: string;
  };
  contact: {
    instagramUrl: string;
    tiktokUrl: string;
    whatsappUrl: string;
    email: string;
  };
  media: {
    cloudinaryCloudName: string;
    cloudinaryUploadPreset: string;
    cloudinaryFolder: string;
  };
  checkout: {
    defaultShippingFee: number;
    pickupEnabled: boolean;
    deliveryEnabled: boolean;
    storePickupLabel?: string;
  };
  notifications: {
    senderName: string;
    supportEmail: string;
    orderConfirmationEnabled: boolean;
  };
  maps: {
    googleMapsApiKey: string;
    sellerAddress: string;
    sellerAddressLabel?: string;
    mapsEnabled: boolean;
  };
  landing: {
    theme: 'dark' | 'light';
    heroTagline: string;
    aboutTitle: string;
    aboutText1: string;
    aboutText2: string;
    deliveryZone: string;
    pickupZone: string;
    ctaTitle: string;
    ctaSubtitle: string;
    specialty1Title: string;
    specialty1Desc: string;
    specialty2Title: string;
    specialty2Desc: string;
    specialty3Title: string;
    specialty3Desc: string;
    specialty4Title: string;
    specialty4Desc: string;
  };
}

