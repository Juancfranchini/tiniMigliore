import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ShopLayout from './components/layouts/ShopLayout';
import AdminLayout from './components/layouts/AdminLayout';
import DashboardPage from './features/admin/pages/DashboardPage';
import AdminOrdersPage from './features/admin/pages/AdminOrdersPage';
import AdminProductsPage from './features/admin/pages/AdminProductsPage';
import AdminSectionsPage from './features/admin/pages/AdminSectionsPage';
import AdminLandingPage from './features/admin/pages/AdminLandingPage';
import AdminSettingsPage from './features/admin/pages/AdminSettingsPage';
import LoginPage from './features/admin/pages/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ToastContainer } from './components/ui/Toast/ToastContainer';

// Public Pages
import HomePage from './features/shop/pages/HomePage';
import CheckoutPage from './features/shop/pages/CheckoutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShopLayout />}>
          <Route index element={<HomePage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />
        
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="landing" element={<AdminLandingPage />} />
            <Route path="sections" element={<AdminSectionsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
