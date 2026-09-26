import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Gem,
  Users,
  Factory,
  Truck,
  BarChart3,
  Settings,
  HelpCircle,
  RefreshCw,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileOpen = false,
  onMobileClose
}) => {
  const { orders, resetDemoData } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Dispatched' && o.status !== 'Cancelled'
  ).length;

  const navItems = [
    { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Orders', to: '/admin/orders', icon: ShoppingBag, badge: activeOrdersCount },
    { label: 'Catalogue', to: '/admin/catalogue', icon: Gem },
    { label: 'Customers', to: '/admin/customers', icon: Users },
    { label: 'Production', to: '/admin/production', icon: Factory },
    { label: 'Dispatch', to: '/admin/dispatch', icon: Truck },
    { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', to: '/admin/settings', icon: Settings }
  ];

  // Prevent body scrolling when mobile drawer is open
  React.useEffect(() => {
    if (mobileOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [mobileOpen]);

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-white border-r border-slate-200 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0b1e36] text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Gem className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-slate-900 font-sans leading-none">
                VIDHI JEWEL
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 mt-1">
                B2B Order Portal
              </div>
            </div>
          </div>
          {mobileOpen && (
            <button
              type="button"
              onClick={onMobileClose}
              className="lg:hidden w-11 h-11 flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Admin Profile Mini Card */}
        <div className="p-3 mb-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-900 font-bold text-xs">
            RM
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">Rajesh Mehta</div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Super Admin • Surat Factory</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Operations
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#0b1e36] text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.to === '/admin/orders'
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom Demo Card */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900">
          <div className="font-bold flex items-center justify-between">
            <span>Prototype Environment</span>
            <span className="text-[9px] bg-amber-200/60 px-1.5 py-0.5 rounded text-amber-900 font-mono">
              v1.0-RC
            </span>
          </div>
          <p className="mt-1 text-slate-600 text-[10px] leading-relaxed">
            Data simulated in memory & local storage. All interactions are live.
          </p>
          <button
            type="button"
            onClick={resetDemoData}
            className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white rounded-lg border border-amber-300 text-amber-900 font-semibold hover:bg-amber-100/50 transition-colors shadow-2xs text-[10px]"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-60 h-screen sticky top-0 flex-shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
