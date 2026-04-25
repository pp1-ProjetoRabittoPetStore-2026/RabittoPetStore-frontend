export interface Order {
  id: string;
  customerName: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  date: string;
  status: OrderStatus;
}

export type OrderStatus = 'pending' | 'approved' | 'rejected';
