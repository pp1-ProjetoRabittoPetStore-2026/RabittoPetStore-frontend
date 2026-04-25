import api from '../api';
import type { Order } from './types';

export const ordersApi = {
  // Fetch orders by status (default: 'Pendentes')
  getPendingOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders', {
      params: { status: 'Pendentes' },
    });
    return response.data;
  },

  // Approve an order — status sent as path variable
  approveOrder: async (orderId: string): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${orderId}/Aprovado`);
    return response.data;
  },

  // Reject an order — status sent as path variable
  rejectOrder: async (orderId: string): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${orderId}/Rejeitado`);
    return response.data;
  },
};
