import { Helmet } from 'react-helmet-async';
import {
  Badge,
  Box,
  Flex,
  HStack,
  Spinner,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react';
import {
  useAgendamentos,
  useUpdateStatus,
} from '../../services/agendamentos/queries';
import type { Agendamento, ServicoStatus } from '@/services/agendamentos/types';
import { tokens } from '@/styles/tokens';

const STATUS_OPTIONS: ServicoStatus[] = [
  'Pendente',
  'Aguardando',
  'Em Serviço',
  'Pronto',
];

const STATUS_COLOR: Record<ServicoStatus, string> = {
  Pendente: 'gray',
  Aguardando: 'yellow',
  'Em Serviço': 'blue',
  Pronto: 'green',
  Confirmado: 'green',
  Rejeitado: 'red',
  Cancelado: 'red',
};

export default function History() {
  const { data: agendamentos = [], isLoading, error } = useAgendamentos();
  const { mutate: updateStatus, isPending } = useUpdateStatus();

  function handleStatusChange(
    agendamento: Agendamento,
    newStatus: ServicoStatus,
  ) {
    if (newStatus === agendamento.status || isPending) return;
    updateStatus({ id: agendamento.id, status: newStatus });
  }

  if (isLoading) {
    return (
      <Flex
        minH="60vh"
        align="center"
        justify="center"
        direction="column"
        gap={4}
      >
        <Spinner size="lg" />
        <Text color={tokens.textMuted}>Carregando histórico...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        minH="60vh"
        align="center"
        justify="center"
        direction="column"
        gap={2}
      >
        <Text fontSize="xl" fontWeight="semibold" color={tokens.textPrimary}>
          Erro ao carregar o histórico
        </Text>
        <Text color={tokens.errorText}>{(error as Error).message}</Text>
      </Flex>
    );
  }

  if (agendamentos.length === 0) {
    return (
      <Flex
        minH="60vh"
        align="center"
        justify="center"
        direction="column"
        gap={2}
      >
        <Text fontSize="xl" fontWeight="semibold" color={tokens.textPrimary}>
          Nenhum registro no histórico
        </Text>
        <Text color={tokens.textMuted}>
          Não há agendamentos cadastrados no momento.
        </Text>
      </Flex>
    );
  }

  return (
    <Stack gap={6}>
      <Helmet>
        <title>Rabitto Pet Store — Histórico</title>
      </Helmet>
      <Box>
        <Text fontSize="2xl" fontWeight="bold" color={tokens.textPrimary}>
          Histórico
        </Text>
        <Text color={tokens.textMuted} mt={1}>
          Acompanhe e atualize o status de cada serviço.
        </Text>
      </Box>

      <Box
        rounded="xl"
        overflow="hidden"
        bg={tokens.panelBg}
        borderWidth="1px"
        borderColor={tokens.panelBorder}
        color={tokens.textPrimary}
        opacity={isPending ? 0.7 : 1}
        transition="opacity 0.2s"
      >
        <Table.ScrollArea>
          <Table.Root
            size="md"
            bg="transparent"
            css={{
              '& td, & th': {
                bg: 'transparent',
                borderColor: tokens.panelBorder,
              },
              '& tbody tr': { bg: 'transparent' },
              '& tbody tr:hover': { bg: tokens.panelBorder },
            }}
          >
            <Table.Header>
              <Table.Row bg={tokens.panelBorder}>
                <Table.ColumnHeader color={tokens.textMuted}>Pet</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted}>Cliente</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted}>Serviço</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted}>Data / Hora</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted}>Status</Table.ColumnHeader>
                <Table.ColumnHeader color={tokens.textMuted} textAlign="end">Alterar</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {agendamentos.map((agendamento) => (
                <AgendamentoRow
                  key={agendamento.id}
                  agendamento={agendamento}
                  onStatusChange={handleStatusChange}
                  isDisabled={isPending}
                />
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
    </Stack>
  );
}

interface AgendamentoRowProps {
  agendamento: Agendamento;
  onStatusChange: (agendamento: Agendamento, status: ServicoStatus) => void;
  isDisabled: boolean;
}

function AgendamentoRow({
  agendamento,
  onStatusChange,
  isDisabled,
}: AgendamentoRowProps) {
  const dataHora = new Date(agendamento.dataHora);

  return (
    <Table.Row>
      <Table.Cell>
        <Text fontWeight="semibold">{agendamento.pet.nome}</Text>
        <Text color={tokens.textMuted} fontSize="xs">
          {agendamento.pet.especie} • {agendamento.pet.raca}
        </Text>
      </Table.Cell>
      <Table.Cell>
        <Text fontSize="sm">
          {agendamento.pet.tutor?.nome ?? 'Não informado'}
        </Text>
      </Table.Cell>
      <Table.Cell>
        <Text fontSize="sm">{(agendamento.servicos ?? []).map((s) => s.nome).join(', ')}</Text>
      </Table.Cell>
      <Table.Cell whiteSpace="nowrap">
        <Text fontSize="sm">{dataHora.toLocaleDateString('pt-BR')}</Text>
        <Text fontSize="xs" color={tokens.textMuted}>
          {dataHora.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </Table.Cell>
      <Table.Cell>
        <Badge
          colorPalette={STATUS_COLOR[agendamento.status]}
          variant="solid"
          size="md"
        >
          {agendamento.status}
        </Badge>
      </Table.Cell>
      <Table.Cell>
        <HStack gap={1} wrap="wrap" justify="flex-end">
          {STATUS_OPTIONS.map((status) => (
            <StatusButton
              key={status}
              label={status}
              isActive={agendamento.status === status}
              isDisabled={isDisabled}
              onClick={() => onStatusChange(agendamento, status)}
            />
          ))}
        </HStack>
      </Table.Cell>
    </Table.Row>
  );
}

interface StatusButtonProps {
  label: ServicoStatus;
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

function StatusButton({
  label,
  isActive,
  isDisabled,
  onClick,
}: StatusButtonProps) {
  const color = STATUS_COLOR[label];

  return (
    <Box
      as="button"
      onClick={onClick}
      px={2}
      py={1}
      fontSize="xs"
      fontWeight="medium"
      borderRadius="md"
      borderWidth="1px"
      cursor={isActive || isDisabled ? 'default' : 'pointer'}
      bg={isActive ? `${color}.100` : 'transparent'}
      borderColor={isActive ? `${color}.400` : tokens.inputBorder}
      color={isActive ? `${color}.700` : tokens.textMuted}
      _hover={
        isActive || isDisabled
          ? {}
          : {
              bg: `${color}.50`,
              borderColor: `${color}.300`,
              color: `${color}.700`,
            }
      }
      transition="all 0.15s"
      whiteSpace="nowrap"
    >
      {label}
    </Box>
  );
}
