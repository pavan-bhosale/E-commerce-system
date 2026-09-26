import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Gem, Shield, ShoppingBag, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export const DemoLoginPage: React.FC = () => {
  const { setUserRole } = useApp();
  const navigate = useNavigate();

  const handleSelectRole = (role: 'admin' | 'customer') => {
    setUserRole(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/customer/catalogue');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0b1e36] to-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-white">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Gem className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-serif text-white">
            VIDHI JEWEL
          </h1>
          <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            B2B Fine Jewellery Order & Production System
          </p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed pt-1">
            Enterprise wholesale procurement, partial dispatch tracking, and factory lifecycle management.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">
            Select Demo Experience to Continue
          </div>

          {/* Admin Role Card */}
          <div
            onClick={() => handleSelectRole('admin')}
            className="group p-5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 hover:border-blue-400/50 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-blue-500/10"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 flex-shrink-0 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    Admin SaaS Dashboard
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-300 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Full operational dashboard: orders management, partial dispatch, production pipeline, reports, WhatsApp notifications, and catalogue admin.
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-blue-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Inspired by modern card-based SaaS UI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Role Card */}
          <div
            onClick={() => handleSelectRole('customer')}
            className="group p-5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 hover:border-amber-400/50 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-amber-500/10"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    B2B Customer Portal
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Wholesale buyer experience: product catalogue with MOQs, filters, order builder, multi-model cart, purchase checkout, and stage-wise tracking.
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Optimized for desktop and mobile ordering</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="text-center text-[11px] text-slate-400 pt-2">
          <span>Prototype Mode • Toggle between views anytime using the top bar switch</span>
        </div>
      </div>
    </div>
  );
};
