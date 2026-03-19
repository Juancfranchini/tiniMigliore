import type { Order, ConfirmationChannel } from '../../core/types/order';
import { emailService } from '../email/brevo';
import { whatsappService } from '../whatsapp/whatsappService';

/**
 * Orquestador principal de notificaciones del negocio.
 * Decide por qué canal notificar al cliente (Email o WhatsApp)
 * en base a su preferencia o al flujo configurado.
 */
export const notificationService = {
  /**
   * Envía la confirmación del pedido usando el canal requerido
   */
  sendOrderConfirmation: async (
    order: Order, 
    channel: ConfirmationChannel = 'EMAIL'
  ): Promise<void> => {
    try {
      if (channel === 'WHATSAPP') {
        await whatsappService.sendOrderConfirmationWhatsApp(order);
      } else {
        // Por defecto o explícito EMAIL
        await emailService.sendOrderConfirmationEmail(order);
      }
    } catch (error) {
       console.error(`Error orquestando notificación via ${channel}:`, error);
    }
  }
};
