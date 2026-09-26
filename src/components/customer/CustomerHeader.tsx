import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { Gem, ShoppingBag, Search } from 'lucide-react';

interface CustomerHeaderProps {
  onOpenCart: () => void;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({ onOpenCart }) => {
  const { cartTotalCount, setGlobalSearchOpen, currentCustomer } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <NavLink to="/customer/catalogue" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#0b1e36] text-white flex items-center justify-center shadow-xs">
              <Gem className="w-5 h-5 text-amber-400" />
            </div>
            <div className="truncate">
              <div className="text-sm font-extrabold tracking-tight text-slate-900 font-sans leading-none">
                VIDHI JEWEL
              </div>
              <div className="text-[10px] font-semibold text-amber-700 tracking-wider mt-0.5 truncate">
                B2B Buyer Portal
              </div>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <NavLink
              to="/customer/catalogue"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl transition-colors ${
                  isActive ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              Product Catalogue
            </NavLink>
            <NavLink
              to="/customer/orders"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl transition-colors ${
                  isActive ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              My Orders & Tracking
            </NavLink>
            <NavLink
              to="/customer/profile"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl transition-colors ${
                  isActive ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              Party Profile
            </NavLink>
          </nav>
        </div>

        {/* Right Area: Search, Desktop RoleSwitcher, Cart Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={() => setGlobalSearchOpen(true)}
            className="w-10 h-10 sm:w-auto sm:h-auto sm:p-2 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Search products"
            aria-label="Search products"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Desktop Role Switcher */}
          <div className="hidden md:block">
            <RoleSwitcher />
          </div>

          {/* Cart Trigger Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0b1e36] text-white hover:bg-[#162f50] active:bg-[#071322] transition-all shadow-xs cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center shadow-2xs">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-semibold">
              {cartTotalCount > 0 ? `${cartTotalCount} pcs` : 'Cart'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Toolbar: Full-width Role Switcher */}
      <div className="md:hidden px-3 py-2 bg-slate-50/90 border-t border-slate-100 flex items-center justify-center">
        <RoleSwitcher fullWidthOnMobile={true} />
      </div>
    </header>
  );
};
