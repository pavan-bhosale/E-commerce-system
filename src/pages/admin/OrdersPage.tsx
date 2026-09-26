import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Order, OrderStatus, PaymentStatus, DeliveryStatus } from '../../types';
import {
  formatCurrency,
  formatDate,
  getOrderStatusBadge,
  getPaymentBadge,
  getDeliveryBadge
} from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { OrderDetailsModal } from '../../components/admin/OrderDetailsModal';
import {
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpDown,
  Truck,
  MessageSquare,
  Edit,
  Eye,
  CheckCircle,
  X
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { orders, showToast } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>(() => searchParams.get('status') || 'All');
  const [selectedPayment, setSelectedPayment] = useState<string>(() => searchParams.get('payment') || 'All');
  const [selectedDelivery, setSelectedDelivery] = useState<string>('All');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(() => searchParams.get('id') || null);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'quantity'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Status Filter options
  const statusTabs: (OrderStatus | 'All')[] = [
    'All',
    'New',
    'Confirmed',
    'Production',
    'Finishing',
    'Packing',
    'Ready',
    'Dispatched',
    'Cancelled'
  ];

  // Filtered & Sorted orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Text Search
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          order.orderNumber.toLowerCase().includes(q) ||
          order.customerName.toLowerCase().includes(q) ||
          order.customerCity.toLowerCase().includes(q) ||
          order.items.some((i) => i.modelNumber.toLowerCase().includes(q));

        // Status Filter
        const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;

        // Payment Filter
        const matchesPayment = selectedPayment === 'All' || order.paymentStatus === selectedPayment;

        // Delivery Filter
        const matchesDelivery = selectedDelivery === 'All' || order.deliveryStatus === selectedDelivery;

        return matchesQuery && matchesStatus && matchesPayment && matchesDelivery;
      })
      .sort((a, b) => {
        if (sortBy === 'amount') {
          return sortAsc ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
        }
        if (sortBy === 'quantity') {
          return sortAsc ? a.totalQuantity - b.totalQuantity : b.totalQuantity - a.totalQuantity;
        }
        return sortAsc
          ? new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
          : new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      });
  }, [orders, searchQuery, selectedStatus, selectedPayment, selectedDelivery, sortBy, sortAsc]);

  const handleExportCsv = () => {
    const headers = 'Order Number,Customer Name,Date,Models,Quantity,Dispatched,Pending,Total Amount,Status,Payment Status\n';
    const rows = filteredOrders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.customerName}","${o.orderDate}",${o.totalModels},${o.totalQuantity},${o.dispatchedQuantity},${o.pendingQuantity},${o.totalAmount},"${o.status}","${o.paymentStatus}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vidhi-jewel-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Export Complete', 'success', 'Exported orders dataset as CSV');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedPayment('All');
    setSelectedDelivery('All');
  };

  const hasActiveFilters =
    searchQuery || selectedStatus !== 'All' || selectedPayment !== 'All' || selectedDelivery !== 'All';

  return (
    <div className="space-y-5">
      {/* Top Title & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Orders Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track customer wholesale orders, manage manufacturing stages, and record partial consignments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCsv}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/customer/catalogue')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Order
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-soft p-4 bg-white border border-slate-200 shadow-2xs space-y-3">
        {/* Search input and Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by order#, party, model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Fully Paid</option>
              <option value="Advance Received">Advance Received</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Advance Pending">Advance Pending</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div>
            <select
              value={selectedDelivery}
              onChange={(e) => setSelectedDelivery(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="All">All Delivery Statuses</option>
              <option value="Pending">Pending Production</option>
              <option value="In Production">In Production</option>
              <option value="Ready for Dispatch">Ready for Dispatch</option>
              <option value="Partially Dispatched">Partially Dispatched</option>
              <option value="Dispatched">Dispatched / Delivered</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden font-medium text-slate-700"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="quantity">Sort by Quantity</option>
            </select>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded hover:bg-rose-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {statusTabs.map((status) => {
            const count =
              status === 'All'
                ? orders.length
                : orders.filter((o) => o.status === status).length;

            const isSelected = selectedStatus === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0b1e36] text-white shadow-2xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>{status}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table / Mobile Cards */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No Orders Match Your Filters"
          description="Try clearing search query, changing status tabs, or creating a new purchase order."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="card-soft overflow-hidden bg-white border border-slate-200 shadow-2xs">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Order Reference</th>
                  <th className="py-3 px-3">Party Name</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-center">Models</th>
                  <th className="py-3 px-3 text-center">Quantity (Pcs)</th>
                  <th className="py-3 px-3 text-right">Total Amount</th>
                  <th className="py-3 px-3 text-center">Stage</th>
                  <th className="py-3 px-3 text-center">Payment</th>
                  <th className="py-3 px-3 text-center">Dispatch Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const statusB = getOrderStatusBadge(order.status);
                  const payB = getPaymentBadge(order.paymentStatus);
                  const deliveryB = getDeliveryBadge(order.deliveryStatus);

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          #{order.orderNumber}
                        </div>
                        {order.priority === 'Urgent' && (
                          <span className="text-[10px] text-rose-600 font-semibold">Express</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800 line-clamp-1 max-w-[150px]">
                          {order.customerName}
                        </div>
                        <div className="text-[10px] text-slate-400">{order.customerCity}</div>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-500">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-600">
                        {order.totalModels}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono">
                        <span className="font-bold text-slate-900">{order.totalQuantity}</span>
                        {order.dispatchedQuantity > 0 && (
                          <div className="text-[10px] text-emerald-600">
                            {order.dispatchedQuantity} disp • {order.pendingQuantity} pend
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusB.bg}`}>
                          {statusB.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${payB.bg}`}>
                          {payB.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${deliveryB.bg}`}>
                          {deliveryB.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrderId(order.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0b1e36] hover:text-white text-slate-700 text-xs font-semibold transition-all inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
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
            {filteredOrders.map((order) => {
              const statusB = getOrderStatusBadge(order.status);
              const payB = getPaymentBadge(order.paymentStatus);

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900">
                        #{order.orderNumber}
                      </span>
                      {order.priority === 'Urgent' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                          Urgent
                        </span>
                      )}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusB.bg}`}>
                      {statusB.label}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{order.customerName}</h4>
                    <div className="text-xs text-slate-500">
                      Booked on {formatDate(order.orderDate)} • Target: {formatDate(order.requiredDate)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl text-xs border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Pieces</span>
                      <span className="font-mono font-bold text-slate-800">
                        {order.totalQuantity} pcs ({order.totalModels} models)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase">Order Amount</span>
                      <span className="font-mono font-bold text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${payB.bg}`}>
                      {payB.label}
                    </span>
                    <span className="text-blue-600 font-semibold text-xs flex items-center gap-1">
                      Manage Order →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Footer */}
          <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Showing {filteredOrders.length} of {orders.length} wholesale orders
            </span>
            <span>Click any order to inspect details, dispatch units, or update status</span>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        orderId={selectedOrderId}
      />
    </div>
  );
};
