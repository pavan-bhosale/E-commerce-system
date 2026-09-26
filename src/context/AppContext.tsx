import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Customer, 
  Order, 
  OrderStatus, 
  PaymentStatus, 
  CartItem, 
  AppNotification, 
  ToastNotification 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_ORDERS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

interface AppContextType {
  // Role & Session
  userRole: 'admin' | 'customer';
  setUserRole: (role: 'admin' | 'customer') => void;
  currentCustomer: Customer;
  setCurrentCustomer: (customer: Customer) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  updatePaymentStatus: (orderId: string, newPaymentStatus: PaymentStatus, advanceAmount?: number) => void;
  recordPartialDispatch: (
    orderId: string, 
    dispatchItems: { modelNumber: string; qty: number }[],
    courierName: string,
    trackingNumber: string,
    notes?: string
  ) => void;
  updateOrderDetails: (orderId: string, updates: Partial<Order>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, selectedSize?: string, notes?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartTotalAmount: number;

  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Toast System
  toasts: ToastNotification[];
  showToast: (title: string, type?: 'success' | 'info' | 'warning' | 'error', message?: string) => void;
  removeToast: (id: string) => void;

  // Global Modals & Command Palette
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  notificationPanelOpen: boolean;
  setNotificationPanelOpen: (open: boolean) => void;

  // Demo state reset
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or mock data
  const [userRole, setUserRoleState] = useState<'admin' | 'customer'>(() => {
    return (localStorage.getItem('vj_user_role') as 'admin' | 'customer') || 'admin';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vj_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('vj_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [currentCustomer, setCurrentCustomer] = useState<Customer>(() => {
    return customers[0] || INITIAL_CUSTOMERS[0];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('vj_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('vj_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('vj_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vj_user_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('vj_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vj_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('vj_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('vj_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vj_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const setUserRole = (role: 'admin' | 'customer') => {
    setUserRoleState(role);
    showToast(`Switched to ${role === 'admin' ? 'Admin Portal' : 'Customer Portal'}`, 'info');
  };

  // Toast Handler
  const showToast = (title: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', message?: string) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Product Actions
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...prodData,
      id: 'prod-' + (products.length + 1) + '-' + Date.now().toString(36)
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('Product Added', 'success', `Model ${newProduct.modelNumber} added to catalogue`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product Updated', 'success', 'Product details saved successfully');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product Removed', 'info', `Model ${target?.modelNumber || id} removed from catalogue`);
  };

  // Customer Actions
  const addCustomer = (custData: Omit<Customer, 'id'>) => {
    const newCust: Customer = {
      ...custData,
      id: 'cust-' + (customers.length + 1) + '-' + Date.now().toString(36)
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast('Customer Created', 'success', `${newCust.partyName} registered successfully`);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Customer Saved', 'success', 'Party profile updated');
  };

  // Cart Actions
  const addToCart = (product: Product, quantity: number, selectedSize?: string, customNotes?: string) => {
    const sizeToUse = selectedSize || product.size;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, selectedSize: sizeToUse, customNotes: customNotes || item.customNotes }
            : item
        );
      } else {
        return [...prev, { product, quantity, selectedSize: sizeToUse, customNotes }];
      }
    });
    showToast('Added to Cart', 'success', `${quantity} pcs of ${product.modelNumber} added`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast('Item Removed', 'info', `${item.product.modelNumber} removed from cart`);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTax = Math.round(cartSubtotal * 0.03); // 3% Jewellery GST in India
  const cartTotalAmount = cartSubtotal + cartTax;

  // Order Actions
  const createOrder = (orderData: Partial<Order>): Order => {
    const orderNum = `VJ-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: 'ord-' + Date.now().toString(36),
      orderNumber: orderNum,
      customerId: orderData.customerId || currentCustomer.id,
      customerName: orderData.customerName || currentCustomer.partyName,
      customerMobile: orderData.customerMobile || currentCustomer.mobile,
      customerCity: orderData.customerCity || currentCustomer.city,
      customerGst: orderData.customerGst || currentCustomer.gstNumber,
      billingAddress: orderData.billingAddress || currentCustomer.billingAddress,
      deliveryAddress: orderData.deliveryAddress || currentCustomer.deliveryAddress,
      orderDate: formattedDate,
      requiredDate: orderData.requiredDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'New',
      paymentStatus: 'Advance Pending',
      deliveryStatus: 'Pending',
      items: orderData.items || [],
      totalModels: orderData.items?.length || 0,
      totalQuantity: orderData.totalQuantity || 0,
      dispatchedQuantity: 0,
      pendingQuantity: orderData.totalQuantity || 0,
      subtotal: orderData.subtotal || 0,
      taxAmount: orderData.taxAmount || 0,
      totalAmount: orderData.totalAmount || 0,
      advancePaid: 0,
      balanceAmount: orderData.totalAmount || 0,
      notes: orderData.notes || '',
      priority: orderData.priority || 'Normal',
      dispatchLogs: [],
      timeline: [
        {
          stage: 'New',
          timestamp: `${formattedDate} ${timeString}`,
          title: 'Order Submitted',
          description: `Order ${orderNum} created with ${orderData.totalQuantity} total pieces`,
          actor: `${orderData.customerName || currentCustomer.partyName}`
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Add notification
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now().toString(36),
      title: 'New Order Received',
      message: `${newOrder.customerName} submitted order #${newOrder.orderNumber} for ${newOrder.totalQuantity} pcs.`,
      timestamp: 'Just now',
      read: false,
      type: 'order',
      orderId: newOrder.id
    };
    setNotifications((prev) => [newNotif, ...prev]);

    clearCart();
    showToast('Order Placed Successfully', 'success', `Order #${orderNum} created for ${newOrder.customerName}`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    let newDeliveryStatus: Order['deliveryStatus'] = 'Pending';
    if (newStatus === 'Production' || newStatus === 'Finishing' || newStatus === 'Packing') {
      newDeliveryStatus = 'In Production';
    } else if (newStatus === 'Ready') {
      newDeliveryStatus = 'Ready for Dispatch';
    } else if (newStatus === 'Dispatched') {
      newDeliveryStatus = 'Dispatched';
    }

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedTimeline = [
          ...order.timeline,
          {
            stage: newStatus,
            timestamp: `${formattedDate} ${timeString}`,
            title: `Moved to ${newStatus}`,
            description: note || `Status changed from ${order.status} to ${newStatus}`,
            actor: 'Admin (Rajesh Mehta)'
          }
        ];

        return {
          ...order,
          status: newStatus,
          deliveryStatus: newDeliveryStatus,
          timeline: updatedTimeline
        };
      })
    );

    showToast('Status Updated', 'success', `Order moved to ${newStatus}`);
  };

  const updatePaymentStatus = (orderId: string, newPaymentStatus: PaymentStatus, advanceAmount?: number) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const newAdvance = advanceAmount !== undefined ? advanceAmount : order.advancePaid;
        const newBalance = Math.max(0, order.totalAmount - newAdvance);

        return {
          ...order,
          paymentStatus: newPaymentStatus,
          advancePaid: newAdvance,
          balanceAmount: newBalance
        };
      })
    );
    showToast('Payment Status Updated', 'success', `Marked as ${newPaymentStatus}`);
  };

  const recordPartialDispatch = (
    orderId: string,
    dispatchItems: { modelNumber: string; qty: number }[],
    courierName: string,
    trackingNumber: string,
    notes?: string
  ) => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const totalThisDispatch = dispatchItems.reduce((sum, item) => sum + item.qty, 0);
    if (totalThisDispatch <= 0) return;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        // Update items dispatched & pending quantities
        const updatedItems = order.items.map((item) => {
          const match = dispatchItems.find((d) => d.modelNumber === item.modelNumber);
          if (match && match.qty > 0) {
            const added = Math.min(match.qty, item.pendingQuantity);
            return {
              ...item,
              dispatchedQuantity: item.dispatchedQuantity + added,
              pendingQuantity: Math.max(0, item.pendingQuantity - added)
            };
          }
          return item;
        });

        const newDispatchedTotal = updatedItems.reduce((sum, i) => sum + i.dispatchedQuantity, 0);
        const newPendingTotal = updatedItems.reduce((sum, i) => sum + i.pendingQuantity, 0);
        const isFullyDispatched = newPendingTotal === 0;

        const newLog = {
          id: 'disp-' + Date.now().toString(36),
          date: `${formattedDate} ${timeString}`,
          courierName,
          trackingNumber,
          dispatchedQty: totalThisDispatch,
          items: dispatchItems,
          notes
        };

        const updatedTimeline = [
          ...order.timeline,
          {
            stage: isFullyDispatched ? ('Dispatched' as OrderStatus) : order.status,
            timestamp: `${formattedDate} ${timeString}`,
            title: isFullyDispatched ? 'All Items Dispatched' : 'Partial Dispatch Recorded',
            description: `${totalThisDispatch} pcs shipped via ${courierName} (Tracking: ${trackingNumber})`,
            actor: 'Dispatch Manager'
          }
        ];

        return {
          ...order,
          items: updatedItems,
          dispatchedQuantity: newDispatchedTotal,
          pendingQuantity: newPendingTotal,
          deliveryStatus: isFullyDispatched ? 'Dispatched' : 'Partially Dispatched',
          status: isFullyDispatched ? 'Dispatched' : order.status,
          dispatchLogs: [newLog, ...order.dispatchLogs],
          timeline: updatedTimeline
        };
      })
    );

    showToast('Dispatch Recorded', 'success', `${totalThisDispatch} pcs dispatched via ${courierName}`);
  };

  const updateOrderDetails = (orderId: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, ...updates } : order))
    );
    showToast('Order Saved', 'success', 'Order details successfully updated');
  };

  // Notification Actions
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Notifications Cleared', 'info', 'All notifications marked as read');
  };

  // Reset to initial demo data
  const resetDemoData = () => {
    localStorage.removeItem('vj_products');
    localStorage.removeItem('vj_customers');
    localStorage.removeItem('vj_orders');
    localStorage.removeItem('vj_cart');
    localStorage.removeItem('vj_notifications');
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Demo Reset', 'info', 'Reset all prototype data to initial factory state');
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentCustomer,
        setCurrentCustomer,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        customers,
        addCustomer,
        updateCustomer,
        orders,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        recordPartialDispatch,
        updateOrderDetails,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartTotalAmount,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        toasts,
        showToast,
        removeToast,
        globalSearchOpen,
        setGlobalSearchOpen,
        notificationPanelOpen,
        setNotificationPanelOpen,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
