import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { NotificationPanel } from '../common/NotificationPanel';
import { ToastContainer } from '../common/Toast';
import { AddProductModal } from './AddProductModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { CustomerDetailsModal } from './CustomerDetailsModal';

export const AdminLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenAddProduct={() => setAddProductOpen(true)}
          onOpenCreateOrder={() => navigate('/customer/catalogue')}
        />

        <main className="flex-1 px-3 py-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal
        onSelectOrder={(id) => setActiveOrderId(id)}
        onSelectCustomer={(id) => setActiveCustomerId(id)}
      />

      <NotificationPanel onSelectOrder={(id) => setActiveOrderId(id)} />

      <AddProductModal
        isOpen={addProductOpen}
        onClose={() => setAddProductOpen(false)}
      />

      <OrderDetailsModal
        isOpen={!!activeOrderId}
        onClose={() => setActiveOrderId(null)}
        orderId={activeOrderId}
      />

      <CustomerDetailsModal
        isOpen={!!activeCustomerId}
        onClose={() => setActiveCustomerId(null)}
        customerId={activeCustomerId}
        onSelectOrder={(id) => setActiveOrderId(id)}
      />

      <ToastContainer />
    </div>
  );
};
