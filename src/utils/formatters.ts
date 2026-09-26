import { OrderStatus, PaymentStatus, DeliveryStatus } from '../types';

export function formatCurrency(amount: number, compact: boolean = false): string {
  if (compact && amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (compact && amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function getOrderStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'New':
      return { label: 'New', bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' };
    case 'Confirmed':
      return { label: 'Confirmed', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' };
    case 'Production':
      return { label: 'In Production', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    case 'Finishing':
      return { label: 'Finishing', bg: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' };
    case 'Packing':
      return { label: 'Packing', bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' };
    case 'Ready':
      return { label: 'Ready for Dispatch', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    case 'Dispatched':
      return { label: 'Dispatched', bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-500' };
    case 'Cancelled':
      return { label: 'Cancelled', bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
    default:
      return { label: status, bg: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
  }
}

export function getPaymentBadge(status: PaymentStatus) {
  switch (status) {
    case 'Paid':
      return { label: 'Fully Paid', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    case 'Advance Received':
      return { label: 'Advance Paid', bg: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' };
    case 'Partially Paid':
      return { label: 'Partially Paid', bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' };
    case 'Advance Pending':
      return { label: 'Advance Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    case 'Pending':
      return { label: 'Payment Pending', bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
    default:
      return { label: status, bg: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
  }
}

export function getDeliveryBadge(status: DeliveryStatus) {
  switch (status) {
    case 'Dispatched':
      return { label: 'Delivered / Dispatched', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'Partially Dispatched':
      return { label: 'Partially Dispatched', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'Ready for Dispatch':
      return { label: 'Ready to Dispatch', bg: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
    case 'In Production':
      return { label: 'In Production', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    case 'Pending':
    default:
      return { label: 'Pending Production', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
}
