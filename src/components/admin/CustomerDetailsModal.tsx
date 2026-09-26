import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Customer } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../../utils/formatters';
import { Building2, Phone, Mail, MapPin, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string | null;
  onSelectOrder?: (orderId: string) => void;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  customerId,
  onSelectOrder
}) => {
  const { customers, orders } = useApp();

  const customer = customers.find((c) => c.id === customerId) || null;

  if (!customer) return null;

  const customerOrders = orders.filter((o) => o.customerId === customer.id || o.customerName === customer.partyName);
  const totalVolumePieces = customerOrders.reduce((sum, o) => sum + o.totalQuantity, 0);
  const totalPendingPieces = customerOrders.reduce((sum, o) => sum + o.pendingQuantity, 0);
  const totalOrderValue = customerOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>{customer.partyName}</span>
          {customer.rating && (
            <Badge variant="gold" size="xs">
              Tier {customer.rating}
            </Badge>
          )}
        </div>
      }
      subtitle={`City: ${customer.city} • GSTIN: ${customer.gstNumber}`}
      maxWidth="3xl"
    >
      <div className="space-y-5">
        {/* KPI Mini Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Orders</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{customerOrders.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
            <span className="text-[11px] font-semibold text-blue-800 uppercase">Total Pieces</span>
            <div className="text-xl font-bold text-blue-900 mt-0.5">{totalVolumePieces} pcs</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
            <span className="text-[11px] font-semibold text-amber-800 uppercase">Pending Delivery</span>
            <div className="text-xl font-bold text-amber-900 mt-0.5">{totalPendingPieces} pcs</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase">Lifetime Value</span>
            <div className="text-xl font-bold text-emerald-900 mt-0.5">
              {formatCurrency(totalOrderValue, true)}
            </div>
          </div>
        </div>

        {/* Contact & Credit Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
              Contact & Verification
            </h4>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-semibold text-slate-900">Key Person:</span> {customer.contactPerson}
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{customer.mobile}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-700 pt-1 border-t border-slate-100">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">{customer.deliveryAddress}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
              Credit & Outstanding Profile
            </h4>
            <div className="flex justify-between text-slate-700">
              <span>Credit Limit Approved:</span>
              <span className="font-mono font-bold text-slate-900">
                {formatCurrency(customer.creditLimit)}
              </span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Current Outstanding:</span>
              <span className="font-mono font-bold text-rose-700">
                {formatCurrency(customer.outstanding)}
              </span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Available Credit:</span>
              <span className="font-mono font-semibold text-emerald-700">
                {formatCurrency(Math.max(0, customer.creditLimit - customer.outstanding))}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-500 mt-2">
              Payment Terms: 30% advance on order confirmation, balance against insured delivery.
            </div>
          </div>
        </div>

        {/* Order History */}
        <div>
          <h4 className="font-bold uppercase tracking-wider text-slate-500 text-xs mb-2">
            Recent Orders from {customer.partyName} ({customerOrders.length})
          </h4>
          {customerOrders.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
              No orders found for this party
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white shadow-2xs">
              {customerOrders.map((ord) => {
                const b = getOrderStatusBadge(ord.status);
                return (
                  <div
                    key={ord.id}
                    onClick={() => {
                      if (onSelectOrder) {
                        onClose();
                        onSelectOrder(ord.id);
                      }
                    }}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 group-hover:text-blue-600">
                          #{ord.orderNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${b.bg}`}>
                          {b.label}
                        </span>
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {formatDate(ord.orderDate)} • {ord.totalQuantity} pcs ({ord.pendingQuantity} pending)
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900">
                        {formatCurrency(ord.totalAmount)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
