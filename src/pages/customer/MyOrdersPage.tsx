import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useSearchParams } from 'react-router-dom';
import {
  formatCurrency,
  formatDate,
  getOrderStatusBadge,
  getPaymentBadge,
  getDeliveryBadge
} from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { Order, OrderStatus } from '../../types';
import {
  ClipboardList,
  Search,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  X
} from 'lucide-react';

export const CustomerMyOrdersPage: React.FC = () => {
  const { orders, currentCustomer } = useApp();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(() => {
    return searchParams.get('id') || (orders[0]?.id ?? null);
  });

  // Filter orders for customer view
  const customerOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.items.some((i) => i.modelNumber.toLowerCase().includes(q));

    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stages: OrderStatus[] = [
    'New',
    'Confirmed',
    'Production',
    'Finishing',
    'Packing',
    'Ready',
    'Dispatched'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            My Orders & Manufacturing Lifecycle
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time stage tracking, partial consignment logs, and model-wise fulfillment reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 font-semibold">
            Party: {currentCustomer.partyName}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-soft p-4 bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by order number #VJ-2026-..., model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {['All', 'Production', 'Ready', 'Dispatched'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-[#0b1e36] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st === 'All' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Order Cards List with Inline Expandable Tracking */}
      {customerOrders.length === 0 ? (
        <EmptyState
          title="No Orders Found"
          description="You do not have any purchase orders matching the current filter."
        />
      ) : (
        <div className="space-y-4">
          {customerOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const statusB = getOrderStatusBadge(order.status);
            const payB = getPaymentBadge(order.paymentStatus);
            const currentStageIndex = stages.indexOf(order.status);

            return (
              <div
                key={order.id}
                className="card-soft bg-white border border-slate-200 shadow-2xs overflow-hidden transition-all"
              >
                {/* Order Summary Header Row */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5 sm:mt-0">
                      <ClipboardList className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm sm:text-base font-bold text-slate-900">
                          #{order.orderNumber}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusB.bg}`}>
                          {statusB.label}
                        </span>
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                        Booked: {formatDate(order.orderDate)} • Target Delivery: {formatDate(order.requiredDate)}
                      </div>
                      <div className="sm:hidden mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Total Purchase:</span>
                        <span className="font-mono font-bold text-slate-900">{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                    <div className="hidden sm:block text-right">
                      <div className="text-xs text-slate-400">Total Purchase</div>
                      <div className="font-mono text-sm sm:text-base font-bold text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </div>
                    </div>

                    <div className="hidden sm:block text-right">
                      <div className="text-xs text-slate-400">Fulfillment</div>
                      <div className="font-mono text-xs font-bold text-slate-800">
                        {order.dispatchedQuantity} / {order.totalQuantity} pcs
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/30 space-y-6">
                    {/* Visual Order Timeline */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Live Production & Delivery Timeline
                        </span>
                        <span className="text-xs font-medium text-blue-700">
                          Current Stage: <span className="font-bold">{order.status}</span>
                        </span>
                      </div>

                      {/* Desktop Horizontal Stepper */}
                      <div className="hidden sm:grid grid-cols-7 gap-1 text-center">
                        {stages.map((st, idx) => {
                          const isDone = currentStageIndex > idx;
                          const isCurrent = currentStageIndex === idx;

                          let circleClass = 'bg-slate-100 text-slate-400 border-slate-200';
                          if (isCurrent) {
                            circleClass = 'bg-[#0b1e36] text-white border-[#0b1e36] shadow-xs';
                          } else if (isDone) {
                            circleClass = 'bg-emerald-500 text-white border-emerald-500';
                          }

                          return (
                            <div key={st} className="flex flex-col items-center gap-1.5 relative">
                              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${circleClass}`}>
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span className={`text-[11px] ${isCurrent ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                                {st}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Mobile Vertical Stepper */}
                      <div className="sm:hidden space-y-2 border-l-2 border-slate-200 pl-4 ml-2">
                        {stages.map((st, idx) => {
                          const isDone = currentStageIndex > idx;
                          const isCurrent = currentStageIndex === idx;

                          return (
                            <div key={st} className="flex items-center gap-2 text-xs">
                              <span
                                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                  isCurrent
                                    ? 'bg-[#0b1e36] text-white'
                                    : isDone
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {isDone ? '✓' : idx + 1}
                              </span>
                              <span className={isCurrent ? 'font-bold text-slate-900' : 'text-slate-600'}>
                                {st} {isCurrent && '(In Progress)'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Model-Wise Items Fulfillment Table */}
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                      <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 uppercase tracking-wider">
                          Model-Wise Fulfillment Breakdown
                        </span>
                        <span className="text-slate-500">
                          {order.totalModels} Models • {order.totalQuantity} Pcs Total
                        </span>
                      </div>

                      {/* Desktop Table View */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50/50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                            <tr>
                              <th className="py-2.5 px-4">Model & Jewellery</th>
                              <th className="py-2.5 px-3">Size</th>
                              <th className="py-2.5 px-3 text-right">Rate</th>
                              <th className="py-2.5 px-3 text-center">Ordered</th>
                              <th className="py-2.5 px-3 text-center">Dispatched</th>
                              <th className="py-2.5 px-3 text-center">Pending</th>
                              <th className="py-2.5 px-4 text-right">Total Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {order.items.map((item) => (
                              <tr key={item.modelNumber} className="hover:bg-slate-50/60">
                                <td className="py-2.5 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={item.image}
                                      alt={item.productName}
                                      className="w-9 h-9 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                                    />
                                    <div>
                                      <div className="font-mono font-bold text-slate-900">
                                        {item.modelNumber}
                                      </div>
                                      <div className="text-[11px] text-slate-500">
                                        {item.productName}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-slate-600">{item.size}</td>
                                <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800">
                                  {formatCurrency(item.price)}
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                                  {item.quantity}
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">
                                  {item.dispatchedQuantity}
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-600">
                                  {item.pendingQuantity}
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                                  {formatCurrency(item.price * item.quantity)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Line Items Stack */}
                      <div className="md:hidden divide-y divide-slate-100">
                        {order.items.map((item) => (
                          <div key={item.modelNumber} className="p-3 space-y-2">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="font-mono font-bold text-slate-900 text-xs">
                                  {item.modelNumber}
                                </div>
                                <div className="text-[11px] text-slate-500 truncate">
                                  {item.productName} • Size {item.size}
                                </div>
                              </div>
                              <div className="text-right font-mono font-bold text-xs text-slate-900">
                                {formatCurrency(item.price * item.quantity)}
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 rounded-lg text-center text-[10px]">
                              <div>
                                <span className="text-slate-400 block font-sans">Ordered</span>
                                <span className="font-mono font-bold text-slate-800">{item.quantity} pcs</span>
                              </div>
                              <div>
                                <span className="text-emerald-700 block font-sans">Dispatched</span>
                                <span className="font-mono font-bold text-emerald-700">{item.dispatchedQuantity} pcs</span>
                              </div>
                              <div>
                                <span className="text-amber-700 block font-sans">Pending</span>
                                <span className="font-mono font-bold text-amber-700">{item.pendingQuantity} pcs</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dispatch History If Any */}
                    {order.dispatchLogs.length > 0 && (
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-blue-600" />
                          <span>Insured Courier Consignments</span>
                        </span>
                        <div className="space-y-1.5">
                          {order.dispatchLogs.map((log) => (
                            <div
                              key={log.id}
                              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-semibold text-slate-900">{log.courierName}</span>
                                <span className="text-slate-500 text-[11px] ml-2 font-mono">
                                  Docket #{log.trackingNumber}
                                </span>
                              </div>
                              <span className="text-emerald-700 font-bold font-mono">
                                {log.dispatchedQty} pcs dispatched
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
