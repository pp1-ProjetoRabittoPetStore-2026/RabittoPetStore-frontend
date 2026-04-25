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

import { useColorModeValue } from '@/components/ui/color-mode';
import { toaster } from '@/components/ui/toaster';
import {
  useAgendamentosByStatus,
  useUpdateStatus,
} from '@/services/agendamentos/queries';
import type { Agendamento } from '@/services/agendamentos/types';

export default function ManagerOrdersPage() {
  // Buscamos apenas os agendamentos com status "Pendente"
  const {
    data: agendamentos = [],
    isLoading,
    error,
  } = useAgendamentosByStatus('Pendente');
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateStatus();

  const handleUpdate = (
    id: number,
    newStatus: 'Confirmado' | 'Cancelado',
    actionLabel: string,
  ) => {
    updateStatus(
      { id, status: newStatus },
      {
        onSuccess: () => {
          toaster.create({
            title: `Agendamento ${actionLabel}`,
            description: `O status foi atualizado para ${newStatus} com sucesso.`,
            type: 'success',
          });
        },
        onError: () => {
          toaster.create({
            title: 'Erro',
            description: 'Não foi possível atualizar o agendamento.',
            type: 'error',
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <Box minH="100vh" py={12} px={6} textAlign="center">
        <Spinner size="lg" />
        <Text mt={4}>Carregando agendamentos pendentes...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" py={12} px={6} textAlign="center">
        <Text color="red.500" fontSize="xl">
          Erro ao carregar dados
        </Text>
        <Button mt={4} onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </Box>
    );
  }

  if (agendamentos.length === 0) {
    return (
      <Box minH="100vh" py={12} px={6} textAlign="center">
        <Text fontSize="2xl">Nenhum agendamento pendente</Text>
        <Text mt={4} color="gray.500">
          Todos os pedidos foram processados.
        </Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" py={12} px={6}>
      <Stack gap={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Agendamentos Pendentes
        </Text>
        <Stack gap={4}>
          {agendamentos.map((item) => (
            <OrderItem
              key={item.id}
              agendamento={item}
              onApprove={(id) => handleUpdate(id, 'Confirmado', 'aprovado')}
              onReject={(id) => handleUpdate(id, 'Cancelado', 'rejeitado')}
              isUpdating={isUpdating}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

interface OrderItemProps {
  agendamento: Agendamento;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  isUpdating: boolean;
}

function OrderItem({
  agendamento,
  onApprove,
  onReject,
  isUpdating,
}: OrderItemProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={6}
      shadow="sm"
    >
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            Pet: {agendamento.pet.nome}
          </Text>
          <Text fontSize="sm" color={mutedTextColor}>
            {new Date(agendamento.dataHora).toLocaleString('pt-BR')} •{' '}
            {agendamento.pet.raca} ({agendamento.pet.porte})
          </Text>
        </Box>
        <Badge colorPalette="yellow">{agendamento.status}</Badge>
      </Flex>

      <Stack gap={3} borderTopWidth="1px" pt={4} borderColor={borderColor}>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Text fontWeight="medium">{agendamento.servico.nome}</Text>
            <Text fontSize="sm" color={mutedTextColor}>
              {agendamento.servico.descricao}
            </Text>
          </Box>
          <Text fontWeight="bold" fontSize="lg">
            R$ {agendamento.servico.preco.toFixed(2)}
          </Text>
        </Flex>

        <Flex gap={3} mt={2}>
          <Button
            onClick={() => onApprove(agendamento.id)}
            loading={isUpdating}
            colorPalette="green"
            flex={1}
            size="sm"
          >
            <Check size={16} style={{ marginRight: '8px' }} />
            Aprovar
          </Button>
          <Button
            onClick={() => onReject(agendamento.id)}
            loading={isUpdating}
            variant="outline"
            colorPalette="red"
            flex={1}
            size="sm"
          >
            <X size={16} style={{ marginRight: '8px' }} />
            Rejeitar
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
}
