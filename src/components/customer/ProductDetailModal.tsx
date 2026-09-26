import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Minus, ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { addToCart } = useApp();

  const [quantity, setQuantity] = useState(10);
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [customNotes, setCustomNotes] = useState('');

  useEffect(() => {
    if (product) {
      setQuantity(product.moq || 10);
      setSelectedSize(product.size);
      setCustomNotes('');
    }
  }, [product, isOpen]);

  if (!product) return null;

  const handleIncrement = () => {
    setQuantity((prev) => prev + 5);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(product.moq, prev - 5));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, customNotes);
    onClose();
  };

  const totalPrice = product.price * quantity;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
            {product.modelNumber}
          </span>
          <span className="text-base font-bold text-slate-900 truncate">{product.name}</span>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Product Image */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>BIS Hallmarked Gold</span>
            </div>
            <span className="font-mono font-bold text-slate-800">{product.purity}</span>
          </div>
        </div>

        {/* Right: Specs & Order Builder */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="primary" size="xs">
                {product.category}
              </Badge>
              <Badge
                variant={product.status === 'In Stock' ? 'success' : 'default'}
                size="xs"
                dot
              >
                {product.status} ({product.stock} pcs)
              </Badge>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs border border-slate-200 rounded-xl p-3 bg-slate-50/50 mb-4">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Purity / Alloy</span>
                <span className="font-semibold text-slate-800">{product.purity}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Approx Gross Weight</span>
                <span className="font-semibold text-slate-800">{product.weight}</span>
              </div>
              {product.diamondWeight && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Diamond / Gem Quality</span>
                  <span className="font-semibold text-amber-800">{product.diamondWeight}</span>
                </div>
              )}
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Default Size</span>
                <span className="font-semibold text-slate-800">{product.size}</span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-blue-900 font-bold block">
                  Wholesale Unit Price
                </span>
                <span className="text-xl font-extrabold text-blue-950 font-mono">
                  {formatCurrency(product.price)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Min. Order Qty (MOQ)</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{product.moq} pcs</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700">Order Quantity (Pieces)</label>
                <span className="text-[11px] text-slate-500">Minimum MOQ: {product.moq} pcs</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-xl border border-slate-300 bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={quantity <= product.moq}
                    className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={product.moq}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || product.moq;
                      setQuantity(Math.max(product.moq, val));
                    }}
                    className="w-20 text-center font-mono font-bold text-sm text-slate-900 border-x border-slate-200 py-1.5 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 text-right text-xs">
                  <span className="text-slate-400 block text-[10px]">Model Subtotal</span>
                  <span className="font-mono font-bold text-base text-slate-900">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stamping / Notes */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Custom Stamping / Special Instructions (Optional)
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Hallmark party initials, custom ring sizes (14, 15, 16)"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleAddToCart}
              leftIcon={<ShoppingBag className="w-4 h-4" />}
            >
              Add {quantity} Pieces to Cart
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
