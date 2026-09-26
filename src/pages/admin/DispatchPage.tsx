import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useSearchParams } from 'react-router-dom';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { PartialDispatchModal } from '../../components/admin/PartialDispatchModal';
import { OrderDetailsModal } from '../../components/admin/OrderDetailsModal';
import { Order } from '../../types';
import { Truck, Search, ShieldCheck, Box, ExternalLink, Plus, CheckCircle2 } from 'lucide-react';

export const DispatchPage: React.FC = () => {
  const { orders } = useApp();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'All' | 'Ready' | 'Partial' | 'Delivered'>(() => {
    const f = searchParams.get('filter');
    if (f === 'partial') return 'Partial';
    return 'All';
  });

  const [activeDispatchOrder, setActiveDispatchOrder] = useState<Order | null>(null);
  const [activeDetailOrderId, setActiveDetailOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.dispatchLogs.some((l) => l.trackingNumber.toLowerCase().includes(q));

    if (filterTab === 'Ready') {
      return matchesSearch && (order.status === 'Ready' || order.deliveryStatus === 'Ready for Dispatch');
    }
    if (filterTab === 'Partial') {
      return matchesSearch && order.deliveryStatus === 'Partially Dispatched';
    }
    if (filterTab === 'Delivered') {
      return matchesSearch && (order.status === 'Dispatched' || order.deliveryStatus === 'Dispatched');
    }
    return matchesSearch;
  });

  // Calculate metrics
  const readyOrdersCount = orders.filter((o) => o.status === 'Ready').length;
  const partialOrdersCount = orders.filter((o) => o.deliveryStatus === 'Partially Dispatched').length;
  const dispatchedOrdersCount = orders.filter((o) => o.status === 'Dispatched').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Dispatch & Logistics Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage high-value armoured air freight, track partial consignments, and monitor courier waybills
          </p>
        </div>

        {/* High-Value Courier Partners Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs">
            BVC Logistics Secure
          </span>
          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs">
            Sequel Valuables
          </span>
          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs">
            BlueDart Apex Gold
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="card-soft p-4 bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'All', label: 'All Orders', count: orders.length },
            { id: 'Ready', label: 'Ready for Dispatch', count: readyOrdersCount },
            { id: 'Partial', label: 'Partially Dispatched', count: partialOrdersCount },
            { id: 'Delivered', label: 'Fully Dispatched', count: dispatchedOrdersCount }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                filterTab === tab.id
                  ? 'bg-[#0b1e36] text-white shadow-2xs font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-white/20">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search docket, tracking#, party..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Main Table */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No Dispatch Records Found"
          description="There are currently no orders matching your selected logistics status filter."
        />
      ) : (
        <div className="card-soft overflow-hidden bg-white border border-slate-200 shadow-2xs">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Order / Consignment</th>
                  <th className="py-3 px-3">Party Name</th>
                  <th className="py-3 px-3 text-center">Ordered</th>
                  <th className="py-3 px-3 text-center">Dispatched</th>
                  <th className="py-3 px-3 text-center">Pending</th>
                  <th className="py-3 px-3">Courier & Tracking</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Logistics Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const latestDispatch = order.dispatchLogs[0];
                  const hasDispatched = order.dispatchedQuantity > 0;
                  const isComplete = order.pendingQuantity === 0;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => setActiveDetailOrderId(order.id)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          #{order.orderNumber}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Due: {formatDate(order.requiredDate)}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800">{order.customerName}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {order.customerCity}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800">
                        {order.totalQuantity} pcs
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-600">
                        {order.dispatchedQuantity} pcs
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-bold text-amber-600">
                        {order.pendingQuantity} pcs
                      </td>

                      <td className="py-3.5 px-3">
                        {latestDispatch ? (
                          <div>
                            <span className="font-semibold text-slate-800">
                              {latestDispatch.courierName}
                            </span>
                            <div className="font-mono text-[10px] text-blue-600">
                              #{latestDispatch.trackingNumber}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No consignment yet</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {isComplete ? (
                          <Badge variant="success" size="xs">
                            Fully Dispatched
                          </Badge>
                        ) : hasDispatched ? (
                          <Badge variant="warning" size="xs">
                            Partially Dispatched
                          </Badge>
                        ) : order.status === 'Ready' ? (
                          <Badge variant="primary" size="xs">
                            Ready in Vault
                          </Badge>
                        ) : (
                          <Badge variant="default" size="xs">
                            In Factory
                          </Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {order.pendingQuantity > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDispatchOrder(order);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-semibold transition-colors inline-flex items-center gap-1 shadow-2xs"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Dispatch</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDetailOrderId(order.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards View */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredOrders.map((order) => {
              const latestDispatch = order.dispatchLogs[0];
              const hasDispatched = order.dispatchedQuantity > 0;
              const isComplete = order.pendingQuantity === 0;

              return (
                <div
                  key={order.id}
                  onClick={() => setActiveDetailOrderId(order.id)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-slate-900">
                      #{order.orderNumber}
                    </span>
                    {isComplete ? (
                      <Badge variant="success" size="xs">
                        Fully Dispatched
                      </Badge>
                    ) : hasDispatched ? (
                      <Badge variant="warning" size="xs">
                        Partially Dispatched
                      </Badge>
                    ) : order.status === 'Ready' ? (
                      <Badge variant="primary" size="xs">
                        Ready in Vault
                      </Badge>
                    ) : (
                      <Badge variant="default" size="xs">
                        In Factory
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{order.customerName}</h4>
                    <div className="text-xs text-slate-500">
                      {order.customerCity} • Required: {formatDate(order.requiredDate)}
                    </div>
                  </div>

                  {/* Quantities Status Grid */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl text-center text-xs border border-slate-100 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-sans">Ordered</span>
                      <span className="font-bold text-slate-800">{order.totalQuantity} pcs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-700 uppercase block font-sans">Dispatched</span>
                      <span className="font-bold text-emerald-700">{order.dispatchedQuantity} pcs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 uppercase block font-sans">Pending</span>
                      <span className="font-bold text-amber-700">{order.pendingQuantity} pcs</span>
                    </div>
                  </div>

                  {latestDispatch && (
                    <div className="text-xs p-2 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                      <span className="font-medium text-slate-700">{latestDispatch.courierName}</span>
                      <span className="font-mono text-blue-700 font-semibold">#{latestDispatch.trackingNumber}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {order.pendingQuantity > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDispatchOrder(order);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#0b1e36] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Record Dispatch</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDetailOrderId(order.id);
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      Order Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Partial Dispatch Modal */}
      <PartialDispatchModal
        isOpen={!!activeDispatchOrder}
        onClose={() => setActiveDispatchOrder(null)}
        order={activeDispatchOrder}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={!!activeDetailOrderId}
        onClose={() => setActiveDetailOrderId(null)}
        orderId={activeDetailOrderId}
      />
    </div>
  );
};
