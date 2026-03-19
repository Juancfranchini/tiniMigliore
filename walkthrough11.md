# Implementación: Retiro vs Envío a Domicilio

Se actualizó el sistema para permitir a los usuarios seleccionar si quieren retirar en la pastelería o si prefieren el envío a domicilio mediante remís. Además, el panel administrativo ahora permite discriminar correctamente los costos de envío de la ganancia real producto de las ventas.

## Cambios Realizados

- **Modelo de Datos ([src/core/types/order.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/core/types/order.ts))**:
  - Se agregó el tipo [DeliveryMethod](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/core/types/order.ts#13-14) ('pickup' | 'delivery').
  - Se agregaron las propiedades opcionales al tipo [OrderBuyerInfo](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/core/types/order.ts#15-26) para permitir que calles/números sean opcionales en retiro.
  - Se agregaron propiedades de métricas al tipo [Order](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/core/types/order.ts#27-40): `deliveryMethod`, `shippingFee`, `shippingCostToRemis`, `netRevenueExcludingShipping`.

- **Experiencia de Checkout ([src/features/shop/pages/CheckoutPage.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/shop/pages/CheckoutPage.tsx))**:
  - El formulario cuenta con un nuevo radio button visualizado como tarjetas seleccionables ("Envío a Domicilio" y "Retiro en Pastelería").
  - El `zodSchema` fue refactorizado con `superRefine` para que los campos de dirección validen estricto **sólo** si el método elegido es 'Envío'. Si eligen 'Retiro', no hay validación estricta de la dirección.
  - El diseño general del carrito y la experiencia fluida se mantuvieron intactos.

- **Servicio Interno de Pedidos ([src/services/mock/order.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/mock/order.ts))**:
  - Al crearse la orden, ahora también se ingresan y almacenan los valores correspondientes para el envío, permitiendo que a futuro un algoritmo dinámico asigne un costo en lugar del actual `$0` provisorio. Todos los subtotales netos (`netRevenueExcludingShipping`) se calculan restando lo que es de envío.

- **Admin Dashboard ([src/features/admin/pages/DashboardPage.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/admin/pages/DashboardPage.tsx))**:
  - La métrica de "Ingresos Totales" ahora suma el **Neto Real** (`netRevenueExcludingShipping` o fallback al `total` en casos antiguos) para que la tienda no se vea inflada en ganancias por la cobranza de remises.
  - Se sumó un desglose visual interno con sub-textos en la tarjeta de Ingresos para que el administrador pueda ver a simple vista cuánto dinero extra corresponde al "Envío cobrado" y al "Costo de Remís".
  
- **Admin Orders ([src/features/admin/pages/AdminOrdersPage.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/admin/pages/AdminOrdersPage.tsx))**:
  - La fila del cliente ahora advierte textualmente si se trata de "Envío a [Dirección]" o "Retiro en Pastelería".
  - La columna Total expone en un subtexto pequeño si dentro de ese pago hay un cargo de envío incluído (ej. [(Envío: $X.XXX)](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/mock/order.ts#53-55)).

## Adaptación de los Pedidos Anteriores
Los campos de dirección ahora son opcionales a nivel de tipo de dato TypeScript, por lo que todo pedido existente sin los nuevos metadatos de "Envío" es compatible y en el dashboard utilizará fallback hacia `order.total` si la orden no especifica netos separados. El sistema es retrocompatible.
