# Walkthrough: Integración Frontend-Backend

## Resumen de Cambios

La aplicación acaba de dar su primer gran paso hacia un entorno de producción real abandonando los datos "mockeados" (simulados en memoria). Se ha respetado rigurosamente la directiva de no alterar la UI ni generar componentes nuevos innecesarios, enfocándonos 100% en la capa de datos.

### 1. Variables de Entorno y Configuración Global
Se creó el archivo [.env](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/.env) en la raíz del proyecto para definir `VITE_API_URL=http://localhost:3000/api`. Esto permite que el entorno de desarrollo apunte a local, y cuando se despliegue a producción, apunte a la nube sin tocar código.

### 2. Cliente HTTP Centralizado ([src/core/api/client.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/core/api/client.ts))
Se escribió un *wrapper* alrededor de la función nativa [fetch](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/admin/pages/AdminLandingPage.tsx#14-28).
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
- Las funciones [createSection](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/api/catalog.ts#23-29), [updateSection](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/api/catalog.ts#30-36), [deleteProduct](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/mock/catalog.ts#220-225), etc., ya no devuelven un array fijo con pausas falsas (`setTimeout`). Ahora, alteran un estado en memoria e inmediatamente escriben este nuevo array completo en el disco del navegador mediante `localStorage.setItem`.
- De esta manera logramos persistencia sin salirnos de la arquitectura Frontend, manteniendo la firma exacta de las promesas y preparando todo para una API real.

### 6. Integración del Backoffice (Secciones, Productos y Landing)
Para comenzar a darle vida funcional al panel de administrador, se implementó el CRUD completo para las categorías/secciones, los productos y la gestión del Landing:
1. **API ([src/services/mock/catalog.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/mock/catalog.ts))**: Se actualizaron y programaron los métodos de mutación (create/delete/update), y se incorporó almacenamiento en disco (localStorage) para las entidades adicionales como Banner y Contacto.
2. **UI Interfaz (`src/features/admin/pages/...`)**:
   - Reutilizamos componentes existentes (`Modal` e `Input`) del Design System actual para Secciones y Productos.
   - En Productos agregamos la capacidad de asociar una sección al mismo mediante un "Select" dinámico, soporte de preview de imagen mediante URL y una estrategia de "Agotado" visual que deshabilita la compra.
   - En la vista del Landing habilitamos un CRUD en tiempo real para modificar los datos del Hero Banner y la tarjeta de Contacto. Centralizamos la lógica: las UI mutan directamente contra LocalStorage al presionar guardar.

## Flujo y Sincronización Front-Admin
Debido a que toda la aplicación (Backoffice y Landing Page Pública) apunta al mismo `catalogService` impulsado por LocalStorage, el flujo quedó 100% sincrónico. Cuando cambias un producto o sección en el panel de administrador, el cambio persistirá físicamente en el navegador. Al navegar a la Landing Pública, ésta, al montarse (useEffect), pedirá los datos a `catalogService` el cual leerá el archivo modificado del disco local, reflejando instantáneamente en público lo que se dictó en privado, sin necesidad de librerías de estado externas como Redux.

## Validación y Siguientes Pasos
Se ejecutó la compilación estricta de TypeScript (`npm run build`) para garantizar que la nueva capa de datos cumple estrictamente con las promesas de la capa anterior sin romper ningún contrato de la UI. La compilación fue exitosa (código de salida 0).

**¿Qué pasa ahora en el navegador?**
Si corremos el frontend y no hay un backend funcionando en el puerto 3000, los componentes fallarán silenciosamente (o mostrarán un cartel de error genérico si ya lo tenían configurado), lo cual es el comportamiento esperado en esta etapa. El frontend está listo y esperando a que el backend hable.
