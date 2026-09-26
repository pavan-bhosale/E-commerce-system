import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Users, FileText, ArrowRight, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface GlobalSearchModalProps {
  onSelectOrder?: (orderId: string) => void;
  onSelectProduct?: (productId: string) => void;
  onSelectCustomer?: (customerId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  onSelectOrder,
  onSelectProduct,
  onSelectCustomer
}) => {
  const { globalSearchOpen, setGlobalSearchOpen, orders, products, customers, userRole } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!globalSearchOpen);
      }
      if (e.key === 'Escape' && globalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  useEffect(() => {
    if (globalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [globalSearchOpen]);

  if (!globalSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredOrders = q
    ? orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.status.toLowerCase().includes(q)
      )
    : orders.slice(0, 3);

  const filteredProducts = q
    ? products.filter(
        (p) =>
          p.modelNumber.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    : products.slice(0, 3);

  const filteredCustomers = q
    ? customers.filter(
        (c) =>
          c.partyName.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.gstNumber.toLowerCase().includes(q)
      )
    : customers.slice(0, 2);

  const totalResults = filteredOrders.length + filteredProducts.length + filteredCustomers.length;

  const handleOrderClick = (orderId: string) => {
    setGlobalSearchOpen(false);
    if (onSelectOrder) {
      onSelectOrder(orderId);
    } else {
      if (userRole === 'admin') {
        navigate(`/admin/orders?id=${orderId}`);
      } else {
        navigate(`/customer/orders?id=${orderId}`);
      }
    }
  };

  const handleProductClick = (productId: string) => {
    setGlobalSearchOpen(false);
    if (onSelectProduct) {
      onSelectProduct(productId);
    } else {
      if (userRole === 'admin') {
        navigate(`/admin/catalogue?id=${productId}`);
      } else {
        navigate(`/customer/catalogue?id=${productId}`);
      }
    }
  };

  const handleCustomerClick = (customerId: string) => {
    setGlobalSearchOpen(false);
    if (onSelectCustomer) {
      onSelectCustomer(customerId);
    } else {
      navigate(`/admin/customers?id=${customerId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setGlobalSearchOpen(false)}
      />

      <div className="relative mx-auto max-w-2xl transform divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4">
          <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="h-14 w-full border-0 bg-transparent pl-3 pr-8 text-slate-900 placeholder:text-slate-400 focus:outline-hidden text-sm sm:text-base"
            placeholder="Search orders, model numbers (e.g. VJ-R102), jewellery, parties..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span className="hidden sm:inline-block rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
              ESC
            </span>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 divide-y divide-slate-100">
          {totalResults === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No results found for "<span className="font-semibold text-slate-700">{query}</span>"
            </div>
          ) : (
            <>
              {/* Orders Section */}
              {filteredOrders.length > 0 && (
                <div className="py-2">
                  <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Orders
                  </div>
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => handleOrderClick(order.id)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600 flex items-center gap-2">
                            <span>#{order.orderNumber}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-normal">
                              {order.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {order.customerName} • {order.totalQuantity} pcs • {formatCurrency(order.totalAmount)}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}

              {/* Products Section */}
              {filteredProducts.length > 0 && (
                <div className="py-2">
                  <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Catalogue Products
                  </div>
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleProductClick(prod.id)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="truncate">
                          <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600 flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-700">{prod.modelNumber}</span>
                            <span className="truncate">{prod.name}</span>
                          </div>
                          <div className="text-xs text-slate-500">
                            {prod.category} • {formatCurrency(prod.price)} / pc • Stock: {prod.stock} pcs
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}

              {/* Customers Section */}
              {userRole === 'admin' && filteredCustomers.length > 0 && (
                <div className="py-2">
                  <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    B2B Parties / Retailers
                  </div>
                  {filteredCustomers.map((cust) => (
                    <div
                      key={cust.id}
                      onClick={() => handleCustomerClick(cust.id)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600">
                            {cust.partyName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {cust.city} • GST: {cust.gstNumber} • Total Orders: {cust.totalOrders}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 text-xs text-slate-500">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">ESC</kbd> to exit</span>
          <span>Instant B2B Order & Inventory Search</span>
        </div>
      </div>
    </div>
  );
};
