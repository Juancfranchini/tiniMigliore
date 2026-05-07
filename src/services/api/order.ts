import { API_URL } from './client';
import type { Order, OrderBuyerInfo, OrderItem, OrderStatus, DeliveryMethod } from '../../core/types/order';

/**
 * Mapea la respuesta snake_case de la DB a nuestro tipo Order
 */
const mapToOrder = (dbOrder: any): Order => {
  return {
    // Usamos el ID original de backend para operaciones, como string por si acaso
    id: dbOrder.id.toString(),
    buyerInfo: {
      name: dbOrder.buyer_name,
      phone: dbOrder.buyer_phone,
      email: dbOrder.buyer_email || undefined,
      street: dbOrder.address_street || undefined,
      number: dbOrder.address_number || undefined,
      neighborhood: dbOrder.address_neighborhood || undefined,
      state: dbOrder.address_state || undefined,
      zipCode: dbOrder.address_zip_code || undefined,
      references: dbOrder.address_references || undefined,
    },
    items: dbOrder.items ? dbOrder.items.map((item: any) => ({
      productId: item.product_id,
      productName: item.product_name,
      unitPrice: Number(item.unit_price),
      quantity: Number(item.quantity),
      totalLinePrice: Number(item.total_line_price)
    })) : [],
    total: Number(dbOrder.net_revenue_excluding_shipping) + Number(dbOrder.shipping_fee || 0),
    deliveryMethod: dbOrder.delivery_method as DeliveryMethod,
    deliveryDate: dbOrder.delivery_date,
    deliveryTimeRange: dbOrder.delivery_time_range,
    shippingFee: Number(dbOrder.shipping_fee || 0),
    shippingCostToRemis: Number(dbOrder.shipping_cost_to_remis || 0),
    netRevenueExcludingShipping: Number(dbOrder.net_revenue_excluding_shipping),
    status: dbOrder.status as OrderStatus,
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at,
  };
};

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      if (!response.ok) {
        throw new Error('Error al obtener pedidos');
      }
      const data = await response.json();
      return data.map(mapToOrder);
    } catch (error) {
      console.error('Error in getOrders:', error);
      throw error;
    }
  },

  getOrderById: async (id: string): Promise<Order | undefined> => {
    try {
      const response = await fetch(`${API_URL}/orders/${id}`);
      if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error('Error al obtener el pedido');
      }
      const data = await response.json();
      return mapToOrder(data);
    } catch (error) {
      console.error('Error in getOrderById:', error);
      throw error;
    }
  },

  createOrder: async (buyerInfo: OrderBuyerInfo, items: OrderItem[], _total: number, deliveryMethod: DeliveryMethod = 'delivery'): Promise<Order> => {
    // Calculo inicial del fee (se puede ajustar luego con backend completo para envíos)
    const shippingFee = 0; 
    const shippingCostToRemis = 0;

    const payload = {
      buyer: {
        name: buyerInfo.name,
        phone: buyerInfo.phone,
        email: buyerInfo.email,
      },
      products: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity
      })),
      deliveryMethod: deliveryMethod,
      deliveryDate: buyerInfo.deliveryDate,
      deliveryTimeRange: buyerInfo.deliveryTimeRange,
      address: {
        street: buyerInfo.street,
        number: buyerInfo.number,
        neighborhood: buyerInfo.neighborhood,
        state: buyerInfo.state,
        zipCode: buyerInfo.zipCode,
        references: buyerInfo.references,
      }
    };

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error in POST /orders response:', response.status, errorText);
        throw new Error(`Error al crear el pedido: ${errorText || response.statusText}`);
      }

      const result = await response.json();
      return mapToOrder(result.order);
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  },

  updateOrderStatus: async (id: string, newStatus: OrderStatus): Promise<Order> => {
    try {
      const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado del pedido');
      }

      const result = await response.json();
      return mapToOrder(result.order);
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      throw error;
    }
  }
};
