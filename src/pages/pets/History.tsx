import { Helmet } from 'react-helmet-async';
import { useMemo, useState, type CSSProperties } from 'react';
import {
  Box,
  Button,
  Collapsible,
  Flex,
  Input,
  Menu,
  Portal,
  Select,
  Spinner,
  Stack,
  Table,
  Text,
  createListCollection,
  type ListCollection,
} from '@chakra-ui/react';
import {
  useAgendamentos,
  useUpdateStatus,
} from '../../services/agendamentos/queries';
import type { Agendamento, ServicoStatus } from '@/services/agendamentos/types';
import { tokens } from '@/styles/tokens';

type SelectItem = { label: string; value: string };

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

const statusFilterOptions = createListCollection({
  items: [
    { label: 'Todos os status', value: '' },
    { label: 'Pendente', value: 'Pendente' },
    { label: 'Aguardando', value: 'Aguardando' },
    { label: 'Em Serviço', value: 'Em Serviço' },
    { label: 'Pronto', value: 'Pronto' },
    { label: 'Confirmado', value: 'Confirmado' },
    { label: 'Rejeitado', value: 'Rejeitado' },
    { label: 'Cancelado', value: 'Cancelado' },
  ],
});

export default function History() {
  const { data: agendamentos = [], isLoading, error } = useAgendamentos();
  const { mutate: updateStatus, isPending } = useUpdateStatus();

  const [pet, setPet] = useState<string[]>(['']);
  const [servico, setServico] = useState<string[]>(['']);
  const [status, setStatus] = useState<string[]>(['']);
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  function handleStatusChange(
    agendamento: Agendamento,
    newStatus: ServicoStatus,
  ) {
    if (newStatus === agendamento.status || isPending) return;
    updateStatus({ id: agendamento.id, status: newStatus });
  }

  const petOptions = useMemo(() => {
    const map = new Map<string, string>();
    agendamentos.forEach((a) => map.set(String(a.pet.id), a.pet.nome));
    return createListCollection({
      items: [
        { label: 'Todos os pets', value: '' },
        ...Array.from(map.entries()).map(([value, label]) => ({
          label,
          value,
        })),
      ],
    });
  }, [agendamentos]);

  const servicoOptions = useMemo(() => {
    const set = new Set<string>();
    agendamentos.forEach((a) => a.servicos.forEach((s) => set.add(s.nome)));
    return createListCollection({
      items: [
        { label: 'Todos os serviços', value: '' },
        ...Array.from(set).map((nome) => ({ label: nome, value: nome })),
      ],
    });
  }, [agendamentos]);

  const secondaryFilterCount = [pet[0], servico[0], dataInicio, dataFim].filter(
    Boolean,
  ).length;
  const hasAnyFilter = Boolean(status[0]) || secondaryFilterCount > 0;

  const filtered = useMemo(() => {
    const petId = pet[0];
    const svc = servico[0];
    const st = status[0];
    const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00`) : null;
    const fim = dataFim ? new Date(`${dataFim}T23:59:59`) : null;

    return agendamentos.filter((a) => {
      if (petId && String(a.pet.id) !== petId) return false;
      if (svc && !a.servicos.some((s) => s.nome === svc)) return false;
      if (st && a.status !== st) return false;
      const d = new Date(a.dataHora);
      if (inicio && d < inicio) return false;
      if (fim && d > fim) return false;
      return true;
    });
  }, [agendamentos, pet, servico, status, dataInicio, dataFim]);

  function clearFilters() {
    setPet(['']);
    setServico(['']);
    setStatus(['']);
    setDataInicio('');
    setDataFim('');
  }

  if (isLoading) {
    return (
      <Flex minH="60vh" align="center" justify="center" direction="column" gap={4}>
        <Spinner size="lg" />
        <Text color={tokens.textMuted}>Carregando histórico...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex minH="60vh" align="center" justify="center" direction="column" gap={2}>
        <Text fontSize="xl" fontWeight="semibold" color={tokens.textPrimary}>
          Erro ao carregar o histórico
        </Text>
        <Text color={tokens.errorText}>{(error as Error).message}</Text>
      </Flex>
    );
  }

  return (
    <Stack gap={6}>
      <Helmet>
        <title>Rabitto Pet Store — Histórico</title>
      </Helmet>
      <Box>
        <Text as="h1" fontSize="2xl" fontWeight="bold" color={tokens.textPrimary}>
          Histórico
        </Text>
        <Text color={tokens.textMuted} mt={1}>
          Acompanhe e atualize o status de cada serviço.
        </Text>
      </Box>

      <Collapsible.Root
        open={showMoreFilters}
        onOpenChange={(d) => setShowMoreFilters(d.open)}
      >
        <Box
          p={4}
          rounded="xl"
          bg={tokens.panelBg}
          borderWidth="1px"
          borderColor={tokens.panelBorder}
        >
          <Flex gap={3} wrap="wrap" align="center">
            <FilterSelect
              collection={statusFilterOptions}
              value={status}
              onChange={setStatus}
              placeholder="Status"
              width="180px"
            />

            <Collapsible.Trigger asChild>
              <Button
                size="sm"
                variant="outline"
                bg="transparent"
                borderColor={tokens.inputBorder}
                color={tokens.textMuted}
              >
                Mais filtros
                {secondaryFilterCount > 0 ? ` · ${secondaryFilterCount}` : ''}
                <ChevronDownIcon
                  style={{
                    transform: showMoreFilters ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                />
              </Button>
            </Collapsible.Trigger>

            {hasAnyFilter && (
              <Button
                size="sm"
                variant="ghost"
                color={tokens.textMuted}
                onClick={clearFilters}
              >
                Limpar filtros
              </Button>
            )}
          </Flex>

          <Collapsible.Content>
            <Flex gap={3} wrap="wrap" align="flex-end" pt={4}>
              <FilterSelect
                collection={petOptions}
                value={pet}
                onChange={setPet}
                placeholder="Pet"
                width="200px"
              />
              <FilterSelect
                collection={servicoOptions}
                value={servico}
                onChange={setServico}
                placeholder="Serviço"
                width="200px"
              />
              <Box>
                <Text fontSize="xs" color={tokens.textMuted} mb={1}>De</Text>
                <Input
                  type="date"
                  size="sm"
                  width="160px"
                  bg={tokens.inputBg}
                  borderColor={tokens.inputBorder}
                  color={tokens.textPrimary}
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="xs" color={tokens.textMuted} mb={1}>Até</Text>
                <Input
                  type="date"
                  size="sm"
                  width="160px"
                  bg={tokens.inputBg}
                  borderColor={tokens.inputBorder}
                  color={tokens.textPrimary}
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </Box>
            </Flex>
          </Collapsible.Content>
        </Box>
      </Collapsible.Root>

      {filtered.length === 0 ? (
        <Box
          textAlign="center"
          py={16}
          borderStyle="dashed"
          borderWidth="2px"
          borderColor={tokens.panelBorder}
          borderRadius="xl"
        >
          <Text fontSize="lg" color={tokens.textMuted}>
            Nenhum registro encontrado
          </Text>
          <Text fontSize="sm" color={tokens.textMuted} mt={1}>
            Ajuste os filtros para ver mais resultados
          </Text>
          {hasAnyFilter && (
            <Button
              size="sm"
              variant="outline"
              mt={4}
              borderColor={tokens.inputBorder}
              color={tokens.textMuted}
              onClick={clearFilters}
            >
              Limpar filtros
            </Button>
          )}
        </Box>
      ) : (
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
                '& td, & th': { bg: 'transparent', borderColor: tokens.panelBorder },
                '& tbody tr': { bg: 'transparent' },
                '& tbody tr:hover': { bg: tokens.panelBorder },
              }}
            >
              <Table.Header>
                <Table.Row bg={tokens.panelBorder}>
                  <Table.ColumnHeader color={tokens.textMuted} fontSize="xs" fontWeight="medium" letterSpacing="0.01em">Pet</Table.ColumnHeader>
                  <Table.ColumnHeader color={tokens.textMuted} fontSize="xs" fontWeight="medium" letterSpacing="0.01em">Cliente</Table.ColumnHeader>
                  <Table.ColumnHeader color={tokens.textMuted} fontSize="xs" fontWeight="medium" letterSpacing="0.01em">Serviço</Table.ColumnHeader>
                  <Table.ColumnHeader color={tokens.textMuted} fontSize="xs" fontWeight="medium" letterSpacing="0.01em">Data / Hora</Table.ColumnHeader>
                  <Table.ColumnHeader color={tokens.textMuted} fontSize="xs" fontWeight="medium" letterSpacing="0.01em">Status</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filtered.map((agendamento) => (
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
      )}
    </Stack>
  );
}

interface FilterSelectProps {
  collection: ListCollection<SelectItem>;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  width: string;
}

function FilterSelect({ collection, value, onChange, placeholder, width }: FilterSelectProps) {
  return (
    <Select.Root
      collection={collection}
      size="sm"
      width={{ base: 'full', md: width }}
      value={value}
      onValueChange={(details) => onChange(details.value)}
    >
      <Select.Control>
        <Select.Trigger bg={tokens.inputBg} borderColor={tokens.inputBorder} color={tokens.textPrimary}>
          <Select.ValueText placeholder={placeholder} />
        </Select.Trigger>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((item) => (
              <Select.Item item={item} key={item.value}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}

interface AgendamentoRowProps {
  agendamento: Agendamento;
  onStatusChange: (agendamento: Agendamento, status: ServicoStatus) => void;
  isDisabled: boolean;
}

function AgendamentoRow({ agendamento, onStatusChange, isDisabled }: AgendamentoRowProps) {
  const dataHora = new Date(agendamento.dataHora);

  return (
    <Table.Row>
      <Table.Cell py={4}>
        <Text fontWeight="semibold">{agendamento.pet.nome}</Text>
        <Text color={tokens.textMuted} fontSize="xs">
          {agendamento.pet.especie} • {agendamento.pet.raca}
        </Text>
      </Table.Cell>
      <Table.Cell py={4}>
        <Text fontSize="sm">{agendamento.pet.tutor?.nome ?? 'Não informado'}</Text>
      </Table.Cell>
      <Table.Cell py={4}>
        <Text fontSize="sm">{(agendamento.servicos ?? []).map((s) => s.nome).join(', ')}</Text>
      </Table.Cell>
      <Table.Cell py={4} whiteSpace="nowrap">
        <Text fontSize="sm" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {dataHora.toLocaleDateString('pt-BR')}
        </Text>
        <Text fontSize="xs" color={tokens.textMuted} style={{ fontVariantNumeric: 'tabular-nums' }}>
          {dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Table.Cell>
      <Table.Cell py={4}>
        <StatusControl
          agendamento={agendamento}
          onStatusChange={onStatusChange}
          isDisabled={isDisabled}
        />
      </Table.Cell>
    </Table.Row>
  );
}

interface StatusControlProps {
  agendamento: Agendamento;
  onStatusChange: (agendamento: Agendamento, status: ServicoStatus) => void;
  isDisabled: boolean;
}

function StatusControl({ agendamento, onStatusChange, isDisabled }: StatusControlProps) {
  const color = STATUS_COLOR[agendamento.status];
  const otherStatuses = STATUS_OPTIONS.filter((s) => s !== agendamento.status);

  return (
    <Menu.Root positioning={{ placement: 'bottom-start' }}>
      <Menu.Trigger asChild disabled={isDisabled || otherStatuses.length === 0}>
        <Box
          as="button"
          type="button"
          disabled={isDisabled || otherStatuses.length === 0}
          display="inline-flex"
          alignItems="center"
          gap={2}
          pl={3}
          pr={2}
          py="6px"
          rounded="full"
          borderWidth="1px"
          borderColor={`${color}.300`}
          bg={`${color}.100`}
          color={`${color}.700`}
          fontSize="xs"
          fontWeight="medium"
          cursor={isDisabled || otherStatuses.length === 0 ? 'default' : 'pointer'}
          opacity={isDisabled ? 0.6 : 1}
          transition="background 0.15s ease, border-color 0.15s ease"
          _hover={
            isDisabled || otherStatuses.length === 0
              ? {}
              : { borderColor: `${color}.400`, bg: `${color}.200` }
          }
          _focusVisible={{
            outline: '2px solid',
            outlineColor: tokens.accent,
            outlineOffset: '2px',
          }}
        >
          <Box w="6px" h="6px" rounded="full" bg={`${color}.500`} flexShrink={0} />
          {agendamento.status}
          {otherStatuses.length > 0 && !isDisabled && <ChevronDownIcon size={10} />}
        </Box>
      </Menu.Trigger>

      {otherStatuses.length > 0 && (
        <Portal>
          <Menu.Positioner>
            <Menu.Content
              minW="9.5rem"
              bg={tokens.panelBg}
              borderColor={tokens.panelBorder}
              borderWidth="1px"
              rounded="md"
              py={1}
              boxShadow="none"
            >
              {otherStatuses.map((s) => (
                <Menu.Item
                  key={s}
                  value={s}
                  onSelect={() => onStatusChange(agendamento, s)}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  fontSize="sm"
                  color={tokens.textPrimary}
                  _hover={{ bg: tokens.panelBorder }}
                >
                  <Box w="6px" h="6px" rounded="full" bg={`${STATUS_COLOR[s]}.500`} flexShrink={0} />
                  {s}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      )}
    </Menu.Root>
  );
}

function ChevronDownIcon({ size = 12, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      style={style}
    >
      <path
        d="M2 3.5L5 6.5L8 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
