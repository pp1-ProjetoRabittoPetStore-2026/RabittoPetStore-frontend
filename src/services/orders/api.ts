import api from '../api';
import type { Order } from './types';

export const ordersApi = {
  // Fetch pending orders (status: 'pending')
  getPendingOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders', {
      params: { status: 'pending' },
    });
    return response.data;
  },

  // Approve an order
  approveOrder: async (orderId: string): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${orderId}`, {
      status: 'approved',
    });
    return response.data;
  },

  // Reject an order
  rejectOrder: async (orderId: string): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${orderId}`, {
      status: 'rejected',
    });
    return response.data;
  },
};
