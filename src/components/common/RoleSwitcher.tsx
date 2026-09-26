import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, ShoppingBag } from 'lucide-react';

interface RoleSwitcherProps {
  fullWidthOnMobile?: boolean;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ fullWidthOnMobile = false }) => {
  const { userRole, setUserRole } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectRole = (targetRole: 'admin' | 'customer') => {
    if (userRole === targetRole) return;
    setUserRole(targetRole);
    if (targetRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/customer/catalogue');
    }
  };

  return (
    <div
      className={`inline-flex items-center p-1 bg-slate-200/70 rounded-xl border border-slate-200 shadow-2xs ${
        fullWidthOnMobile ? 'w-full max-w-sm sm:max-w-none sm:w-auto justify-center' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => handleSelectRole('customer')}
        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
          userRole === 'customer'
            ? 'bg-white text-slate-900 shadow-xs font-bold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <ShoppingBag className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <span>Buyer Portal</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelectRole('admin')}
        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
          userRole === 'admin'
            ? 'bg-[#0b1e36] text-white shadow-xs font-bold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <Shield className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" />
        <span>Admin Console</span>
      </button>
    </div>
  );
};
