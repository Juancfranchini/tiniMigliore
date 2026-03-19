# Walkthrough: Integración Frontend-Backend

## Resumen de Cambios

La aplicación acaba de dar su primer gran paso hacia un entorno de producción real abandonando los datos "mockeados" (simulados en memoria). Se ha respetado rigurosamente la directiva de no alterar la UI ni generar componentes nuevos innecesarios, enfocándonos 100% en la capa de datos.

### 1. Variables de Entorno y Configuración Global
Se creó el archivo [.env](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/.env) en la raíz del proyecto para definir `VITE_API_URL=http://localhost:3000/api`. Esto permite que el entorno de desarrollo apunte a local, y cuando se despliegue a producción, apunte a la nube sin tocar código.

### 2. Cliente HTTP Centralizado ([src/core/api/client.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/core/api/client.ts))
Se escribió un *wrapper* alrededor de la función nativa [fetch](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/admin/pages/DashboardPage.tsx#15-29).
**¿Por qué es una buena práctica didáctica?**
- Evita repetir `headers: { 'Content-Type': 'application/json' }` en cada llamada.
- Centraliza la concatenación de la URL base (`http://localhost:3000/api/products`).
- Captura y estandariza los errores (ej: si el backend devuelve un 404, este cliente lanza un `Error` claro para que la UI lo atrape).

### 3. El Nuevo Servicio API ([src/services/api/catalog.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/api/catalog.ts))
Este archivo es el corazón de la integración. Exporta un objeto `catalogService` que tiene exactamente los **mismos nombres funcionales y retorna los mismos Tipos de TypeScript** que su versión mock original.

```typescript
// Ejemplo de cómo quedó uno de los métodos
  getProducts: async (sectionId?: string): Promise<Product[]> => {
    const url = sectionId ? `/products?sectionId=${sectionId}` : '/products';
    return await api.get<Product[]>(url);
  },
```

### 4. Intercambio (El "Swap")
Nos paseamos por las siguientes páginas y únicamente cambiamos la ruta del import, demostrando el poder de la separación de responsabilidades:
- [HomePage.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/shop/pages/HomePage.tsx)
- [AdminLandingPage.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/admin/pages/AdminLandingPage.tsx)
- [AdminSectionsPage.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/admin/pages/AdminSectionsPage.tsx)
- [AdminProductsPage.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/admin/pages/AdminProductsPage.tsx)

```diff
- import { catalogService } from '../../../services/mock/catalog';
+ import { catalogService } from '../../../services/api/catalog';
```
*(También se actualizó [cartStore.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/cart/store/cartStore.ts) preparándolo para cuando hagamos validaciones reales de carrito contra el servidor).*

### 5. Persistencia Local (Simulando Base de Datos)
Debido a que aún no tenemos un servidor real conectando con una base de datos, reescribimos el servicio `catalogService` del entorno Mock ([src/services/mock/catalog.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/mock/catalog.ts)) para utilizar el `localStorage` del navegador.
- Al cargar la app, se leen los datos del almacenamiento local. Si está vacío, se "siembra" con los Mocks originales.
- Las funciones [createSection](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/mock/catalog.ts#151-158), [updateSection](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/mock/catalog.ts#159-168), [deleteProduct](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/mock/catalog.ts#220-225), etc., ya no devuelven un array fijo con pausas falsas (`setTimeout`). Ahora, alteran un estado en memoria e inmediatamente escriben este nuevo array completo en el disco del navegador mediante `localStorage.setItem`.
- De esta manera logramos persistencia sin salirnos de la arquitectura Frontend, manteniendo la firma exacta de las promesas y preparando todo para una API real.

### 6. Integración del Backoffice (Secciones, Productos y Landing)
Para comenzar a darle vida funcional al panel de administrador, se implementó el CRUD completo para las categorías/secciones, los productos y la gestión del Landing:
1. **API ([src/services/mock/catalog.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/mock/catalog.ts))**: Se actualizaron y programaron los métodos de mutación (create/delete/update), y se incorporó almacenamiento en disco (localStorage) para las entidades adicionales como Banner y Contacto.
2. **UI Interfaz (`src/features/admin/pages/...`)**:
   - Reutilizamos componentes existentes (`Modal` e `Input`) del Design System actual para Secciones y Productos.
   - En Productos agregamos la capacidad de asociar una sección al mismo mediante un "Select" dinámico, soporte de preview de imagen mediante URL y una estrategia de "Agotado" visual que deshabilita la compra.
   - En la vista del Landing habilitamos un CRUD en tiempo real para modificar los datos del Hero Banner y la tarjeta de Contacto. Centralizamos la lógica: las UI mutan directamente contra LocalStorage al presionar guardar.

### 7. Flujo Bideraccional de Pedidos (Checkout ↔ Admin)
Se diseñó un sistema para recolectar las compras del frontend y permitir su gestión transparente desde el backoffice:
1. **Tipado**: Se amplió `core/types/order.ts` para contener toda la metadata del comprador (nombre, teléfono, dirección) y los estados del pedido (`PENDING`, `PREPARING`, `SHIPPING`, etc).
2. **Persistencia**: Se creó un nuevo servicio `src/services/mock/order.ts`, que funciona enteramente sobre `localStorage` simulando latencia para emular una API real.
3. **Checkout (`CheckoutPage.tsx`)**: Reemplazamos la promesa falsa ("setTimeout") por un llamado real a `orderService.createOrder` pasándole los datos del formulario (generado con `react-hook-form` + `zod`), y el contenido del subtotal del carrito. Al generarse la orden, se persisté instantáneamente.
4. **Admin Panel (`AdminOrdersPage.tsx`)**: La página del administrador dejó de leer datos hardcodeados para listar las órdenes vivas mapeando el localStorage en tiempo de carga (`orderService.getOrders()`). Se dotó a la tabla de un menú seleccionable que ejecuta `orderService.updateOrderStatus(...)` en segundo plano, mutando permanentemente el estado en el disco.

### 8. Inteligencia de Negocios: Dashboard Dinámico
El componente `DashboardPage.tsx` abandonó sus datos decorativos (`hardcodeados`) para calcular métricas empresariales reales de tu backoffice:
1. **Recolección en vivo**: Utiliza ambos servicios (`orderService` y `catalogService`) importados al cargar la página a través de un `Promise.all`.
2. **Cálculo Desacoplado**:
   - `Ingresos`: filtra órdenes descartadas (`CANCELLED`) y suma matemáticamente (`reduce()`) el `total` de cada pedido.
   - `Pendientes`: filtra lo no pagado u o no entregado (`!DELIVERED`).
   - `Clientes Únicos / Recurrentes`: centraliza y limpia con RegEx cada número de teléfono para usarlos de llave primaria natural utilizando un Map (`Map<string, number>`). Aquellos insertados más de una vez incrementan directamente tu tasa de retención o recurrencia (%).
   - `Catálogo`: cuenta instantáneamente tus productos en vidriera (`isActive`).
3. **Flujo de Historial**: Convirtió el placeholder gris estático en una tabla idéntica a la vista de gestor de pedidos, formateando dinámicamente colores de estado y fechas, insertándole una paginación "Slice" de los últimos 5.
 
## Validación y Siguientes Pasos
Se ejecutó la compilación estricta de TypeScript (`npm run build`) en múltiples oportunidades tras añadir tipos y estados dinámicos sin presentar ninguna ruptura.

**¿Qué pasa ahora en el navegador?**
Si corremos el frontend y no hay un backend funcionando en el puerto 3000, los componentes fallarán silenciosamente (o mostrarán un cartel de error genérico si ya lo tenían configurado), lo cual es el comportamiento esperado en esta etapa. El frontend está listo y esperando a que el backend hable.
