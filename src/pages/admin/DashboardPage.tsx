import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { OrderDetailsModal } from '../../components/admin/OrderDetailsModal';
import {
  formatCurrency,
  formatDate,
  getOrderStatusBadge,
  getPaymentBadge,
  getDeliveryBadge
} from '../../utils/formatters';
import { OrderStatus } from '../../types';
import {
  ShoppingBag,
  Factory,
  Truck,
  CreditCard,
  Clock,
  ArrowRight,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { orders } = useApp();
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Dynamic calculations from current orders state
  const newOrders = orders.filter((o) => o.status === 'New');
  const inProductionOrders = orders.filter(
    (o) => o.status === 'Production' || o.status === 'Finishing' || o.status === 'Packing'
  );
  const readyOrders = orders.filter((o) => o.status === 'Ready');
  const partialOrders = orders.filter((o) => o.deliveryStatus === 'Partially Dispatched');
  const pendingPaymentOrders = orders.filter(
    (o) => o.paymentStatus === 'Advance Pending' || o.paymentStatus === 'Pending'
  );

  const totalActivePipelineValue = orders
    .filter((o) => o.status !== 'Dispatched' && o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalPiecesInFactory = inProductionOrders.reduce((sum, o) => sum + o.pendingQuantity, 0);

  // Pipeline stages
  const pipelineStages: { stage: OrderStatus; label: string; count: number }[] = [
    { stage: 'New', label: 'New Orders', count: newOrders.length },
    { stage: 'Confirmed', label: 'Confirmed', count: orders.filter((o) => o.status === 'Confirmed').length },
    { stage: 'Production', label: 'Casting & Stone', count: orders.filter((o) => o.status === 'Production').length },
    { stage: 'Finishing', label: 'Finishing & Buff', count: orders.filter((o) => o.status === 'Finishing').length },
    { stage: 'Packing', label: 'QC & Packaging', count: orders.filter((o) => o.status === 'Packing').length },
    { stage: 'Ready', label: 'Ready to Dispatch', count: readyOrders.length },
    { stage: 'Dispatched', label: 'Dispatched', count: orders.filter((o) => o.status === 'Dispatched').length }
  ];

  // Urgent attention orders
  const attentionOrders = orders
    .filter((o) => o.priority === 'Urgent' || o.paymentStatus === 'Advance Pending')
    .slice(0, 3);

  // Mini calendar state for coming up deliveries
  const [calendarMonth] = useState('October 2026');

  return (
    <div className="space-y-6">
      {/* Top Greeting & Operational Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Good morning, Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's what's happening with your wholesale fine jewellery orders & manufacturing today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/admin/orders')}
            leftIcon={<ShoppingBag className="w-3.5 h-3.5 text-blue-600" />}
          >
            All Orders
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/customer/catalogue')}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-400" />}
          >
            Create Order
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid (Matches Reference Image Card Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Main Hero Card (Deep Navy Blue inspired by PayConnect in screenshot) */}
        <div className="md:col-span-2">
          <StatCard
            isHero={true}
            title="Total Active Pipeline Value"
            value={formatCurrency(totalActivePipelineValue, true)}
            badge="Festive Season Active"
            change="+32%"
            subtext={`${orders.filter((o) => o.status !== 'Dispatched').length} Active orders in production`}
            icon={<TrendingUp className="w-5 h-5 text-amber-400" />}
            onClick={() => navigate('/admin/orders')}
          />
        </div>

        {/* Secondary KPI Cards */}
        <StatCard
          title="New Orders"
          value={newOrders.length}
          change="+18%"
          changeType="positive"
          subtext="Awaiting review"
          sparklineColor="blue"
          icon={<ShoppingBag className="w-4 h-4 text-blue-600" />}
          onClick={() => navigate('/admin/orders?status=New')}
        />

        <StatCard
          title="In Production"
          value={`${inProductionOrders.length} orders`}
          change={`${totalPiecesInFactory} pcs`}
          changeType="positive"
          subtext="On factory floor"
          sparklineColor="amber"
          icon={<Factory className="w-4 h-4 text-amber-600" />}
          onClick={() => navigate('/admin/production')}
        />

        <StatCard
          title="Ready to Dispatch"
          value={readyOrders.length}
          change="Final QC Passed"
          changeType="positive"
          subtext="Vault locked"
          sparklineColor="green"
          icon={<Truck className="w-4 h-4 text-emerald-600" />}
          onClick={() => navigate('/admin/dispatch')}
        />

        <StatCard
          title="Partial Dispatches"
          value={partialOrders.length}
          change="Balance Pending"
          changeType="neutral"
          subtext="Consignments in transit"
          sparklineColor="blue"
          icon={<Clock className="w-4 h-4 text-indigo-600" />}
          onClick={() => navigate('/admin/dispatch?filter=partial')}
        />

        <StatCard
          title="Pending Payments"
          value={pendingPaymentOrders.length}
          change="Advance Due"
          changeType="negative"
          subtext="Action before casting"
          sparklineColor="rose"
          icon={<CreditCard className="w-4 h-4 text-rose-600" />}
          onClick={() => navigate('/admin/orders?payment=Advance+Pending')}
        />

        <StatCard
          title="Total Catalogue Models"
          value="20 Models"
          change="100% Hallmarked"
          changeType="positive"
          subtext="18K & 22K Collections"
          sparklineColor="green"
          icon={<Sparkles className="w-4 h-4 text-amber-600" />}
          onClick={() => navigate('/admin/catalogue')}
        />
      </div>

      {/* Visual Order Pipeline Stepper / Stages Bar */}
      <div className="card-soft p-4 sm:p-5 bg-white border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Order Pipeline & Factory Workflow
            </h3>
            <p className="text-xs text-slate-500">
              Live orders progressing through hallmarking, casting, finishing, and dispatch
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/production')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Kanban Board</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pipeline Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {pipelineStages.map((st, i) => (
            <div
              key={st.stage}
              onClick={() => navigate(`/admin/orders?status=${st.stage}`)}
              className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600">
                  Step {i + 1}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {st.count}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 mt-2 truncate">
                {st.stage}
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout (Matches PayConnect Structure) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-soft overflow-hidden bg-white border border-slate-200 shadow-2xs">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing latest purchase bookings from verified retailers
                </p>
              </div>
              <Button
                variant="secondary"
                size="xs"
                onClick={() => navigate('/admin/orders')}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                View All ({orders.length})
              </Button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-3">Party Name</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-center">Pcs</th>
                    <th className="py-3 px-3 text-right">Total (₹)</th>
                    <th className="py-3 px-3 text-center">Stage</th>
                    <th className="py-3 px-3 text-center">Payment</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 6).map((order) => {
                    const statusB = getOrderStatusBadge(order.status);
                    const payB = getPaymentBadge(order.paymentStatus);

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            #{order.orderNumber}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-800 line-clamp-1 max-w-[130px]">
                            {order.customerName}
                          </div>
                          <div className="text-[10px] text-slate-400">{order.customerCity}</div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                          {formatDate(order.orderDate)}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-700">
                          {order.totalQuantity}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(order.totalAmount, true)}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusB.bg}`}>
                            {statusB.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${payB.bg}`}>
                            {payB.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <span>Manage</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
              {orders.slice(0, 6).map((order) => {
                const statusB = getOrderStatusBadge(order.status);
                const payB = getPaymentBadge(order.paymentStatus);

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        #{order.orderNumber}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusB.bg}`}>
                          {statusB.label}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${payB.bg}`}>
                          {payB.label}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {order.customerCity} • Booked {formatDate(order.orderDate)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                      <span className="font-mono text-slate-600 text-[11px]">
                        {order.totalModels} Models • {order.totalQuantity} pcs
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {formatCurrency(order.totalAmount, true)}
                        </span>
                        <span className="text-blue-600 text-xs font-semibold flex items-center">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Rail: Orders Requiring Attention & Coming Up Calendar (Matches PayConnect) */}
        <div className="space-y-6">
          {/* Orders Requiring Attention */}
          <div className="card-soft p-4 sm:p-5 bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Needs Attention
                </h3>
              </div>
              <Badge variant="warning" size="xs">
                {attentionOrders.length} Urgent
              </Badge>
            </div>

            <div className="divide-y divide-slate-100">
              {attentionOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className="py-3 first:pt-0 last:pb-0 cursor-pointer hover:bg-slate-50/60 rounded-xl px-2 -mx-2 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-900">#{ord.orderNumber}</span>
                    <span className="text-rose-600 font-semibold text-[11px]">
                      {ord.priority === 'Urgent' ? 'Express Deadline' : 'Advance Pending'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 font-medium mt-0.5 truncate">
                    {ord.customerName}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Due: {formatDate(ord.requiredDate)}</span>
                    <span className="font-mono">{ord.totalQuantity} pcs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Up / Delivery Deadlines (Inspired by Calendar in Reference Screenshot) */}
          <div className="card-soft p-4 sm:p-5 bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Delivery Deadlines
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">{calendarMonth}</span>
            </div>

            {/* Mini Calendar Visual */}
            <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
              <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-slate-400 mb-2">
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
                <span>Su</span>
              </div>
              <div className="grid grid-cols-7 text-center text-xs gap-y-1.5 font-medium text-slate-700">
                <span className="text-slate-300">28</span>
                <span className="text-slate-300">29</span>
                <span className="text-slate-300">30</span>
                <span>1</span>
                <span>2</span>
                <span className="w-6 h-6 mx-auto rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center">
                  3
                </span>
                <span>4</span>

                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span className="w-6 h-6 mx-auto rounded-full bg-rose-500 text-white font-bold flex items-center justify-center shadow-xs">
                  8
                </span>
                <span>9</span>
                <span>10</span>
                <span>11</span>

                <span className="w-6 h-6 mx-auto rounded-full bg-[#0b1e36] text-white font-bold flex items-center justify-center">
                  12
                </span>
                <span>13</span>
                <span>14</span>
                <span className="w-6 h-6 mx-auto rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center">
                  15
                </span>
                <span>16</span>
                <span>17</span>
                <span>18</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                <span>Oct 8: Mehta & Sons festival order (130 pcs)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0b1e36] flex-shrink-0" />
                <span>Oct 12: ABC Jewellers Diwali consignment (450 pcs)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <span>Oct 15: Tribhovandas balance dispatch (100 pcs)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Order Details Modal */}
      <OrderDetailsModal
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        orderId={selectedOrderId}
      />
    </div>
  );
};
