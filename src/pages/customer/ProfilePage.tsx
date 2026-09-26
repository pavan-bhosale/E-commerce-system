import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Building2, Phone, Mail, MapPin, CreditCard, Shield, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CustomerProfilePage: React.FC = () => {
  const { currentCustomer, setCurrentCustomer, customers, orders, setUserRole } = useApp();
  const navigate = useNavigate();

  const partyOrders = orders.filter(
    (o) => o.customerId === currentCustomer.id || o.customerName === currentCustomer.partyName
  );
  const totalVolume = partyOrders.reduce((sum, o) => sum + o.totalQuantity, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Party Profile & Credit Account
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified wholesale jewellery buyer credentials, dispatch destinations, and credit rating
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Party Switcher for demonstration */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
            <span className="text-[11px] text-slate-400 font-medium">Switch Party:</span>
            <select
              value={currentCustomer.id}
              onChange={(e) => {
                const found = customers.find((c) => c.id === e.target.value);
                if (found) setCurrentCustomer(found);
              }}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.partyName} ({c.city})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Party Card */}
      <div className="card-soft p-6 bg-white border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0b1e36] text-white flex items-center justify-center font-bold text-base shadow-xs">
              {currentCustomer.partyName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{currentCustomer.partyName}</h2>
                {currentCustomer.rating && (
                  <Badge variant="gold" size="xs">
                    Tier {currentCustomer.rating} Preferred
                  </Badge>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {currentCustomer.city} • Authorized Representative: {currentCustomer.contactPerson}
              </div>
            </div>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 self-start sm:self-auto">
            ✓ BIS Hallmarking Verification Passed
          </span>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Purchase Orders</span>
            <div className="text-xl font-extrabold text-slate-900 mt-1 font-mono">{partyOrders.length}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100">
            <span className="text-[10px] uppercase font-bold text-blue-800">Total Pieces Procured</span>
            <div className="text-xl font-extrabold text-blue-900 mt-1 font-mono">{totalVolume} pcs</div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-[10px] uppercase font-bold text-emerald-800">Approved Credit Limit</span>
            <div className="text-xl font-extrabold text-emerald-900 mt-1 font-mono">
              {formatCurrency(currentCustomer.creditLimit, true)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100">
            <span className="text-[10px] uppercase font-bold text-amber-800">Current Outstanding</span>
            <div className="text-xl font-extrabold text-amber-900 mt-1 font-mono">
              {formatCurrency(currentCustomer.outstanding, true)}
            </div>
          </div>
        </div>

        {/* Contact & Address Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
              Contact & GSTIN
            </span>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-semibold text-slate-900">GSTIN:</span>{' '}
              <span className="font-mono font-bold">{currentCustomer.gstNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentCustomer.mobile}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentCustomer.email}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
              Registered Locations
            </span>
            <div className="space-y-1">
              <span className="font-semibold text-slate-900 block">Billing Address:</span>
              <span className="text-slate-600 leading-relaxed block">{currentCustomer.billingAddress}</span>
            </div>
            <div className="pt-2 border-t border-slate-200/60 space-y-1">
              <span className="font-semibold text-slate-900 block">Vault Delivery Destination:</span>
              <span className="text-slate-600 leading-relaxed block">{currentCustomer.deliveryAddress}</span>
            </div>
          </div>
        </div>

        {/* Demo Switch Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Logged into VIDHI JEWEL B2B Partner Environment
          </span>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setUserRole('admin');
              navigate('/admin');
            }}
            leftIcon={<Shield className="w-3.5 h-3.5 text-blue-300" />}
          >
            Switch to Admin SaaS Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
