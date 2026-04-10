export enum OrderStatus {
  Pending = 0,
  Shipped = 1,
  Delivered = 2,
  Cancelled = 3
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceAtTimeOfOrder: number;
  price?: number;
  productName?: string;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: OrderStatus;
  orderItems?: OrderItem[];
}
