import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Order, OrderStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  formatCurrency,
  formatDate,
  getOrderStatusBadge,
  getPaymentBadge,
  getDeliveryBadge
} from '../../utils/formatters';
import { WhatsAppModal } from '../common/WhatsAppModal';
import { PartialDispatchModal } from './PartialDispatchModal';
import { PaymentStatusModal } from './PaymentStatusModal';
import { EditOrderModal } from './EditOrderModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Printer,
  Edit,
  Truck,
  MessageSquare,
  CreditCard,
  Clock,
  MapPin,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  orderId
}) => {
  const { orders, updateOrderStatus, showToast } = useApp();

  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Status transition state
  const [statusConfirmTarget, setStatusConfirmTarget] = useState<OrderStatus | null>(null);

  const order = orders.find((o) => o.id === orderId) || null;

  if (!order) return null;

  const statusBadge = getOrderStatusBadge(order.status);
  const paymentBadge = getPaymentBadge(order.paymentStatus);
  const deliveryBadge = getDeliveryBadge(order.deliveryStatus);

  const stages: OrderStatus[] = [
    'New',
    'Confirmed',
    'Production',
    'Finishing',
    'Packing',
    'Ready',
    'Dispatched'
  ];

  const currentStageIndex = stages.indexOf(order.status);

  const handlePrint = () => {
    window.print();
    showToast('Print Triggered', 'info', 'Generating B2B Packing & Invoice Sheet');
  };

  const handleConfirmStatusChange = () => {
    if (statusConfirmTarget) {
      updateOrderStatus(order.id, statusConfirmTarget);
      setStatusConfirmTarget(null);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="4xl"
        title={
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-lg font-bold text-slate-900">
              #{order.orderNumber}
            </span>
            <Badge variant="primary" dot={true}>
              {statusBadge.label}
            </Badge>
            {order.priority === 'Urgent' && (
              <Badge variant="danger" dot={true}>
                Urgent Priority
              </Badge>
            )}
          </div>
        }
        subtitle={
          <span>
            Booked on {formatDate(order.orderDate)} • Target Delivery: {formatDate(order.requiredDate)}
          </span>
        }
      >
        <div className="space-y-6">
          {/* Top Operational Action Bar */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Truck className="w-4 h-4 text-blue-300" />}
                onClick={() => setDispatchModalOpen(true)}
                className="w-full justify-center min-h-[44px]"
              >
                Dispatch Qty ({order.pendingQuantity} pending)
              </Button>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<CreditCard className="w-4 h-4 text-emerald-600" />}
                onClick={() => setPaymentModalOpen(true)}
                className="w-full justify-center min-h-[44px]"
              >
                Payment: {paymentBadge.label}
              </Button>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<MessageSquare className="w-4 h-4 text-emerald-600" />}
                onClick={() => setWhatsappModalOpen(true)}
                className="w-full justify-center min-h-[44px]"
              >
                WhatsApp Update
              </Button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200/60">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Edit className="w-3.5 h-3.5 text-slate-600" />}
                onClick={() => setEditModalOpen(true)}
                className="text-xs"
              >
                Edit Order
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Printer className="w-3.5 h-3.5 text-slate-600" />}
                onClick={handlePrint}
                className="text-xs"
              >
                Print Sheet
              </Button>
            </div>
          </div>

          {/* Lifecycle Stepper / Interactive Timeline */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Production & Order Lifecycle Stage
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Click any stage to update order workflow
              </span>
            </div>

            {/* Stepper buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
              {stages.map((stage, idx) => {
                const isPassed = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;

                let btnClass = 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100';
                if (isCurrent) {
                  btnClass = 'bg-[#0b1e36] text-white border-[#0b1e36] shadow-xs font-semibold';
                } else if (isPassed) {
                  btnClass = 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 font-medium';
                }

                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => {
                      if (stage !== order.status) {
                        setStatusConfirmTarget(stage);
                      }
                    }}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs border transition-all text-left ${btnClass}`}
                  >
                    <div className="truncate">
                      <div className="text-[10px] opacity-75">Stage {idx + 1}</div>
                      <div className="truncate">{stage}</div>
                    </div>
                    {isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0 ml-1" />
                    ) : isPassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 ml-1" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer & Financial Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Details */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>B2B Customer</span>
              </div>
              <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
              <div className="text-xs text-slate-600 font-mono">GST: {order.customerGst}</div>
              <div className="text-xs text-slate-600">Mobile: {order.customerMobile}</div>
              <div className="text-xs text-slate-500 pt-1 border-t border-slate-100 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{order.deliveryAddress}</span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Payment Summary
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${paymentBadge.bg}`}>
                  {paymentBadge.label}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal ({order.totalQuantity} pcs):</span>
                <span className="font-mono font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Jewellery GST (3%):</span>
                <span className="font-mono">{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-100">
                <span>Total Amount:</span>
                <span className="font-mono text-blue-900">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700 font-medium">
                <span>Advance Paid:</span>
                <span className="font-mono">{formatCurrency(order.advancePaid)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-amber-900 pt-1 border-t border-slate-100">
                <span>Balance Due:</span>
                <span className="font-mono">{formatCurrency(order.balanceAmount)}</span>
              </div>
            </div>

            {/* Production & Dispatch Overview */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Dispatch & Delivery
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${deliveryBadge.bg}`}>
                  {deliveryBadge.label}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Total Quantity:</span>
                <span className="font-mono font-semibold text-slate-900">{order.totalQuantity} pcs</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700">
                <span>Dispatched:</span>
                <span className="font-mono font-semibold">{order.dispatchedQuantity} pcs</span>
              </div>
              <div className="flex justify-between text-xs text-amber-700 font-bold">
                <span>Pending Balance:</span>
                <span className="font-mono">{order.pendingQuantity} pcs</span>
              </div>
              {order.notes && (
                <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100 text-[11px] text-amber-900 leading-snug mt-1">
                  <span className="font-semibold">Note:</span> {order.notes}
                </div>
              )}
            </div>
          </div>

          {/* Model-Wise Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="p-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Model-Wise Line Items ({order.items.length} Models • {order.totalQuantity} Pcs)
              </span>
              <span className="text-xs text-slate-500">All prices exclusive of 3% GST</span>
            </div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/40 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-4">Model & Product</th>
                    <th className="py-2.5 px-3">Specs / Size</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-center">Ordered</th>
                    <th className="py-2.5 px-3 text-center">Dispatched</th>
                    <th className="py-2.5 px-3 text-center">Pending</th>
                    <th className="py-2.5 px-4 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <tr key={item.modelNumber} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{item.modelNumber}</div>
                            <div className="text-[11px] text-slate-500">{item.productName}</div>
                            {item.notes && (
                              <div className="text-[10px] text-amber-700 italic">"{item.notes}"</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        <div>{item.category}</div>
                        <div className="text-[11px] text-slate-400">{item.size}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-medium text-slate-800">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">
                        {item.dispatchedQuantity}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-amber-600">
                        {item.pendingQuantity}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.modelNumber} className="p-3.5 space-y-2.5">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0 shadow-2xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {item.modelNumber}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 line-clamp-1">{item.productName}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.category} • {item.size} • {formatCurrency(item.price)} / pc
                      </div>
                    </div>
                  </div>

                  {/* Quantities Status Grid */}
                  <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-xl text-center text-xs border border-slate-100 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-sans">Ordered</span>
                      <span className="font-bold text-slate-900">{item.quantity} pcs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-700 uppercase block font-sans">Dispatched</span>
                      <span className="font-bold text-emerald-700">{item.dispatchedQuantity} pcs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 uppercase block font-sans">Pending</span>
                      <span className="font-bold text-amber-700">{item.pendingQuantity} pcs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partial Dispatch History Log */}
          {order.dispatchLogs.length > 0 && (
            <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Consignment Dispatch History ({order.dispatchLogs.length} Dispatches)</span>
                </h4>
              </div>
              <div className="space-y-2">
                {order.dispatchLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">
                        {log.courierName} • Docket #{log.trackingNumber}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {log.date} • Dispatched {log.dispatchedQty} pcs
                      </div>
                      {log.notes && <div className="text-[11px] text-slate-600 mt-1">{log.notes}</div>}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {log.items.map((i) => (
                        <span
                          key={i.modelNumber}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-[11px] text-slate-700"
                        >
                          {i.modelNumber}: <span className="font-bold">{i.qty}</span> pcs
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Timeline */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Order Activity & Production Audit Trail</span>
            </h4>
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="relative flex items-start gap-3.5 pl-1 text-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-100 border-2 border-white text-blue-700 flex items-center justify-center flex-shrink-0 text-[10px] font-bold z-10 shadow-2xs">
                    ✓
                  </span>
                  <div className="flex-1 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{event.title}</span>
                      <span className="text-[10px] text-slate-400">{event.timestamp}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{event.description}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">By: {event.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Sub-modals for this order */}
      <WhatsAppModal
        isOpen={whatsappModalOpen}
        onClose={() => setWhatsappModalOpen(false)}
        order={order}
      />

      <PartialDispatchModal
        isOpen={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        order={order}
      />

      <PaymentStatusModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        order={order}
      />

      <EditOrderModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        order={order}
      />

      <ConfirmDialog
        isOpen={!!statusConfirmTarget}
        onClose={() => setStatusConfirmTarget(null)}
        onConfirm={handleConfirmStatusChange}
        title={`Move Order to ${statusConfirmTarget}?`}
        message={`Are you sure you want to update order #${order.orderNumber} stage from "${order.status}" to "${statusConfirmTarget}"? This will log an event in the audit timeline and update dispatch queues.`}
        confirmLabel={`Move to ${statusConfirmTarget}`}
      />
    </>
  );
};
