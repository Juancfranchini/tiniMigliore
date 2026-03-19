# Walkthrough: Backoffice Settings Module

The new "Configuraciones" module has been successfully implemented in the backoffice to allow editing system parameters while leaving sensitive parts out of the frontend.

## Changes Made

- **Types ([src/types/settings.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/types/settings.ts))**: Created the [AppSettings](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/types/settings.ts#1-27) interface defining the shape of system parameters (`branding`, `contact`, `media`, `checkout`, `notifications`).
- **Service ([src/services/settingsService.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/settingsService.ts))**: Created a service [getSettings](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/settingsService.ts#32-55) and [saveSettings](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/settingsService.ts#56-62) to handle mock persistence with localStorage.
- **State Store ([src/features/admin/store/settingsStore.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/admin/store/settingsStore.ts))**: Implemented a Zustand store to handle loading and saving the settings asynchronously.
- **Settings Page UI ([src/features/admin/pages/AdminSettingsPage.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/admin/pages/AdminSettingsPage.tsx))**: Built a styled, responsive form consisting of separate logical sections (Marca, Contacto, Pedidos, Notificaciones, Media) to collect and display data.
- **Application Integration**:
  - [src/App.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/App.tsx): Registered the new `/admin/settings` route.
  - [src/components/layouts/AdminLayout.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/components/layouts/AdminLayout.tsx): Added the "Configuraciones" option in the backoffice sidebar.

## Automated Verification

- Run `npm run build` using `tsc -b && vite build`. All type checks and builds passed successfully with no errors (`Exit code: 0`).

## Persistencia de Datos

Actualmente, las configuraciones se guardan localmente utilizando `localStorage` en el navegador del usuario bajo la clave `tinimigliore_settings`. 
Cuando en el futuro conecten el panel a una API real (Backend), solo será necesario modificar [src/services/settingsService.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/settingsService.ts) para que apunte a las URL del servidor usando `fetch` o `axios`, dejando intacta la interfaz gráfica y la tienda de Zustand.

## Integraciones Futuras

### Cloudinary (Media)
Las propiedades que configuramos (Cloud Name, Upload Preset, Folder) están preparadas para reemplazar valores que hoy pueden estar harcodeados en los componentes de Subida de Imágenes. Esto habilitará que el administrador cambie de cuente de Cloudinary directamente desde el sistema, sin tener que volver a desplegar la aplicación móvil o web.

### Notificaciones / Email
El nombre del remitente (`senderName`) y el email de soporte (`supportEmail`) podrán ser consumidos por una API que use, por ejemplo, Resend o SendGrid, para personalizar los correos que reciben los clientes cuando realizan un nuevo pedido.

> [!WARNING]
> La seguridad del frontend dicta que claves secretas (como la `API_SECRET` de Cloudinary o tokens de Email) **nunca** deben alojarse ni solicitarse en los formularios de React, por eso han sido excluidos. Esos valores vivirán exclusivamente como variables de entorno seguras en la red o servidor del backend.
