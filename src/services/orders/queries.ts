import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { ordersApi } from './api';
import type { Order } from './types';

// Query key for pending orders
const PENDING_ORDERS_KEY = ['Pendente', 'Aguardando', 'Em Serviço', 'Pronto'];

export const usePendingOrders = () => {
  return useQuery({
    queryKey: PENDING_ORDERS_KEY,
    queryFn: ordersApi.getPendingOrders,
    staleTime: 1000 * 60 * 5,
  });
};

export const useApproveOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.approveOrder,
    onMutate: async (orderId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: PENDING_ORDERS_KEY });

      // Snapshot the previous value
      const previousOrders =
        queryClient.getQueryData<Order[]>(PENDING_ORDERS_KEY);

      // Optimistically update to the new state
      queryClient.setQueryData<Order[]>(PENDING_ORDERS_KEY, (old) =>
        old
          ? old.map((order) =>
              order.id === orderId ? { ...order, status: 'approved' } : order,
            )
          : [],
      );

      // Return a context object with the snapshotted value
      return { previousOrders };
    },
    onError: (_err, _variables, context) => {
      // Rollback to the previous value if mutation fails
      if (context?.previousOrders) {
        queryClient.setQueryData(PENDING_ORDERS_KEY, context.previousOrders);
      }
    },
    onSettled: () => {
      // Refetch after mutation settles (success or error)
      queryClient.invalidateQueries({ queryKey: PENDING_ORDERS_KEY });
    },
  });
};

export const useRejectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.rejectOrder,
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: PENDING_ORDERS_KEY });

      const previousOrders =
        queryClient.getQueryData<Order[]>(PENDING_ORDERS_KEY);

      queryClient.setQueryData<Order[]>(PENDING_ORDERS_KEY, (old) =>
        old
          ? old.map((order) =>
              order.id === orderId ? { ...order, status: 'rejected' } : order,
            )
          : [],
      );

      return { previousOrders };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(PENDING_ORDERS_KEY, context.previousOrders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PENDING_ORDERS_KEY });
    },
  });
};
