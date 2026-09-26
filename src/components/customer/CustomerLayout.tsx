import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { CustomerHeader } from './CustomerHeader';
import { CartDrawer } from './CartDrawer';
import { ToastContainer } from '../common/Toast';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { Gem, ShoppingBag, ClipboardList, User, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const CustomerLayout: React.FC = () => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { cart, cartTotalCount, cartTotalAmount } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] pb-24 md:pb-8">
      {/* Header */}
      <CustomerHeader onOpenCart={() => setCartDrawerOpen(true)} />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 py-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Mobile Sticky Order Bar (Appears when cart has items) */}
      {cart.length > 0 && (
        <div className="fixed bottom-14 md:bottom-4 inset-x-4 max-w-md mx-auto z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="card-navy-hero p-3.5 shadow-xl flex items-center justify-between gap-3 border border-white/10">
            <div className="min-w-0">
              <div className="text-[11px] text-slate-300 font-medium truncate">
                {cart.length} Models • {cartTotalCount} Pieces
              </div>
              <div className="text-base font-extrabold text-white font-mono leading-tight">
                {formatCurrency(cartTotalAmount)}
              </div>
            </div>

            <Button
              variant="gold"
              size="sm"
              onClick={() => setCartDrawerOpen(true)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="font-bold flex-shrink-0"
            >
              View Cart
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden z-20 flex justify-around py-2">
        <NavLink
          to="/customer/catalogue"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-medium ${
              isActive ? 'text-blue-900 font-bold' : 'text-slate-500'
            }`
          }
        >
          <Gem className="w-5 h-5" />
          <span>Catalogue</span>
        </NavLink>

        <NavLink
          to="/customer/orders"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-medium ${
              isActive ? 'text-blue-900 font-bold' : 'text-slate-500'
            }`
          }
        >
          <ClipboardList className="w-5 h-5" />
          <span>My Orders</span>
        </NavLink>

        <button
          type="button"
          onClick={() => setCartDrawerOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-[10px] font-medium text-slate-500"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-amber-500 text-slate-900 text-[9px] font-extrabold flex items-center justify-center">
                {cartTotalCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <NavLink
          to="/customer/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-medium ${
              isActive ? 'text-blue-900 font-bold' : 'text-slate-500'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />

      {/* Global Modals */}
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
};
