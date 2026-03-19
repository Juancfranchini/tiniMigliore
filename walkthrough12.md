# Implementación: Base para Validación por Email

Se ha implementado de forma mantenible y retrospectiva la base arquitectónica para validar pedidos a través de email (usando Brevo) como paso intermedio obligatorio antes de aceptarlos.

## Modificaciones y Adiciones

- **Nuevo Estado ([src/core/types/order.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/core/types/order.ts))**: Se añadió el estado de pedido `PENDING_CONFIRMATION` (A Confirmar). Este estado es ahora el primero que toma cualquier orden por default.
- **Formulario de Checkout ([src/features/shop/pages/CheckoutPage.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/shop/pages/CheckoutPage.tsx))**:
  - El campo de correo electrónico pasó de ser opcional a ser **requerido** bajo un formato de email válido, con el texto "Requerido para confirmación".
  - El mensaje modal de éxito fue redactado para indicarle claramente al cliente: *"Te enviamos un correo electrónico con los pasos a seguir para confirmar el pago..."*.
- **Servicio de Correos Transaccionales ([src/services/email/brevo.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/email/brevo.ts))**:
  - Se creó un adaptador inicial para Brevo encapsulando la lógica. Este módulo define la función [sendOrderConfirmationEmail](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/email/brevo.ts#19-69) y el contrato del payload transaccional. Por ahora, imita la latencia del servidor e imprime en consola los contenidos que se van a mandar. Esta preparado para simplemente quitar el comentario en el bloque [fetch](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/admin/pages/DashboardPage.tsx#15-29) cuando se cuente con las API keys.
- **Generación de pedidos ([src/services/mock/order.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/mock/order.ts))**:
  - Las nuevas órdenes inician con `status: 'PENDING_CONFIRMATION'`.
  - Inmediatamente luego de guardarlas, se llama a `emailService.sendOrderConfirmationEmail` sin bloquear el hilo principal (manejo asíncrono pasivo).
- **Adaptación Visual en Admin ([src/features/admin/pages/DashboardPage.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/admin/pages/DashboardPage.tsx) y [AdminOrdersPage.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/admin/pages/AdminOrdersPage.tsx))**:
  - El estado estrena un badge de color anaranjado (`#FFEDD5` de fondo, texto `#9A3412`) para advertir a los administradores que el pedido debe ser confirmado por ellos o por el usuario vía correo antes de pasar a "Preparando" o a "Pendiente" estricto.

## Integración con WhatsApp (Futuro)
Cuando se desee agregar WhatsApp para las validaciones:
1. En `src/services`, crear la carpeta `src/services/whatsapp` e incluir `twilio.ts` o `meta.ts` con una función `sendOrderConfirmationWhatsApp(order: Order)`.
2. En `src/services/mock/order.ts` (o un `notificationService.ts`), agregar condicionalmente: *"Si el formulario de checkout recogió que prefiere whatsapp, llamar a whatsappService; sino, llamar a emailService"*. La persistencia seguirá dándose en segundo plano (promesa sin *await* bloqueador).
3. Todo el resto de la estructura (frontend, cart, estado `PENDING_CONFIRMATION`) ya es compatible y **no** necesita ser tocado nuevamente.
