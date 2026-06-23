'use client';

import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import {
  Box,
  Stack,
  Flex,
  Text,
  Spinner,
  Button,
  Badge,
  Portal,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import { Check, X } from 'lucide-react';

import { useColorModeValue } from '@/components/ui/color-mode';
import { toaster } from '@/components/ui/toaster';
import {
  useAgendamentosByStatus,
  useUpdateStatus,
} from '@/services/agendamentos/queries';
import type { Agendamento, ServicoStatus } from '@/services/agendamentos/types';

export default function ManagerOrdersPage() {
  

  const [statusFilter, setStatusFilter] = useState<string[]>(['Pendente']);

  

  const currentStatus = statusFilter[0] as ServicoStatus;
  const {
    data: agendamentos = [],
    isLoading,
    error,
  } = useAgendamentosByStatus(currentStatus);

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateStatus();

  const handleUpdate = (id: number, newStatus: ServicoStatus) => {
    updateStatus(
      { id, status: newStatus },
      {
        onSuccess: () => {
          toaster.create({
            title: `Sucesso`,
            description: `Agendamento movido para ${newStatus}.`,
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

  return (
    <Box minH="100vh" py={12} px={6}>
      <Helmet>
        <title>Rabitto Pet Store — Agendamentos</title>
      </Helmet>
      <Stack gap={8} maxW="800px" mx="auto">
        {}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          wrap="wrap"
          gap={4}
        >
          <Text fontSize="2xl" fontWeight="bold">
            Gerenciar Agendamentos
          </Text>

          <Select.Root
            collection={statusOptions}
            size="sm"
            width="240px"
            value={statusFilter}
            onValueChange={(details) => setStatusFilter(details.value)}
          >
            <Select.Label fontSize="xs" mb={1} color="gray.500">
              Filtrar por Status
            </Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Selecione o status" />
              </Select.Trigger>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {statusOptions.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Flex>

        {}
        {isLoading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="lg" />
            <Text mt={4} color="gray.500">
              Buscando agendamentos...
            </Text>
          </Box>
        ) : error ? (
          <Box textAlign="center" py={10}>
            <Text color="red.500">Erro ao carregar dados</Text>
            <Button
              mt={4}
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </Box>
        ) : agendamentos.length === 0 ? (
          <Box
            textAlign="center"
            py={20}
            borderStyle="dashed"
            borderWidth="2px"
            borderRadius="xl"
          >
            <Text fontSize="xl" color="gray.500">
              Nenhum agendamento encontrado
            </Text>
            <Text fontSize="sm" color="gray.400">
              Não há registros com o status "{currentStatus}"
            </Text>
          </Box>
        ) : (
          <Stack gap={4}>
            {agendamentos.map((item) => (
              <OrderItem
                key={item.id}
                agendamento={item}
                onApprove={(id) => handleUpdate(id, 'Aguardando')}
                onReject={(id) => handleUpdate(id, 'Rejeitado')}
                isUpdating={isUpdating}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}



const statusOptions = createListCollection({
  items: [
    { label: 'Pendente', value: 'Pendente' },
    { label: 'Aguardando', value: 'Aguardando' },
    { label: 'Em Serviço', value: 'Em Serviço' },
    { label: 'Pronto', value: 'Pronto' },
  ],
});

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

  

  const getBadgePalette = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'yellow';
      case 'Aguardando':
        return 'blue';
      case 'Em Serviço':
        return 'orange';
      case 'Pronto':
        return 'green';
      case 'Rejeitado':
      case 'Cancelado':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={6}
      shadow="sm"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
    >
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            Pet: {agendamento.pet.nome}
          </Text>
          <Text fontSize="sm" color="gray.600">
            Cliente: {agendamento.pet.tutor?.nome ?? 'Não informado'}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {new Date(agendamento.dataHora).toLocaleString('pt-BR')} •{' '}
            {agendamento.pet.raca}
          </Text>
        </Box>
        <Badge colorPalette={getBadgePalette(agendamento.status)}>
          {agendamento.status}
        </Badge>
      </Flex>

      <Stack gap={3} borderTopWidth="1px" pt={4} borderColor={borderColor}>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Text fontWeight="medium">{agendamento.servicos.map((s) => s.nome).join(', ')}</Text>
            <Text fontSize="xs" color="gray.500">
              Preço do serviço
            </Text>
          </Box>
          <Text fontWeight="bold" fontSize="lg" color="green.600">
            R$ {agendamento.servicos.reduce((total, s) => total + (s.preco ?? 0), 0).toFixed(2)}
          </Text>
        </Flex>

        {}
        {agendamento.status === 'Pendente' && (
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
        )}
      </Stack>
    </Box>
  );
}
