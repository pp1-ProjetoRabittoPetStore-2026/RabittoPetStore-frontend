'use client';

import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
  Button,
  Badge,
  Portal,
  Select,
  Table,
  HStack,
  createListCollection,
} from '@chakra-ui/react';
import { Check, X } from 'lucide-react';

import { toaster } from '@/components/ui/toaster';
import {
  useAgendamentosByStatus,
  useUpdateStatus,
} from '@/services/agendamentos/queries';
import type { Agendamento, ServicoStatus } from '@/services/agendamentos/types';
import { tokens } from '@/styles/tokens';

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
    <Box p="8">
      <Helmet>
        <title>Rabitto Pet Store — Agendamentos</title>
      </Helmet>
      <Flex justify="space-between" align="flex-end" mb="8" wrap="wrap" gap={4}>
        <Box>
          <Heading size="2xl" color={tokens.textPrimary}>
            Gerenciar Agendamentos
          </Heading>
          <Text color={tokens.textMuted} mt={1}>
            Acompanhe e atualize o status dos agendamentos da loja.
          </Text>
        </Box>

        <Select.Root
          collection={statusOptions}
          size="sm"
          width="240px"
          value={statusFilter}
          onValueChange={(details) => setStatusFilter(details.value)}
        >
          <Select.Label fontSize="xs" mb={1} color={tokens.textMuted}>
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

      <Box
        rounded="xl"
        overflow="hidden"
        bg={tokens.panelBg}
        borderWidth="1px"
        borderColor={tokens.panelBorder}
        color={tokens.textPrimary}
      >
        <Table.ScrollArea h="600px">
          <Table.Root
            size="md"
            stickyHeader
            bg="transparent"
            css={{
              '& td, & th': { bg: 'transparent', borderColor: tokens.panelBorder },
              '& tbody tr': { bg: 'transparent' },
              '& tbody tr:hover': { bg: tokens.panelBorder },
            }}
          >
            <Table.Header>
              <Table.Row bg={tokens.panelBorder}>
                <Table.ColumnHeader color={tokens.textMuted}>Pet</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted}>Cliente</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted}>Data/Hora</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted}>Serviços</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted} textAlign="end">Preço</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted}>Status</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted} textAlign="end">Ações</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={7} textAlign="center" py="10">
                    <Spinner />
                  </Table.Cell>
                </Table.Row>
              ) : error ? (
                <Table.Row>
                  <Table.Cell colSpan={7} textAlign="center" py="10">
                    <Text color={tokens.errorText} mb={3}>
                      Erro ao carregar dados
                    </Text>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                    >
                      Tentar novamente
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ) : agendamentos.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7} textAlign="center" py="16">
                    <Text fontSize="lg" fontWeight="medium" color={tokens.textPrimary}>
                      Nenhum agendamento encontrado
                    </Text>
                    <Text fontSize="sm" color={tokens.textMuted} mt={1}>
                      Não há registros com o status "{currentStatus}"
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                agendamentos.map((item) => (
                  <OrderRow
                    key={item.id}
                    agendamento={item}
                    onApprove={(id) => handleUpdate(id, 'Aguardando')}
                    onReject={(id) => handleUpdate(id, 'Rejeitado')}
                    isUpdating={isUpdating}
                  />
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
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

interface OrderRowProps {
  agendamento: Agendamento;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  isUpdating: boolean;
}

function getBadgePalette(status: string) {
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
}

function OrderRow({
  agendamento,
  onApprove,
  onReject,
  isUpdating,
}: OrderRowProps) {
  const total = agendamento.servicos.reduce(
    (sum, s) => sum + (s.preco ?? 0),
    0,
  );

  return (
    <Table.Row>
      <Table.Cell>
        <Text fontWeight="medium">{agendamento.pet.nome}</Text>
        <Text fontSize="xs" color={tokens.textMuted}>
          {agendamento.pet.raca}
        </Text>
      </Table.Cell>
      <Table.Cell>{agendamento.pet.tutor?.nome ?? 'Não informado'}</Table.Cell>
      <Table.Cell>
        {new Date(agendamento.dataHora).toLocaleString('pt-BR')}
      </Table.Cell>
      <Table.Cell>{agendamento.servicos.map((s) => s.nome).join(', ')}</Table.Cell>
      <Table.Cell textAlign="end" fontWeight="bold" color={tokens.accent}>
        R$ {total.toFixed(2)}
      </Table.Cell>
      <Table.Cell>
        <Badge variant="solid" colorPalette={getBadgePalette(agendamento.status)}>
          {agendamento.status}
        </Badge>
      </Table.Cell>
      <Table.Cell textAlign="end">
        {agendamento.status === 'Pendente' ? (
          <HStack gap="2" justify="flex-end">
            <Button
              onClick={() => onApprove(agendamento.id)}
              loading={isUpdating}
              colorPalette="green"
              size="sm"
            >
              <Check size={16} />
              Aprovar
            </Button>
            <Button
              onClick={() => onReject(agendamento.id)}
              loading={isUpdating}
              variant="outline"
              colorPalette="red"
              size="sm"
            >
              <X size={16} />
              Rejeitar
            </Button>
          </HStack>
        ) : (
          <Text fontSize="sm" color={tokens.textMuted}>
            —
          </Text>
        )}
      </Table.Cell>
    </Table.Row>
  );
}
