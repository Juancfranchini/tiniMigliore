import type { CloudinaryImageDetails } from './cloudinary';

export interface ProductOption {
  id: string;
  name: string;
  priceOffset: number;
}

export interface Product {
  id: string;
  sectionId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageDetails?: CloudinaryImageDetails;
  options?: ProductOption[];
  isActive: boolean;
  createdAt: string;
}

export interface Section {
  id: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
}

export interface BannerConfig {
  id: string;
  imageUrl: string;
  imageDetails?: CloudinaryImageDetails;
  title?: string;
  subtitle?: string;
  callToActionText?: string;
  callToActionUrl?: string;
  showTitle: boolean;
  showSubtitle: boolean;
  showCta: boolean;
  isActive: boolean;
}

export interface ContactConfig {
  id: string;
  text: string;
  imageUrl: string;
  imageDetails?: CloudinaryImageDetails;
  isActive: boolean;
}
