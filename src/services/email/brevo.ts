import type { Order } from '../../core/types/order';

// Utilizamos una variable de entorno hipotética para apuntar al backend seguro
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const SENDER_EMAIL = import.meta.env.VITE_SENDER_EMAIL || 'hola@tinimigliore.com';
const SENDER_NAME = 'Tini Migliore';

/**
 * Payload base para preparar el envío transaccional en Brevo
 */
interface BrevoEmailPayload {
  sender: { name: string; email: string };
  to: { name?: string; email: string }[];
  subject: string;
  htmlContent: string;
}

export const emailService = {
  /**
   * Envía un correo de confirmación al backend para que este le inyecte el Secreto (Brevo API Key)
   */
  sendOrderConfirmationEmail: async (order: Order): Promise<void> => {
    // Si la orden no tiene email asociado, no se puede enviar
    if (!order.buyerInfo.email) {
      console.warn(`No se puede enviar email a la orden ${order.id} porque no se especificó un email.`);
      return;
    }

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}x ${item.productName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.totalLinePrice}</td>
      </tr>
    `).join('');

    const isDelivery = order.deliveryMethod === 'delivery';
    const addressHtml = isDelivery 
      ? `<p><strong>Dirección:</strong> ${order.buyerInfo.street} ${order.buyerInfo.number}, ${order.buyerInfo.state}</p>
         ${order.buyerInfo.references ? `<p><strong>Referencias:</strong> ${order.buyerInfo.references}</p>` : ''}`
      : `<p><strong>Método:</strong> Retiro en Pastelería</p>`;

    const payload: BrevoEmailPayload = {
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ name: order.buyerInfo.name, email: order.buyerInfo.email }],
      subject: `Confirmación de pedido ${order.id} - Tini Migliore`,
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #7A5B93;">¡Hola ${order.buyerInfo.name}! Recibimos tu pedido.</h2>
          <p>Tu solicitud <strong>${order.id}</strong> ha sido registrada exitosamente y se encuentra <strong>pendiente de validación</strong>.</p>
          <p>Para confirmar el pedido y comenzar a prepararlo, asegúrate de haber enviado el comprobante de pago respondiendo a este correo o vía nuestros canales oficiales.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #7A5B93;">Resumen del Pedido</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
              <tr>
                <td style="padding: 8px; font-weight: bold;">Subtotal</td>
                <td style="padding: 8px; font-weight: bold; text-align: right;">$${order.total - (order.shippingFee || 0)}</td>
              </tr>
              ${isDelivery ? `
              <tr>
                <td style="padding: 8px; font-weight: bold;">Envío</td>
                <td style="padding: 8px; font-weight: bold; text-align: right;">$${order.shippingFee || 0}</td>
              </tr> ` : ''}
              <tr>
                <td style="padding: 8px; font-weight: bold; font-size: 1.1em; border-top: 2px solid #ccc;">Total a Pagar</td>
                <td style="padding: 8px; font-weight: bold; font-size: 1.1em; border-top: 2px solid #ccc; text-align: right; color: #7A5B93;">$${order.total}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #7A5B93;">Datos de Entrega</h3>
            ${addressHtml}
            <p><strong>Teléfono:</strong> ${order.buyerInfo.phone}</p>
          </div>
          
          <p style="margin-top: 30px; font-size: 0.9em; color: #666;">¡Gracias por elegir la artesanía y calidad de Tini Migliore!</p>
        </div>
      `
    };

    try {
      // POST al endpoint proxy de nuestro backend (el cual guardará VITE_BREVO_API_KEY segura)
      const endpoint = `${API_URL}/api/email/send`;
      
      console.group('Real Integration: Enviando payload al backend');
      console.log(`Endpoint destino: ${endpoint}`);
      console.log('Payload:', payload);
      console.groupEnd();

      // En Producción real, descomentar el código de abajo:
      /*
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('Error al enviar correo desde el backend proxy');
      }
      */
     
      // Simulación de delay de red temporal
      await new Promise(resolve => setTimeout(resolve, 800));

    } catch (error) {
      console.error('Error enviando notificación:', error);
    }
  }
};
