import type { Order } from '../../core/types/order';

/**
 * Servicio provisional (Mock) para validaciones futuras vía WhatsApp.
 * Preparado para integrar APIs como Meta Cloud API o Twilio Messaging.
 */
export const whatsappService = {
  /**
   * Envía un mensaje transaccional a través de WhatsApp aprobando un Template
   */
  sendOrderConfirmationWhatsApp: async (order: Order): Promise<void> => {
    // Si la orden no tiene teléfono asociado, no se puede enviar
    if (!order.buyerInfo.phone) {
      console.warn(`No se puede enviar WhatsApp a la orden ${order.id} porque no hay teléfono válido.`);
      return;
    }

    console.group('Mock: WhatsApp Transaccional Prep');
    console.log(`Destino: ${order.buyerInfo.phone}`);
    console.log(`Orden: ${order.id} | Total a liquidar: $${order.total}`);
    // console.log('Payload WhatsApp (A crear en futuro con Meta API o Twilio):', ... )
    console.groupEnd();

    // Simulación de network delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
