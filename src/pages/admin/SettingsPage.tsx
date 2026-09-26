import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/common/Button';
import { Building2, User, Bell, Sliders, RefreshCw, Save, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { resetDemoData, showToast } = useApp();

  const [companyName, setCompanyName] = useState('VIDHI JEWEL PRIVATE LIMITED');
  const [gstin, setGstin] = useState('24AABCV9912E1ZQ');
  const [factoryAddress, setFactoryAddress] = useState('Plot 42-45, Gem & Jewellery SEZ, Sachin, Surat 394230, Gujarat');
  const [corporateOffice, setCorporateOffice] = useState('Jewellery Chamber, Zaveri Bazaar, Mumbai 400002');
  const [leadTimeDays, setLeadTimeDays] = useState(15);
  const [defaultMoq, setDefaultMoq] = useState(10);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'success', 'System configurations updated successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
          System & Enterprise Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure company profile, manufacturing parameters, logistics API sandboxes, and notifications
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Business Profile */}
        <div className="card-soft p-5 bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Company Identity & Regulatory
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Legal Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GSTIN / Tax Identification
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Manufacturing Unit / Factory Address (Surat SEZ)
            </label>
            <input
              type="text"
              value={factoryAddress}
              onChange={(e) => setFactoryAddress(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Wholesale Trading Chamber (Mumbai Zaveri Bazaar)
            </label>
            <input
              type="text"
              value={corporateOffice}
              onChange={(e) => setCorporateOffice(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>
        </div>

        {/* Manufacturing & Order Rules */}
        <div className="card-soft p-5 bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Production Lead Times & Defaults
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Standard Factory Lead Time (Days)
              </label>
              <input
                type="number"
                min="3"
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(parseInt(e.target.value) || 15)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Calculates minimum required delivery date in buyer checkout
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Wholesale MOQ per Model
              </label>
              <input
                type="number"
                min="1"
                value={defaultMoq}
                onChange={(e) => setDefaultMoq(parseInt(e.target.value) || 10)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Applies when no specific model MOQ is defined
              </span>
            </div>
          </div>
        </div>

        {/* Notifications & Simulation */}
        <div className="card-soft p-5 bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Simulated Communication Triggers
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800">
                  Automated WhatsApp Notification Trigger
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Simulate instant message preview to party on order confirmation & dispatch
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800">
                  Instant Dispatch Docket Barcode Generation
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Assign mock tracking number with BVC / Sequel / BlueDart
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Prototype Reset Card */}
        <div className="card-soft p-5 bg-amber-50/50 border border-amber-200/80 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-amber-700" />
            <span>Prototype State Reset</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Need to reset your demo back to pristine state? This will clear any newly added orders, modified dispatch logs, or added models from browser localStorage.
          </p>
          <button
            type="button"
            onClick={resetDemoData}
            className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors shadow-2xs"
          >
            Reset All Prototype Mock Data
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="md" type="submit" leftIcon={<Save className="w-4 h-4" />}>
            Save System Configurations
          </Button>
        </div>
      </form>
    </div>
  );
};
