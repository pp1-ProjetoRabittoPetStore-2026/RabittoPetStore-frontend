import {
  Box,
  Stack,
  Flex,
  Text,
  Spinner,
  Button,
  Badge,
} from '@chakra-ui/react';
import { Check, X } from 'lucide-react';
import {
  usePendingOrders,
  useApproveOrder,
  useRejectOrder,
} from '../../services/orders/queries';
import type { Order } from '@/services/orders/types';
import { useColorModeValue } from '@/components/ui/color-mode';
import { toaster } from '@/components/ui/toaster';

export default function ManagerOrdersPage() {
  const { data: orders = [], isLoading, error } = usePendingOrders();
  const { mutate: approveOrder, isPending: isApproving } = useApproveOrder();
  const { mutate: rejectOrder, isPending: isRejecting } = useRejectOrder();

  const handleApprove = (orderId: string) => {
    approveOrder(orderId, {
      onSuccess: () => {
        toaster.create({
          title: 'Order approved',
          description: 'The order has been successfully approved.',
          type: 'success',
          duration: 3000,
        });
      },
      onError: () => {
        toaster.create({
          title: 'Error',
          description: 'Failed to approve the order. Please try again.',
          type: 'error',
          duration: 3000,
        });
      },
    });
  };

  const handleReject = (orderId: string) => {
    rejectOrder(orderId, {
      onSuccess: () => {
        toaster.create({
          title: 'Order rejected',
          description: 'The order has been rejected.',
          type: 'warning',
          duration: 3000,
        });
      },
      onError: () => {
        toaster.create({
          title: 'Error',
          description: 'Failed to reject the order. Please try again.',
          type: 'error',
          duration: 3000,
        });
      },
    });
  };

  if (isLoading) {
    return (
      <Box minH="100vh" py={12} px={6} textAlign="center">
        <Spinner size="lg" />
        <Text mt={4}>Loading pending orders...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" py={12} px={6} textAlign="center">
        <Text color="red.500" fontSize="xl">
          Error loading orders
        </Text>
        <Text mt={2}>
          {(error as Error).message || 'Please try again later.'}
        </Text>
        <Button
          mt={4}
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box minH="100vh" py={12} px={6} textAlign="center">
        <Text fontSize="2xl">No pending orders</Text>
        <Text mt={4} color="gray.500">
          All customer requests have been processed.
        </Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" py={12} px={6}>
      <Stack>
        <Text fontSize="2xl" fontWeight="bold">
          Pending Customer Orders
        </Text>
        <Stack>
          {orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              onApprove={handleApprove}
              onReject={handleReject}
              isApproving={isApproving}
              isRejecting={isRejecting}
            />
          ))}
        </Stack>
      </Stack>
      {/* <Toaster position="top-right" />
       */}
    </Box>
  );
}

interface OrderItemProps {
  order: Order;
  onApprove: (orderId: string) => void;
  onReject: (orderId: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

function OrderItem({
  order,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: OrderItemProps) {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={6}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Box>
          <Text fontSize="lg" fontWeight="medium" color={textColor}>
            Order for {order.customerName}
          </Text>
          <Text fontSize="sm" color={mutedTextColor}>
            {new Date(order.date).toLocaleDateString()} •
            {order.items.reduce((total, item) => total + item.quantity, 0)}{' '}
            items
          </Text>
        </Box>
        <Flex>
          <Badge
            colorScheme={
              order.status === 'pending'
                ? 'yellow'
                : order.status === 'approved'
                  ? 'green'
                  : 'red'
            }
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </Flex>
      </Flex>
      <Stack mt={4}>
        {order.items.map((item, index) => (
          <Flex key={index} alignItems="center">
            <Text flexShrink={0} color={mutedTextColor}>
              •
            </Text>
            <Box flexGrow={1}>
              <Text fontSize="md" color={textColor}>
                {item.productName}
              </Text>
              <Text fontSize="sm" color={mutedTextColor}>
                {item.quantity} × ${item.price.toFixed(2)}
              </Text>
            </Box>
            <Text flexShrink={0} textAlign="right" color={textColor}>
              ${(item.quantity * item.price).toFixed(2)}
            </Text>
          </Flex>
        ))}
        <Stack mt={4}>
          <Text fontWeight="medium" color={textColor}>
            Total: ${order.totalAmount.toFixed(2)}
          </Text>
          <Flex mt={2}>
            <Button
              onClick={() => onApprove(order.id)}
              loading={isApproving}
              colorScheme="green"
              variant="solid"
              size="sm"
              flexGrow={1}
            >
              <Check size={20} />
              Approve
            </Button>
            <Button
              onClick={() => onReject(order.id)}
              loading={isRejecting}
              colorScheme="red"
              variant="solid"
              size="sm"
              flexGrow={1}
            >
              <X size={20} />
              Reject
            </Button>
          </Flex>
        </Stack>
      </Stack>
    </Box>
  );
}
