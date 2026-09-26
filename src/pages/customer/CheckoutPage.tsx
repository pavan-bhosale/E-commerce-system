import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { OrderSuccessModal } from '../../components/customer/OrderSuccessModal';
import { Order, OrderItem } from '../../types';
import {
  Building2,
  Phone,
  MapPin,
  Calendar,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

export const CustomerCheckoutPage: React.FC = () => {
  const { cart, cartTotalCount, cartTotalAmount, currentCustomer, createOrder } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState<'form' | 'review'>('form');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields prefilled from current party
  const [partyName, setPartyName] = useState(currentCustomer.partyName);
  const [mobile, setMobile] = useState(currentCustomer.mobile);
  const [gstNumber, setGstNumber] = useState(currentCustomer.gstNumber);
  const [billingAddress, setBillingAddress] = useState(currentCustomer.billingAddress);
  const [deliveryAddress, setDeliveryAddress] = useState(currentCustomer.deliveryAddress);
  const [requiredDate, setRequiredDate] = useState(() => {
    // 15 days minimum lead time from now
    const d = new Date(Date.now() + 15 * 86400000);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('Festive stock requirement. Laser hallmark party initials.');

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!partyName.trim()) newErrors.partyName = 'Party Name is required';
    if (!mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!gstNumber.trim() || gstNumber.length < 10) newErrors.gstNumber = 'Valid 15-digit GSTIN is required';
    if (!billingAddress.trim()) newErrors.billingAddress = 'Billing address is required';
    if (!deliveryAddress.trim()) newErrors.deliveryAddress = 'Delivery / Transport address is required';
    if (!requiredDate) newErrors.requiredDate = 'Required delivery date is mandatory';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStep('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitOrder = () => {
    setIsSubmitting(true);

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const taxAmount = Math.round(subtotal * 0.03);
    const totalAmount = subtotal + taxAmount;

    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.product.id,
      modelNumber: item.product.modelNumber,
      productName: item.product.name,
      category: item.product.category,
      image: item.product.image,
      size: item.selectedSize || item.product.size,
      price: item.product.price,
      quantity: item.quantity,
      dispatchedQuantity: 0,
      pendingQuantity: item.quantity,
      notes: item.customNotes
    }));

    setTimeout(() => {
      const order = createOrder({
        customerId: currentCustomer.id,
        customerName: partyName,
        customerMobile: mobile,
        customerGst: gstNumber,
        billingAddress,
        deliveryAddress,
        requiredDate,
        notes,
        items: orderItems,
        totalQuantity: cartTotalCount,
        subtotal,
        taxAmount,
        totalAmount,
        priority: 'Normal'
      });

      setIsSubmitting(false);
      setCreatedOrder(order);
      setSuccessModalOpen(true);
    }, 600);
  };

  if (cart.length === 0 && !createdOrder) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Order Cart is Empty</h2>
        <p className="text-xs text-slate-500">
          Please add models from the wholesale fine jewellery catalogue before generating a purchase booking.
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/customer/catalogue')}>
          Browse Jewellery Catalogue
        </Button>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const taxAmount = Math.round(subtotal * 0.03);
  const totalAmount = subtotal + taxAmount;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Stepper Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            {step === 'form' ? 'B2B Purchase Order Booking' : 'Review & Confirm Purchase Order'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {step === 'form'
              ? 'Provide billing GST details, delivery address, and scheduled lead time'
              : 'Verify model-wise quantities and commercial terms before submitting'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
              step === 'form' ? 'bg-[#0b1e36] text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            1
          </span>
          <span className="w-6 h-0.5 bg-slate-200" />
          <span
            className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
              step === 'review' ? 'bg-[#0b1e36] text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            2
          </span>
        </div>
      </div>

      {step === 'form' ? (
        /* STEP 1: FORM DETAILS */
        <form onSubmit={handleProceedToReview} className="space-y-6">
          {/* Party Identification */}
          <div className="card-soft p-5 bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Party Commercial Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Party / Retailer Name *
                </label>
                <input
                  type="text"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  className={`w-full text-xs px-3 py-2.5 rounded-xl border ${
                    errors.partyName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-semibold`}
                />
                {errors.partyName && <p className="text-[11px] text-rose-600 mt-1">{errors.partyName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GSTIN (15 Digits) *
                </label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  className={`w-full text-xs px-3 py-2.5 rounded-xl border font-mono ${
                    errors.gstNumber ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-hidden focus:ring-1 focus:ring-blue-500`}
                />
                {errors.gstNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.gstNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (WhatsApp Enabled) *
                </label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className={`w-full text-xs px-3 py-2.5 rounded-xl border ${
                    errors.mobile ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-hidden focus:ring-1 focus:ring-blue-500`}
                />
                {errors.mobile && <p className="text-[11px] text-rose-600 mt-1">{errors.mobile}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Factory Delivery Date *
                </label>
                <input
                  type="date"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className={`w-full text-xs px-3 py-2.5 rounded-xl border ${
                    errors.requiredDate ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-hidden focus:ring-1 focus:ring-blue-500`}
                />
                {errors.requiredDate && <p className="text-[11px] text-rose-600 mt-1">{errors.requiredDate}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Billing Address *
              </label>
              <textarea
                rows={2}
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                className={`w-full text-xs p-3 rounded-xl border ${
                  errors.billingAddress ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                } focus:outline-hidden focus:ring-1 focus:ring-blue-500`}
              />
              {errors.billingAddress && <p className="text-[11px] text-rose-600 mt-1">{errors.billingAddress}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Secured Delivery / Vault Cargo Destination *
              </label>
              <textarea
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className={`w-full text-xs p-3 rounded-xl border ${
                  errors.deliveryAddress ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                } focus:outline-hidden focus:ring-1 focus:ring-blue-500`}
              />
              {errors.deliveryAddress && <p className="text-[11px] text-rose-600 mt-1">{errors.deliveryAddress}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hallmark & Production Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify BIS stamping, retail box sleeves, priority batching..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Cart Items Summary Mini Table */}
          <div className="card-soft overflow-hidden bg-white border border-slate-200 shadow-2xs">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Selected Models ({cart.length} Models • {cartTotalCount} Pieces)
              </span>
              <button
                type="button"
                onClick={() => navigate('/customer/catalogue')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                + Add More Models
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.product.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <div className="font-mono font-bold text-slate-900">{item.product.modelNumber}</div>
                      <div className="text-slate-600">{item.product.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.selectedSize} • {formatCurrency(item.product.price)} / pc
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      {item.quantity} pcs
                    </div>
                    <div className="font-mono text-xs text-slate-600">
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (3%):</span>
                <span className="font-mono">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Total Purchase Amount:</span>
                <span className="font-mono text-blue-900">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="primary"
              size="lg"
              type="submit"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Order Review
            </Button>
          </div>
        </form>
      ) : (
        /* STEP 2: ORDER REVIEW */
        <div className="space-y-6">
          {/* Review Card */}
          <div className="card-soft p-5 bg-white border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Order Summary & Commercial Confirmation
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Ready for Factory Submission
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-bold text-[10px] uppercase text-slate-400 block">Buyer Details</span>
                <div className="font-bold text-slate-900 text-sm">{partyName}</div>
                <div className="text-slate-600 font-mono">GSTIN: {gstNumber}</div>
                <div className="text-slate-600">Mobile: {mobile}</div>
                <div className="text-slate-500 pt-1 border-t border-slate-200/60 leading-relaxed">
                  Billing: {billingAddress}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-bold text-[10px] uppercase text-slate-400 block">Delivery & Schedule</span>
                <div className="font-bold text-slate-900 text-sm">
                  Required by: {formatDate(requiredDate)}
                </div>
                <div className="text-slate-600">Armoured Logistics: BVC / Sequel Air Vault</div>
                <div className="text-slate-500 pt-1 border-t border-slate-200/60 leading-relaxed">
                  Destination: {deliveryAddress}
                </div>
                {notes && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                    <span className="font-bold">Instructions:</span> {notes}
                  </div>
                )}
              </div>
            </div>

            {/* Models Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-700">
                Model-Wise Quantities ({cart.length} Models • {cartTotalCount} Pieces)
              </div>
              <div className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <span className="font-mono font-bold text-slate-900">
                          {item.product.modelNumber}
                        </span>{' '}
                        - {item.product.name}
                        <div className="text-[11px] text-slate-400">
                          {item.selectedSize} • {formatCurrency(item.product.price)} / pc
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900">{item.quantity} pcs</div>
                      <div className="font-mono text-slate-600 text-[11px]">
                        {formatCurrency(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal ({cartTotalCount} pieces):</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Jewellery GST (3%):</span>
                <span className="font-mono">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-amber-400 pt-2 border-t border-white/10">
                <span>Total Purchase Order Value:</span>
                <span className="font-mono">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="text-[10px] text-slate-400 italic pt-1">
                Standard payment term: 30% advance on order confirmation, balance against insured delivery.
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setStep('form')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Edit Details
            </Button>

            <Button
              variant="gold"
              size="lg"
              onClick={handleSubmitOrder}
              isLoading={isSubmitting}
              leftIcon={<Sparkles className="w-4 h-4" />}
              className="font-bold px-6 shadow-md"
            >
              Confirm & Submit Order
            </Button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <OrderSuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        order={createdOrder}
      />
    </div>
  );
};
