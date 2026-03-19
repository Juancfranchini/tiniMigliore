# Implementación: Arquitectura Multicanal de Notificaciones

Se preparó la arquitectura del proyecto aislando el envío directo de correos y delegando esta responsabilidad a un Orquestador general de notificaciones ([notificationService.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/notifications/notificationService.ts)). Esta abstracción permite enviar correos o mensajes de WhatsApp (en el futuro) con tan solo cambiar un parámetro, y sin tocar ni un píxel del frontend ni la lógica de guardado de los pedidos.

## Cambios Realizados

1. **Expansión de Tipos ([src/core/types/order.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/core/types/order.ts))**: Se creó el type `ConfirmationChannel = 'EMAIL' | 'WHATSAPP'` y se pre-configuró dentro de [OrderBuyerInfo](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/core/types/order.ts#17-29) (hoy opcional, pero útil si a futuro hay un selector en el checkout de "Cómo prefieres que te avisemos").
2. **Fachada Orquestadora ([src/services/notifications/notificationService.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/notifications/notificationService.ts))**: Recibe la información del pedido y bifurca condicionalmente la llamada asíncrona hacia Brevo o hacia WhatsApp.
3. **Draft de WhatsApp ([src/services/whatsapp/whatsappService.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/whatsapp/whatsappService.ts))**: Un servicio base similar a [brevo.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/email/brevo.ts) pero que espera pacientemente la inyección del código del SDK deseado, validando internamente la existencia indispensable de un teléfono.
4. **Desacoplamiento ([src/services/mock/order.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/mock/order.ts))**: Al crear la órden, ya no llamamos a _brevo_ literalmente. Llamamos a _notificationService_, pasando por parámetro el canal base.

## Integración futura (Recomendación de Proveedores)
Cuando desee darse de alta WhatsApp, mi recomendación directa es integrarse con **Meta Cloud API**.
- **Por qué Meta Cloud API**: Es el API oficial de WhatsApp. Para este tipo de mensajes transaccionales (confirmaciones y guías de pago) puedes crear **Templates / Plantillas** aprobadas por WhatsApp, y tienes mensualmente un rango enorme de plantillas gratuitas para iniciar conversaciones (hasta 1,000 servicios gratuitos mensuales usualmente).
- **Alternativa (Twilio)**: Es algo más rápido de prototipar, el SDK para JS es fantástico, pero los sobrecargos son ligeramente más altos si procesas miles de mensajes. Sin embargo, para volúmenes pequeños es igual de útil.

Para llevar a cabo esto a nivel plataforma:
1. En [whatsappService.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/whatsapp/whatsappService.ts) reemplazar el _console.log_ por un *fetch proxy* igual al que hicimos para el correo en el paso de Brevo.
2. Construirás la plantilla pre-aprobada en "Facebook Business Manager".
3. En el Checkout a futuro, si consideras oportuno, puedes sumar el RadioButton ("Quiero confirmarlo vía WhatsApp" o "Quiero confirmarlo vía Email").
