# Walkthrough: Google Maps for Shipping Orders

## Overview
We've improved the [AdminOrdersPage](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/admin/pages/AdminOrdersPage.tsx#9-236) (Gestión de Pedidos) module to drastically simplify logistics. The system now parses the global Settings to identify the origin (the store's address) and evaluates each order's delivery method to dynamically generate a one-click Google Maps route to the customer's location.

## Changes Made
### Backoffice UI ([AdminOrdersPage.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/features/admin/pages/AdminOrdersPage.tsx))
- **State Integration**: We injected `useSettingsStore` to fetch `settings.maps.sellerAddress` directly from the admin configuration state upon component mount.
- **Logistics Badges**: We introduced visual, color-coded inline badges in the `Cliente` column:
  - 🚚 **Envío a Domicilio**: Rendered dynamically if `order.deliveryMethod === 'delivery'` or if addressing data (`street`) is populated.
  - 🏪 **Retiro en Local**: Rendered otherwise, using the brand's purple accent scheme.
- **Dynamic Google Maps URL Generation**:
  - We actively construct a secure `HTTPS` GET uniform resource identifier: `https://www.google.com/maps/dir/?api=1&origin={encodedOrigin}&destination={encodedDestination}`.
  - The `destination` intelligently concatenates the buyer's street, number, neighborhood, and state/province to maximize precision.
  - **Failsafe System**: If the administrator has not configured a `sellerAddress` in the Settings tab, a clear warning replaces the link: `⚠️ Configurá la dirección del local en Ajustes para ver la ruta.`. This enforces proper platform setup without crashing.

## Future Recommendations (Distance Calculation)
Currently, this implementation opens Google Maps and delegates route calculation, distance, and time estimations to Google's Native UI. 
**If you wish to calculate distance automatically inside the Backoffice in the future:**
1. A backend service (Node.js/Next.js Edge) must be created to securely hit the `Google Maps Distance Matrix API`.
2. That service will consume the `Google Maps API Key` privately.
3. The frontend will hit the backend service with the Order details, and the backend will return raw kilometers and minutes to be printed natively within the React table.
