import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Order } from '../../types';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { CheckCircle2, MessageSquare, ArrowRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const navigate = useNavigate();

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" showCloseButton={false} zIndex={60}>
      <div className="text-center py-2 space-y-4">
        {/* Animated Check Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Order Submitted Successfully!
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Your B2B manufacturing purchase order has been registered in the system.
          </p>
        </div>

        {/* Order Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs text-slate-500">Order Reference</span>
            <span className="font-mono text-sm font-bold text-blue-900">
              #{order.orderNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Models & Quantity</span>
              <span className="font-bold text-slate-800">
                {order.totalModels} Models • {order.totalQuantity} Pieces
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Required Delivery</span>
              <span className="font-bold text-slate-800">
                {formatDate(order.requiredDate)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Total Amount</span>
              <span className="font-mono font-bold text-slate-900">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Party Name</span>
              <span className="font-bold text-slate-800 truncate block">
                {order.customerName}
              </span>
            </div>
          </div>
        </div>

        {/* WhatsApp Notification Simulation Banner */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5 text-left">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold">Automated WhatsApp Confirmation Sent</div>
            <div className="text-[11px] text-emerald-700">
              Order receipt & proforma notification dispatched to {order.customerMobile}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              onClose();
              navigate('/customer/catalogue');
            }}
            className="flex-1 justify-center"
            leftIcon={<ShoppingBag className="w-4 h-4" />}
          >
            Continue Browsing
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onClose();
              navigate(`/customer/orders?id=${order.id}`);
            }}
            className="flex-1 justify-center"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View Order & Track
          </Button>
        </div>
      </div>
    </Modal>
  );
};
