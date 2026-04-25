import {
  Badge,
  Box,
  Flex,
  HStack,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  useAgendamentos,
  useUpdateStatus,
} from '../../services/agendamentos/queries';
import type { Agendamento, ServicoStatus } from '@/services/agendamentos/types';

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
};

export default function StatusPet() {
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
        <Text color="fg.muted">Carregando serviços...</Text>
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
        <Text fontSize="xl" fontWeight="semibold">
          Erro ao carregar serviços
        </Text>
        <Text color="fg.muted">{(error as Error).message}</Text>
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
        <Text fontSize="xl" fontWeight="semibold">
          Nenhum serviço agendado
        </Text>
        <Text color="fg.muted">
          Não há agendamentos cadastrados no momento.
        </Text>
      </Flex>
    );
  }

  return (
    <Stack gap={6}>
      <Box>
        <Text fontSize="2xl" fontWeight="bold">
          Controle de Serviços
        </Text>
        <Text color="fg.muted" mt={1}>
          Gerencie o status de cada serviço em tempo real.
        </Text>
      </Box>

      <Stack gap={3}>
        {agendamentos.map((agendamento) => (
          <AgendamentoCard
            key={agendamento.id}
            agendamento={agendamento}
            onStatusChange={handleStatusChange}
            isDisabled={isPending}
          />
        ))}
      </Stack>
    </Stack>
  );
}

interface AgendamentoCardProps {
  agendamento: Agendamento;
  onStatusChange: (agendamento: Agendamento, status: ServicoStatus) => void;
  isDisabled: boolean;
}

function AgendamentoCard({
  agendamento,
  onStatusChange,
  isDisabled,
}: AgendamentoCardProps) {
  const dataHora = new Date(agendamento.dataHora);

  return (
    <Box
      bg="bg"
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      opacity={isDisabled ? 0.7 : 1}
      transition="opacity 0.2s"
    >
      <Flex justify="space-between" align="flex-start" wrap="wrap" gap={3}>
        <Stack gap={0.5} flex={1} minW="0">
          <HStack gap={2} wrap="wrap">
            <Text fontWeight="semibold" fontSize="md">
              {agendamento.pet.nome}
            </Text>
            <Text color="fg.muted" fontSize="sm">
              {agendamento.pet.especie} • {agendamento.pet.raca}
            </Text>
          </HStack>
          <Text fontSize="sm" color="fg.muted">
            {agendamento.servico.nome}
          </Text>
          <Text fontSize="xs" color="fg.subtle">
            {dataHora.toLocaleDateString('pt-BR')} às{' '}
            {dataHora.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </Stack>

        <Stack gap={2} align="flex-end">
          <Badge
            colorPalette={STATUS_COLOR[agendamento.status]}
            variant="solid"
            size="md"
          >
            {agendamento.status}
          </Badge>

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
        </Stack>
      </Flex>
    </Box>
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
      borderColor={isActive ? `${color}.400` : 'border'}
      color={isActive ? `${color}.700` : 'fg.muted'}
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
