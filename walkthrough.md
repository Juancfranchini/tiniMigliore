# Conexión Frontend - Backend (Railway)

## 🛠️ Cambios Realizados
- **Nuevo API Cliente**: Se creó [src/services/api/client.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/api/client.ts) con una función [healthCheck()](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/api/client.ts#8-25) para probar la conectividad de forma reutilizable.
- **Verificación Automática**: Se modificó [src/App.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/App.tsx) para invocar este *health check* inmediatamente al abrir la aplicación.
- **Feedback Visual (Toasts)**: Se reutilizó el sistema de notificaciones propio ([ToastContainer](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/components/ui/Toast/ToastContainer.tsx#6-17)) para alertar al usuario:
  - 🟢 **Éxito**: "🚀 Backend conectado correctamente"
  - 🔴 **Error**: "⚠️ Error: No se pudo conectar al Backend"
- **Plantilla de Entorno**: Se generó el archivo [.env.example](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/.env.example) para documentar cómo declarar `VITE_API_URL`.

## 🧪 Cómo probarlo

1. **Abre tu archivo [.env](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/.env)** y asegúrate de configurar tu URL de Railway:
   ```env
   VITE_API_URL=https://AQUI-TU-URL-DE-RAILWAY.up.railway.app/api
   ```
   *(Nota: si dejas `http://localhost:3000/api`, intentará conectarse localmente)*.

2. **Inicia el entorno de desarrollo:**
   Abre una terminal en este proyecto y ejecuta:
   ```bash
   npm run dev
   ```

3. **Verifica la conexión:**
   Ingresa a `http://localhost:5173`. Si configuraste correctamente la URL y el backend está encendido, verás inmediatamente una pequeña notificación verde de éxito en la esquina de la pantalla. Si hay un error, será de color rojo.
