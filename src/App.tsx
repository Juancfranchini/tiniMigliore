import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ShopLayout from './components/layouts/ShopLayout';
import LandingLayout from './components/layouts/LandingLayout';
import AdminLayout from './components/layouts/AdminLayout';
import DashboardPage from './features/admin/pages/DashboardPage';
import AdminOrdersPage from './features/admin/pages/AdminOrdersPage';
import AdminProductsPage from './features/admin/pages/AdminProductsPage';
import AdminSectionsPage from './features/admin/pages/AdminSectionsPage';
import AdminLandingPage from './features/admin/pages/AdminLandingPage';
import AdminSettingsPage from './features/admin/pages/AdminSettingsPage';
import AdminExpensesPage from './features/admin/pages/AdminExpensesPage';
import LoginPage from './features/admin/pages/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ToastContainer } from './components/ui/Toast/ToastContainer';
import { useToastStore } from './store/toastStore';
import { apiClient } from './services/api/client';
import { useSettingsStore } from './features/admin/store/settingsStore';

// Public Pages
import LandingPage from './features/shop/pages/LandingPage';
import HomePage from './features/shop/pages/HomePage';
import CheckoutPage from './features/shop/pages/CheckoutPage';

function App() {
  const addToast = useToastStore((state) => state.addToast);
  const loadSettings = useSettingsStore((state) => state.loadSettings);

  useEffect(() => {
    loadSettings().catch(() => {
      console.error('No se pudieron cargar configuraciones iniciales.');
    });
    apiClient.healthCheck()
      .then((isOk) => {
        if (isOk) {
          addToast({ type: 'success', message: '🚀 Backend conectado correctamente', duration: 4000 });
        }
      })
      .catch(() => {
        addToast({ type: 'error', message: '⚠️ Error: No se pudo conectar al Backend', duration: 6000 });
      });
  }, [addToast]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing principal con identidad */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
        </Route>

        {/* Catálogo de productos */}
        <Route path="/catalogo" element={<ShopLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* Checkout */}
        <Route path="/checkout" element={<ShopLayout />}>
          <Route index element={<CheckoutPage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="landing" element={<AdminLandingPage />} />
            <Route path="sections" element={<AdminSectionsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="expenses" element={<AdminExpensesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
