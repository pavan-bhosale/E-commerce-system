import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Order, OrderItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { Edit3 } from 'lucide-react';

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const { updateOrderDetails } = useApp();

  const [requiredDate, setRequiredDate] = useState('');
  const [priority, setPriority] = useState<'Urgent' | 'High' | 'Normal'>('Normal');
  const [notes, setNotes] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setRequiredDate(order.requiredDate);
      setPriority(order.priority);
      setNotes(order.notes || '');
      setDeliveryAddress(order.deliveryAddress);
      setItems(JSON.parse(JSON.stringify(order.items)));
    }
  }, [order, isOpen]);

  if (!order) return null;

  const handleItemQtyChange = (modelNumber: string, newQty: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.modelNumber === modelNumber) {
          const qty = Math.max(i.dispatchedQuantity, newQty);
          return {
            ...i,
            quantity: qty,
            pendingQuantity: Math.max(0, qty - i.dispatchedQuantity)
          };
        }
        return i;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newTotalQty = items.reduce((sum, i) => sum + i.quantity, 0);
    const newPendingQty = items.reduce((sum, i) => sum + i.pendingQuantity, 0);
    const newSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const newTax = Math.round(newSubtotal * 0.03);
    const newTotal = newSubtotal + newTax;
    const newBalance = Math.max(0, newTotal - order.advancePaid);

    setTimeout(() => {
      updateOrderDetails(order.id, {
        requiredDate,
        priority,
        notes,
        deliveryAddress,
        items,
        totalQuantity: newTotalQty,
        pendingQuantity: newPendingQty,
        subtotal: newSubtotal,
        taxAmount: newTax,
        totalAmount: newTotal,
        balanceAmount: newBalance
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-blue-600" />
          <span>Edit Order #{order.orderNumber}</span>
        </div>
      }
      subtitle={`Party: ${order.customerName}`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Delivery Date
            </label>
            <input
              type="date"
              value={requiredDate}
              onChange={(e) => setRequiredDate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Order Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent (Express Factory Slot)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Delivery / Transport Address
          </label>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Quantities editor */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Model Quantities & Line Items
          </label>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2 px-3">Model</th>
                  <th className="py-2 px-3 text-center">Dispatched</th>
                  <th className="py-2 px-3 text-right">Total Ordered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((i) => (
                  <tr key={i.modelNumber}>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {i.modelNumber} - {i.productName}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-slate-500">
                      {i.dispatchedQuantity} pcs (Locked)
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        min={i.dispatchedQuantity}
                        value={i.quantity}
                        onChange={(e) =>
                          handleItemQtyChange(i.modelNumber, parseInt(e.target.value) || 0)
                        }
                        className="w-20 px-2 py-1 text-right text-xs font-mono font-bold rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Manufacturing & Stamping Instructions
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            placeholder="Special casting, purity hallmarks, laser initials..."
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="secondary" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
