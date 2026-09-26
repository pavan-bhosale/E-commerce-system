import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { OrderDetailsModal } from '../../components/admin/OrderDetailsModal';
import { Badge } from '../../components/common/Badge';
import {
  Factory,
  ChevronRight,
  ChevronLeft,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ProductionPage: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Focus on manufacturing pipeline stages
  const kanbanStages: { stage: OrderStatus; title: string; subtitle: string; color: string }[] = [
    { stage: 'New', title: 'New Orders', subtitle: 'Awaiting BOM & Review', color: 'border-blue-400' },
    { stage: 'Confirmed', title: 'Confirmed', subtitle: 'Advance Paid / Queued', color: 'border-indigo-400' },
    { stage: 'Production', title: 'Casting & Stones', subtitle: 'Wax tree, cast & mount', color: 'border-amber-400' },
    { stage: 'Finishing', title: 'Finishing & Polish', subtitle: 'Enamel, rhodium & buff', color: 'border-orange-400' },
    { stage: 'Packing', title: 'QC & Packaging', subtitle: 'Hallmark & velvet box', color: 'border-purple-400' },
    { stage: 'Ready', title: 'Ready to Ship', subtitle: 'Vault ready for dispatch', color: 'border-emerald-400' }
  ];

  // Mobile active tab selector
  const [activeMobileStage, setActiveMobileStage] = useState<OrderStatus>('Production');

  const getNextStage = (current: OrderStatus): OrderStatus | null => {
    const list: OrderStatus[] = ['New', 'Confirmed', 'Production', 'Finishing', 'Packing', 'Ready', 'Dispatched'];
    const idx = list.indexOf(current);
    if (idx !== -1 && idx < list.length - 1) return list[idx + 1];
    return null;
  };

  const getPrevStage = (current: OrderStatus): OrderStatus | null => {
    const list: OrderStatus[] = ['New', 'Confirmed', 'Production', 'Finishing', 'Packing', 'Ready', 'Dispatched'];
    const idx = list.indexOf(current);
    if (idx > 0) return list[idx - 1];
    return null;
  };

  const handleMoveStage = (e: React.MouseEvent, order: Order, next: OrderStatus) => {
    e.stopPropagation();
    updateOrderStatus(order.id, next, `Moved to ${next} on factory Kanban board`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Production & Factory Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Stage-wise manufacturing tracking from 3D CAD wax pattern casting to final BIS hallmarking and vault storage
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Surat SEZ Factory Floor Live
          </span>
        </div>
      </div>

      {/* Mobile Stage Selector Tabs */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {kanbanStages.map((ks) => {
          const count = orders.filter((o) => o.status === ks.stage).length;
          const isSelected = activeMobileStage === ks.stage;

          return (
            <button
              key={ks.stage}
              type="button"
              onClick={() => setActiveMobileStage(ks.stage)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#0b1e36] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{ks.title}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop Multi-Column Kanban Board */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-start">
        {kanbanStages.map((column) => {
          const colOrders = orders.filter((o) => o.status === column.stage);
          const totalColPieces = colOrders.reduce((sum, o) => sum + o.pendingQuantity, 0);

          return (
            <div
              key={column.stage}
              className="bg-slate-100/70 border border-slate-200 rounded-2xl p-3 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="pb-2.5 mb-2.5 border-b border-slate-200/80">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {column.title}
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white text-slate-900 border border-slate-200 shadow-2xs">
                    {colOrders.length}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 flex justify-between">
                  <span>{column.subtitle}</span>
                  <span className="font-semibold text-slate-700">{totalColPieces} pcs</span>
                </div>
              </div>

              {/* Cards list */}
              <div className="space-y-2.5 flex-1">
                {colOrders.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-[11px] italic">
                    No orders in stage
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const nextSt = getNextStage(order.status);
                    const prevSt = getPrevStage(order.status);

                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrderId(order.id)}
                        className={`card-soft p-3 bg-white border-l-4 ${column.color} hover:shadow-md transition-all cursor-pointer group space-y-2`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            #{order.orderNumber}
                          </span>
                          {order.priority === 'Urgent' && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                              Urgent
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                            {order.customerName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Due: {formatDate(order.requiredDate)}
                          </div>
                        </div>

                        {/* Order Models Preview */}
                        <div className="text-[10px] bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-center justify-between text-slate-600">
                          <span>
                            {order.totalModels} models • <span className="font-bold text-slate-900">{order.totalQuantity} pcs</span>
                          </span>
                          <span className="font-mono font-bold text-blue-900">
                            {formatCurrency(order.totalAmount, true)}
                          </span>
                        </div>

                        {/* Workflow Transition Buttons */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                          {prevSt ? (
                            <button
                              type="button"
                              onClick={(e) => handleMoveStage(e, order, prevSt)}
                              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 flex items-center"
                              title={`Back to ${prevSt}`}
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span />
                          )}

                          {nextSt && (
                            <button
                              type="button"
                              onClick={(e) => handleMoveStage(e, order, nextSt)}
                              className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold transition-colors flex items-center gap-0.5"
                            >
                              <span>Move to {nextSt}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Stacked View (For active selected tab) */}
      <div className="md:hidden space-y-3">
        {orders
          .filter((o) => o.status === activeMobileStage)
          .map((order) => {
            const nextSt = getNextStage(order.status);
            const prevSt = getPrevStage(order.status);

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className="card-soft p-4 bg-white border border-slate-200 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-slate-900">
                    #{order.orderNumber}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {order.totalQuantity} pcs • {order.totalModels} models
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{order.customerName}</h4>
                  <div className="text-xs text-slate-500">Required: {formatDate(order.requiredDate)}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {prevSt && (
                    <button
                      type="button"
                      onClick={(e) => handleMoveStage(e, order, prevSt)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600"
                    >
                      ← {prevSt}
                    </button>
                  )}

                  {nextSt && (
                    <button
                      type="button"
                      onClick={(e) => handleMoveStage(e, order, nextSt)}
                      className="text-xs px-3 py-1 rounded-lg bg-[#0b1e36] text-white font-semibold flex items-center gap-1"
                    >
                      <span>Advance to {nextSt}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        orderId={selectedOrderId}
      />
    </div>
  );
};
