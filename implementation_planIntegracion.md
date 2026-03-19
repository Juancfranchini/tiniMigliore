# Plan de Integración Frontend-Backend

## Análisis del Estado Actual
Actualmente, los datos de la aplicación provienen de [src/services/mock/catalog.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/mock/catalog.ts), el cual exporta un objeto `catalogService` con métodos simulados ([getSections](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/mock/catalog.ts#79-85), [getProducts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/mock/catalog.ts#86-96), etc.).
Estos métodos son consumidos en:
- [src/features/shop/pages/HomePage.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/shop/pages/HomePage.tsx)
- [src/features/cart/store/cartStore.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/cart/store/cartStore.ts)
- Páginas de Admin (`AdminLandingPage`, `AdminSectionsPage`, `AdminProductsPage`)

La gran ventaja de la estructura actual es que la UI y la obtención de datos ya están separadas. Los componentes solo llaman a `catalogService.getAlgo()` sin importar de dónde viene el dato.

## Plan de Implementación Paso a Paso

### 1. Preparación de la Capa de Red (API Client)
**Dónde:** `src/core/api/client.ts` (Nuevo)
Crearemos un cliente o "wrapper" de `fetch` (muy útil didácticamente para entender cómo funciona la red en JS) o configuraremos Axios si se prefiere. 
Este cliente se encargará de:
- Leer la URL base del backend desde variables de entorno (`.env` -> `VITE_API_URL`).
- Configurar headers por defecto (ej: `Content-Type: application/json`).
- Manejar errores globales (ej: si el backend devuelve un 500 o 401).

### 2. Creación de los Servicios Reales
**Dónde:** `src/services/api/catalog.ts` (Nuevo)
Crearemos un nuevo `catalogService` que tendrá **exactamente la misma firma (mismos métodos y tipos de retorno)** que el mock actual. 
En lugar de devolver un array fijo con `setTimeout`, usará el API Client para hacer peticiones HTTP al backend real.

### 3. Adaptadores (Si son necesarios)
**Dónde:** Dentro de `src/services/api/catalog.ts`
Si el backend devuelve los datos con nombres diferentes (por ejemplo, `_id` en lugar de `id`, o `created_at` en lugar de `createdAt`), crearemos funciones simples "adaptadoras" dentro del servicio. 
*Concepto didáctico:* El servicio es responsable de transformar lo que escupe el backend a lo que nuestra UI (interfaces en [src/core/types/catalog.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/core/types/catalog.ts)) espera. ¡La UI no debe enterarse de cómo es la base de datos!

### 4. Intercambio (Swap) del Mock por la API
**Dónde:** Componentes que consumen servicios ([HomePage.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/shop/pages/HomePage.tsx), etc.)
Simplemente cambiaremos el `import`:
```diff
- import { catalogService } from '../../../services/mock/catalog';
+ import { catalogService } from '../../../services/api/catalog';
```

### 5. Manejo de Estados de Carga y Error en UI
Revisaremos en los componentes si el `useState` y el JSX están contemplando correctamente los estados `isLoading` y `error` cuando la petición HTTP demora o falla (algo que con el mock no suele pasar seguido).

---

## Orden Sugerido de Endpoints a Conectar

Para ir de lo más seguro a lo más complejo, el orden de conexión será:

1. **Lectura Pública (GET):**
   - `GET /api/sections`
   - `GET /api/products` (aceptando query params como `?sectionId=...`)
   *(Al conectar estos dos, la Landing Page ya será 100% real)*
2. **Contenido Dinámico (GET):**
   - `GET /api/banner`
   - `GET /api/contact`
3. **Escritura Backoffice (POST/PUT/DELETE):**
   - `POST /api/products` 
   - `PUT /api/products/:id`
   *(Estas confirmarán si hay que enviar tokens de autenticación o ajustar headers)*

---

## Qué se mantiene y qué se adapta

- **Se Mantiene Intacto:**
  - Componentes visuales (`HeroBanner`, `MenuSection`, `ProductCard`).
  - Hooks y lógicas de estado y referencias dentro del JSX base.
  - Los tipos ubicados en [src/core/types/catalog.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/core/types/catalog.ts) (actúan como nuestro "contrato" de UI).
- **Se Adapta:**
  - Los archivos `.env` (crear variables).
  - La importación en las páginas para apuntar al servicio real.
  - Mapeo de datos dentro de los nuevos servicios si el backend tiene otro formato.
