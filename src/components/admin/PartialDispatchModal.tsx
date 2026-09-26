import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Order } from '../../types';
import { useApp } from '../../context/AppContext';
import { Truck, AlertCircle, CheckCircle } from 'lucide-react';

interface PartialDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const PartialDispatchModal: React.FC<PartialDispatchModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const { recordPartialDispatch } = useApp();

  const [courierName, setCourierName] = useState('BVC Logistics Secure');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [dispatchDate, setDispatchDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [dispatchQtys, setDispatchQtys] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize quantities when order changes
  React.useEffect(() => {
    if (order) {
      const initial: Record<string, number> = {};
      order.items.forEach((item) => {
        // default dispatch qty to pending quantity if pending > 0
        initial[item.modelNumber] = item.pendingQuantity > 0 ? Math.min(item.pendingQuantity, 50) : 0;
      });
      setDispatchQtys(initial);
      setTrackingNumber(`BVC-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [order, isOpen]);

  if (!order) return null;

  const totalToDispatch = Object.values(dispatchQtys).reduce((sum, q) => sum + (q || 0), 0);
  const totalPendingInOrder = order.pendingQuantity;

  const handleQtyChange = (modelNumber: string, value: number, maxPending: number) => {
    const val = Math.max(0, Math.min(value || 0, maxPending));
    setDispatchQtys((prev) => ({ ...prev, [modelNumber]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalToDispatch <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const itemsToDispatch = Object.entries(dispatchQtys)
        .filter(([_, qty]) => qty > 0)
        .map(([modelNumber, qty]) => ({ modelNumber, qty }));

      recordPartialDispatch(
        order.id,
        itemsToDispatch,
        courierName,
        trackingNumber || 'HAND-DELIVERY',
        notes
      );

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      zIndex={60}
      title={
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" />
          <span>Record Partial Dispatch</span>
        </div>
      }
      subtitle={`Order #${order.orderNumber} • ${order.customerName}`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Info Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900">
          <div>
            Total Ordered: <span className="font-semibold">{order.totalQuantity} pcs</span>
          </div>
          <div>
            Already Dispatched: <span className="font-semibold text-emerald-700">{order.dispatchedQuantity} pcs</span>
          </div>
          <div>
            Currently Pending: <span className="font-semibold text-amber-700">{order.pendingQuantity} pcs</span>
          </div>
        </div>

        {/* Model items table for partial allocation */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Model-Wise Dispatch Quantities
          </label>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Model</th>
                  <th className="py-2.5 px-3 text-center">Ordered</th>
                  <th className="py-2.5 px-3 text-center">Dispatched</th>
                  <th className="py-2.5 px-3 text-center">Pending</th>
                  <th className="py-2.5 px-3 text-right">Dispatch Now</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <tr key={item.modelNumber} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{item.modelNumber}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{item.productName}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600 font-mono">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-mono font-medium">
                      {item.dispatchedQuantity}
                    </td>
                    <td className="py-2.5 px-3 text-center text-amber-600 font-mono font-semibold">
                      {item.pendingQuantity}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {item.pendingQuantity === 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Complete
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max={item.pendingQuantity}
                            value={dispatchQtys[item.modelNumber] ?? 0}
                            onChange={(e) =>
                              handleQtyChange(item.modelNumber, parseInt(e.target.value) || 0, item.pendingQuantity)
                            }
                            className="w-20 px-2 py-1 text-right text-xs font-mono font-semibold rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                          />
                          <span className="text-[11px] text-slate-400">pcs</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Courier & Tracking Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              High-Value Courier Partner
            </label>
            <select
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="BVC Logistics Secure">BVC Logistics Secure (Air Vault)</option>
              <option value="Sequel Logistics Valuables">Sequel Logistics (High Value)</option>
              <option value="BlueDart Apex Gold">BlueDart Apex Gold Secure</option>
              <option value="Direct Vault Handover">Direct Vault Handover / Party Representative</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Docket / Tracking Number
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. BVC-MUM-99120"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dispatch Date
            </label>
            <input
              type="date"
              value={dispatchDate}
              onChange={(e) => setDispatchDate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Seal & Vault Remarks
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Tamper-proof box #04 with security barcode"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Dispatch Summary Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Dispatching in this consignment:</span>
            <span className="font-mono text-sm font-bold text-blue-700">{totalToDispatch} pcs</span>
          </div>
          <div className="text-slate-500">
            Remaining pending after dispatch:{' '}
            <span className="font-semibold text-slate-700">
              {Math.max(0, totalPendingInOrder - totalToDispatch)} pcs
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="secondary" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isSubmitting}
            disabled={totalToDispatch <= 0}
            leftIcon={<Truck className="w-4 h-4 text-blue-300" />}
          >
            Confirm & Log Dispatch ({totalToDispatch} pcs)
          </Button>
        </div>
      </form>
    </Modal>
  );
};
