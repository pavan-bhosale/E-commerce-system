import React from 'react';
import { useApp } from '../../context/AppContext';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { Search, Bell, Menu, Plus, Gem } from 'lucide-react';
import { Button } from '../common/Button';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenAddProduct?: () => void;
  onOpenCreateOrder?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileSidebar,
  onOpenAddProduct,
  onOpenCreateOrder
}) => {
  const { setGlobalSearchOpen, setNotificationPanelOpen, unreadNotificationCount } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Primary Top Bar */}
      <div className="px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Left Area: Dedicated Mobile Hamburger Button & Brand */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 min-w-0">
          {/* Dedicated Hamburger with guaranteed 44x44px touch area */}
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 hover:text-slate-950 hover:bg-slate-50 active:bg-slate-100 shadow-2xs transition-colors cursor-pointer"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5 text-slate-800" />
          </button>

          {/* Mobile Brand Identity */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#0b1e36] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold tracking-tight text-slate-900 block font-sans leading-tight">
                VIDHI JEWEL
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-amber-700 block leading-none">
                Admin Console
              </span>
            </div>
          </div>

          {/* Desktop Global Search Bar */}
          <button
            type="button"
            onClick={() => setGlobalSearchOpen(true)}
            className="hidden lg:flex items-center justify-between w-72 xl:w-96 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-slate-300 text-slate-400 hover:text-slate-600 transition-all text-xs cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">Search orders, models, parties...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-slate-200 bg-white font-mono text-[10px] text-slate-500 shadow-2xs">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Area: Search (Mobile), Desktop RoleSwitcher, Notifications, Profile, Desktop Actions */}
        <div className="flex items-center gap-1 sm:gap-2.5 flex-shrink-0">
          {/* Mobile Search Icon Button */}
          <button
            type="button"
            onClick={() => setGlobalSearchOpen(true)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
            title="Search"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Desktop Role Switcher */}
          <div className="hidden lg:block">
            <RoleSwitcher />
          </div>

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={() => setNotificationPanelOpen(true)}
            className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] px-1 rounded-full bg-rose-500 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center border-2 border-white pointer-events-none shadow-2xs">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* User Profile Thumbnail */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 border border-blue-200 text-blue-900 font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
            RM
          </div>

          {/* Desktop-Only Quick Actions (Never render on mobile) */}
          {onOpenAddProduct && (
            <div className="hidden xl:block">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Gem className="w-3.5 h-3.5 text-amber-600" />}
                onClick={onOpenAddProduct}
              >
                Add Model
              </Button>
            </div>
          )}

          {onOpenCreateOrder && (
            <div className="hidden md:block">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={onOpenCreateOrder}
              >
                New Order
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sub-Toolbar: Clean, Full-Width Role Switcher without touching or overlapping hamburger */}
      <div className="lg:hidden px-3 py-2 bg-slate-50/90 border-t border-slate-100 flex items-center justify-center">
        <RoleSwitcher fullWidthOnMobile={true} />
      </div>
    </header>
  );
};
