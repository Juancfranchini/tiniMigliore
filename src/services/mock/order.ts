import type { Order, OrderBuyerInfo, OrderItem, OrderStatus, DeliveryMethod } from '../../core/types/order';
import { notificationService } from '../notifications/notificationService';

const STORAGE_KEYS = {
  ORDERS: 'tini_orders',
};

// --- INITIAL MOCK DATA ---
const INITIAL_ORDERS: Order[] = [
  { 
    id: 'ORD-00102', 
    buyerInfo: { name: 'Ana Pérez', phone: '1144445555', street: 'Av. Cabildo', number: '1234', state: 'CABA', zipCode: '1426' },
    items: [
      { productId: 'prod-1', productName: 'Tarta de Frutillas', unitPrice: 8500, quantity: 2, totalLinePrice: 17000 }
    ],
    total: 17000, 
    deliveryMethod: 'delivery',
    shippingFee: 0,
    shippingCostToRemis: 0,
    netRevenueExcludingShipping: 17000, 
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() 
  },
  { 
    id: 'ORD-00101', 
    buyerInfo: { name: 'Julio Iglesias', phone: '1133332222', street: 'Libertador', number: '500', state: 'CABA', zipCode: '1001' },
    items: [
      { productId: 'prod-2', productName: 'Lemon Pie', unitPrice: 7900, quantity: 1, totalLinePrice: 7900 }
    ],
    total: 7900, 
    deliveryMethod: 'pickup',
    shippingFee: 0,
    shippingCostToRemis: 0,
    netRevenueExcludingShipping: 7900, 
    status: 'PREPARING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() 
  },
];

// --- LOCAL STORAGE HELPERS ---
const getStoredOrders = (): Order[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  return INITIAL_ORDERS;
};

const saveOrders = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

let currentOrders = getStoredOrders();

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate basic unique IDs (e.g. ORD-B3X1A)
const generateOrderId = () => `ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

// --- ORDER SERVICE ---
export const orderService = {
  
  getOrders: async (): Promise<Order[]> => {
    await delay(300);
    // Sort descending by creation date
    return [...currentOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getOrderById: async (id: string): Promise<Order | undefined> => {
    await delay(200);
    return currentOrders.find(o => o.id === id);
  },

  createOrder: async (buyerInfo: OrderBuyerInfo, items: OrderItem[], total: number, deliveryMethod: DeliveryMethod = 'delivery'): Promise<Order> => {
    await delay(1000); // Simulate processing time
    
    // Future: dynamic shipping calculation logic here
    const shippingFee = deliveryMethod === 'delivery' ? 0 : 0; 
    const shippingCostToRemis = deliveryMethod === 'delivery' ? 0 : 0;
    const netRevenueExcludingShipping = total - shippingFee;
    
    const newOrder: Order = {
      id: generateOrderId(),
      buyerInfo,
      items,
      total,
      deliveryMethod,
      shippingFee,
      shippingCostToRemis,
      netRevenueExcludingShipping,
      status: 'PENDING_CONFIRMATION',
      createdAt: new Date().toISOString()
    };
    
    currentOrders = [newOrder, ...currentOrders];
    saveOrders(currentOrders);
    
    // Disparar notificación de confirmación (Email o WhatsApp según orquestador)
    const channel = newOrder.buyerInfo.preferredConfirmationChannel || 'EMAIL';
    notificationService.sendOrderConfirmation(newOrder, channel).catch(err => {
      console.error('Error enviando notificación transaccional:', err);
    });
    
    return newOrder;
  },

  updateOrderStatus: async (id: string, newStatus: OrderStatus): Promise<Order> => {
    await delay(400);
    const index = currentOrders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Pedido no encontrado');
    
    currentOrders[index] = { 
      ...currentOrders[index], 
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    saveOrders(currentOrders);
    return currentOrders[index];
  }
};
