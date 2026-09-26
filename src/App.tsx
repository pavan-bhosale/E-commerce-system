import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Layouts
import { AdminLayout } from './components/admin/AdminLayout';
import { CustomerLayout } from './components/customer/CustomerLayout';

// Pages
import { DemoLoginPage } from './pages/DemoLoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { OrdersPage } from './pages/admin/OrdersPage';
import { CataloguePage } from './pages/admin/CataloguePage';
import { CustomersPage } from './pages/admin/CustomersPage';
import { ProductionPage } from './pages/admin/ProductionPage';
import { DispatchPage } from './pages/admin/DispatchPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

// Customer Pages
import { CustomerCataloguePage } from './pages/customer/CataloguePage';
import { CustomerCheckoutPage } from './pages/customer/CheckoutPage';
import { CustomerMyOrdersPage } from './pages/customer/MyOrdersPage';
import { CustomerProfilePage } from './pages/customer/ProfilePage';

const RootRedirect: React.FC = () => {
  const { userRole } = useApp();
  return <Navigate to={userRole === 'admin' ? '/admin' : '/customer/catalogue'} replace />;
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Demo Login / Role Selector */}
          <Route path="/login-demo" element={<DemoLoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="catalogue" element={<CataloguePage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="production" element={<ProductionPage />} />
            <Route path="dispatch" element={<DispatchPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<Navigate to="catalogue" replace />} />
            <Route path="catalogue" element={<CustomerCataloguePage />} />
            <Route path="checkout" element={<CustomerCheckoutPage />} />
            <Route path="orders" element={<CustomerMyOrdersPage />} />
            <Route path="profile" element={<CustomerProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
