import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { CustomerDetailsModal } from '../../components/admin/CustomerDetailsModal';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Building2,
  Eye,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { customers, orders, addCustomer } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.partyName.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.gstNumber.toLowerCase().includes(q) ||
      c.contactPerson.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            B2B Parties & Customers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified retail jewelers, wholesale distributors, and multi-store showroom accounts
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => {
            const rand = Math.floor(100 + Math.random() * 900);
            addCustomer({
              partyName: `Ratnakar Jewellers #${rand}`,
              contactPerson: 'Suresh Varma',
              mobile: '+91 98920 11492',
              email: `orders@ratnakar${rand}.com`,
              gstNumber: `24AAACR${rand}F1Z8`,
              city: 'Vadodara',
              billingAddress: 'Alkapuri Main Arcade, Vadodara 390007',
              deliveryAddress: 'Alkapuri Main Arcade, Vadodara 390007',
              totalOrders: 1,
              pendingOrders: 1,
              outstanding: 150000,
              creditLimit: 1200000,
              rating: 'A'
            });
          }}
        >
          Register New Party
        </Button>
      </div>

      {/* Search Bar */}
      <div className="card-soft p-4 bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search party by name, city, GSTIN, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {filteredCustomers.length} registered jewellery retailers
        </span>
      </div>

      {/* Customer Table */}
      {filteredCustomers.length === 0 ? (
        <EmptyState
          title="No Customers Found"
          description="No parties match your search keywords. Try adjusting terms."
        />
      ) : (
        <div className="card-soft overflow-hidden bg-white border border-slate-200 shadow-2xs">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Party / Retailer</th>
                  <th className="py-3 px-3">City & Contact</th>
                  <th className="py-3 px-3">GSTIN</th>
                  <th className="py-3 px-3 text-center">Total Orders</th>
                  <th className="py-3 px-3 text-center">Active / Pending</th>
                  <th className="py-3 px-3 text-right">Credit Approved</th>
                  <th className="py-3 px-3 text-right">Outstanding</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => {
                  const custOrders = orders.filter((o) => o.customerId === cust.id || o.customerName === cust.partyName);
                  const pendingCount = custOrders.filter((o) => o.status !== 'Dispatched' && o.status !== 'Cancelled').length;

                  return (
                    <tr
                      key={cust.id}
                      onClick={() => setSelectedCustomerId(cust.id)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-blue-100">
                            {cust.partyName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                              <span>{cust.partyName}</span>
                              {cust.rating && (
                                <Badge variant="gold" size="xs">
                                  {cust.rating}
                                </Badge>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">{cust.contactPerson}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800">{cust.city}</div>
                        <div className="text-[11px] text-slate-400">{cust.mobile}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-600">{cust.gstNumber}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800">
                        {cust.totalOrders}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {pendingCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {pendingCount} active
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">All clear</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-700">
                        {formatCurrency(cust.creditLimit, true)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold">
                        <span className={cust.outstanding > 0 ? 'text-rose-700' : 'text-emerald-700'}>
                          {formatCurrency(cust.outstanding, true)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-slate-100 group-hover:bg-[#0b1e36] group-hover:text-white text-slate-700 text-xs font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards View */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredCustomers.map((cust) => {
              const custOrders = orders.filter((o) => o.customerId === cust.id || o.customerName === cust.partyName);
              const pendingCount = custOrders.filter((o) => o.status !== 'Dispatched' && o.status !== 'Cancelled').length;

              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-blue-100">
                        {cust.partyName.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5 truncate">
                          <span className="truncate">{cust.partyName}</span>
                          {cust.rating && (
                            <Badge variant="gold" size="xs">
                              {cust.rating}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          {cust.contactPerson} • {cust.city}
                        </div>
                      </div>
                    </div>

                    {pendingCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex-shrink-0">
                        {pendingCount} active
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 flex-shrink-0">All clear</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl text-xs border border-slate-100 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-sans">Credit Limit</span>
                      <span className="font-semibold text-slate-700">{formatCurrency(cust.creditLimit, true)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-sans">Outstanding</span>
                      <span className={`font-bold ${cust.outstanding > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {formatCurrency(cust.outstanding, true)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="font-mono text-[11px]">GST: {cust.gstNumber}</span>
                    <span className="text-blue-600 font-semibold inline-flex items-center gap-1">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        isOpen={!!selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        customerId={selectedCustomerId}
      />
    </div>
  );
};
