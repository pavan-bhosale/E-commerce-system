import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { formatDate } from '../../utils/formatters';
import { MessageSquare, Send, Copy, Check } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose, order }) => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!order) return null;

  const defaultMessage = `Hello ${order.customerName},\n\nYour order #${order.orderNumber} status is now: *${order.status.toUpperCase()}*.\n\n• Total Quantity: ${order.totalQuantity} pcs\n• Dispatched: ${order.dispatchedQuantity} pcs\n• Pending: ${order.pendingQuantity} pcs\n• Payment Status: ${order.paymentStatus}\n• Required Delivery Date: ${formatDate(order.requiredDate)}\n\nThank you for choosing VIDHI JEWEL.\nCrafting Excellence in B2B Fine Jewellery.`;

  const [message, setMessage] = useState(defaultMessage);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    showToast('Copied to Clipboard', 'info', 'Message text copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onClose();
      showToast(
        'WhatsApp Message Sent',
        'success',
        `Dispatched simulated update to ${order.customerMobile}`
      );
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      zIndex={60}
      title={
        <div className="flex items-center gap-2 text-emerald-800">
          <MessageSquare className="w-5 h-5 text-emerald-600" />
          <span>Simulated WhatsApp B2B Alert</span>
        </div>
      }
      subtitle={`Recipient: ${order.customerName} (${order.customerMobile})`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Banner */}
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <span>Official WhatsApp Business API Sandbox Simulation</span>
          <span className="font-semibold text-emerald-900">Live Mock</span>
        </div>

        {/* Message preview window */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Message Preview / Draft
          </label>
          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-wrap border border-slate-800 relative">
            {message}
          </div>
          <button
            onClick={handleCopy}
            className="absolute top-8 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Copy message"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            isLoading={isSending}
            leftIcon={<Send className="w-4 h-4 text-emerald-400" />}
            className="bg-emerald-700 hover:bg-emerald-800 border-emerald-700"
          >
            Send WhatsApp Update
          </Button>
        </div>
      </div>
    </Modal>
  );
};
