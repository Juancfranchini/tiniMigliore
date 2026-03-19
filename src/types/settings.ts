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
}
