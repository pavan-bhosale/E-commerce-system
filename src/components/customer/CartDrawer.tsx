import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, cartTotalCount, cartTotalAmount } = useApp();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.03);
  const total = subtotal + gst;

  const handleCheckout = () => {
    onClose();
    navigate('/customer/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">B2B Order Cart</h3>
                <p className="text-xs text-slate-500">
                  {cart.length} Model{cart.length !== 1 ? 's' : ''} • {cartTotalCount} Total Pieces
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-700">Your order cart is empty</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Browse our wholesale fine jewellery catalogue and select models to create a purchase order.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onClose}
                  className="mt-4"
                >
                  Browse Catalogue
                </Button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {item.product.modelNumber}
                        </span>
                        <h4 className="text-xs text-slate-600 line-clamp-1">{item.product.name}</h4>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove model"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Rate: {formatCurrency(item.product.price)} / pc
                    </div>

                    {item.customNotes && (
                      <div className="text-[10px] text-amber-700 italic mt-0.5 line-clamp-1">
                        Note: {item.customNotes}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controller */}
                      <div className="flex items-center rounded-lg border border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 5)}
                          className="p-1 text-slate-500 hover:text-slate-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 5)}
                          className="p-1 text-slate-500 hover:text-slate-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal ({cartTotalCount} pcs):</span>
                  <span className="font-mono font-medium text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jewellery GST (3%):</span>
                  <span className="font-mono text-slate-900">{formatCurrency(gst)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Estimated Total:</span>
                  <span className="font-mono text-blue-900">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleCheckout}
                className="w-full justify-center"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Order Details
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
