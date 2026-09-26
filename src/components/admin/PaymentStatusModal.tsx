import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Order, PaymentStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { CreditCard, CheckCircle2 } from 'lucide-react';

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const { updatePaymentStatus } = useApp();

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Advance Pending');
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [reference, setReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setPaymentStatus(order.paymentStatus);
      setAdvanceAmount(order.advancePaid);
      setReference(`UTR-${Math.floor(10000000 + Math.random() * 90000000)}`);
    }
  }, [order, isOpen]);

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      updatePaymentStatus(order.id, paymentStatus, advanceAmount);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const calculatedBalance = Math.max(0, order.totalAmount - (advanceAmount || 0));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      zIndex={60}
      title={
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <span>Payment & Advance Management</span>
        </div>
      }
      subtitle={`Order #${order.orderNumber} • ${order.customerName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Total Order Value
            </span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {formatCurrency(order.totalAmount)}
            </div>
            <span className="text-[10px] text-slate-400">Incl. 3% Jewellery GST</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider">
              Amount Received
            </span>
            <div className="text-base font-bold text-emerald-700 mt-0.5">
              {formatCurrency(advanceAmount || 0)}
            </div>
            <span className="text-[10px] text-emerald-600">RTGS / Bank Transfer</span>
          </div>
        </div>

        {/* Balance status banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
          <span className="text-amber-900 font-medium">Outstanding Balance:</span>
          <span className="font-mono text-sm font-bold text-amber-900">
            {formatCurrency(calculatedBalance)}
          </span>
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Payment Status Stage
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => {
              const newStat = e.target.value as PaymentStatus;
              setPaymentStatus(newStat);
              if (newStat === 'Paid') {
                setAdvanceAmount(order.totalAmount);
              }
            }}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="Advance Pending">Advance Pending (0% Received)</option>
            <option value="Advance Received">Advance Received (Partial Booking)</option>
            <option value="Partially Paid">Partially Paid (Interim Stage)</option>
            <option value="Paid">Fully Paid (100% Settled)</option>
            <option value="Pending">Payment Pending</option>
          </select>
        </div>

        {/* Amount input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Total Amount Received to Date (₹)
          </label>
          <input
            type="number"
            min="0"
            max={order.totalAmount}
            value={advanceAmount}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              setAdvanceAmount(val);
              if (val >= order.totalAmount) {
                setPaymentStatus('Paid');
              } else if (val > 0) {
                setPaymentStatus('Advance Received');
              }
            }}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex gap-2 mt-1.5">
            <button
              type="button"
              onClick={() => {
                const adv = Math.round(order.totalAmount * 0.3);
                setAdvanceAmount(adv);
                setPaymentStatus('Advance Received');
              }}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              Set 30% Advance
            </button>
            <button
              type="button"
              onClick={() => {
                const adv = Math.round(order.totalAmount * 0.5);
                setAdvanceAmount(adv);
                setPaymentStatus('Advance Received');
              }}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              Set 50% Advance
            </button>
            <button
              type="button"
              onClick={() => {
                setAdvanceAmount(order.totalAmount);
                setPaymentStatus('Paid');
              }}
              className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
            >
              Mark 100% Paid
            </button>
          </div>
        </div>

        {/* Payment Reference */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Bank Transaction / UTR Reference
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. UTR-HDFC-991823"
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="secondary" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
            Save Payment Record
          </Button>
        </div>
      </form>
    </Modal>
  );
};
