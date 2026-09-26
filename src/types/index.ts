export type ProductCategory = 
  | 'Rings' 
  | 'Earrings' 
  | 'Necklaces' 
  | 'Bracelets' 
  | 'Bangles' 
  | 'Chains' 
  | 'Pendants' 
  | 'Sets';

export type ProductStatus = 'In Stock' | 'Made to Order' | 'Low Stock';

export interface Product {
  id: string;
  modelNumber: string;
  name: string;
  category: ProductCategory;
  image: string;
  size: string;
  price: number;
  moq: number;
  stock: number;
  status: ProductStatus;
  purity: string;
  weight: string;
  diamondWeight?: string;
  description: string;
}

export interface Customer {
  id: string;
  partyName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  gstNumber: string;
  city: string;
  billingAddress: string;
  deliveryAddress: string;
  totalOrders: number;
  pendingOrders: number;
  outstanding: number;
  creditLimit: number;
  rating?: string;
}

export type OrderStatus = 
  | 'New' 
  | 'Confirmed' 
  | 'Production' 
  | 'Finishing' 
  | 'Packing' 
  | 'Ready' 
  | 'Dispatched' 
  | 'Cancelled';

export type PaymentStatus = 
  | 'Pending' 
  | 'Advance Pending' 
  | 'Advance Received' 
  | 'Partially Paid' 
  | 'Paid';

export type DeliveryStatus = 
  | 'Pending' 
  | 'In Production' 
  | 'Ready for Dispatch' 
  | 'Partially Dispatched' 
  | 'Dispatched';

export interface OrderItem {
  productId: string;
  modelNumber: string;
  productName: string;
  category: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
  dispatchedQuantity: number;
  pendingQuantity: number;
  notes?: string;
}

export interface DispatchLog {
  id: string;
  date: string;
  courierName: string;
  trackingNumber: string;
  dispatchedQty: number;
  items: { modelNumber: string; qty: number }[];
  notes?: string;
}

export interface TimelineEvent {
  stage: OrderStatus;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  customerCity: string;
  customerGst: string;
  billingAddress: string;
  deliveryAddress: string;
  orderDate: string;
  requiredDate: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  items: OrderItem[];
  totalModels: number;
  totalQuantity: number;
  dispatchedQuantity: number;
  pendingQuantity: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  advancePaid: number;
  balanceAmount: number;
  notes?: string;
  priority: 'Urgent' | 'High' | 'Normal';
  dispatchLogs: DispatchLog[];
  timeline: TimelineEvent[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  customNotes?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'production' | 'dispatch' | 'payment';
  orderId?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}
