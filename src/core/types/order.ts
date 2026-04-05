export interface OrderItem {
  productId: string;
  productName: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  selectedOptions?: import('./catalog').ProductOption[];
  totalLinePrice: number;
}

export type OrderStatus = 'PENDING_CONFIRMATION' | 'PENDING' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

export type DeliveryMethod = 'pickup' | 'delivery';

export type ConfirmationChannel = 'EMAIL' | 'WHATSAPP';

export interface OrderBuyerInfo {
  name: string;
  phone: string;
  email?: string;
  preferredConfirmationChannel?: ConfirmationChannel;
  deliveryDate?: string;
  deliveryTimeRange?: string;
  street?: string; // Opt for pickup
  number?: string;
  neighborhood?: string;
  state?: string;
  zipCode?: string;
  references?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  buyerInfo: OrderBuyerInfo;
  total: number;
  status: OrderStatus;
  deliveryMethod?: DeliveryMethod; // Optional for backward compatibility
  deliveryDate?: string;
  deliveryTimeRange?: string;
  shippingFee?: number;
  shippingCostToRemis?: number;
  netRevenueExcludingShipping?: number;
  createdAt: string;
  updatedAt?: string;
}
