'use client';

import { Helmet } from 'react-helmet-async';
import { useMemo, useState } from 'react';
import {
  Box,
  Stack,
  Flex,
  Text,
  Spinner,
  Button,
  Badge,
  HStack,
  Input,
  SimpleGrid,
  Portal,
  Select,
  createListCollection,
  type ListCollection,
} from '@chakra-ui/react';

type SelectItem = { label: string; value: string };
import {
  CalendarDays,
  Clock,
  PawPrint,
  Stethoscope,
  Search,
  Users,
  X,
} from 'lucide-react';

import { useAgenda } from '@/services/agenda/queries';
import { useEmployees } from '@/services/employee/queries';
import type { AgendaFuncionario } from '@/services/agenda/types';
import { tokens } from '@/styles/tokens';

function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function isVetCargo(cargo?: string): boolean {
  return (cargo ?? '').toLowerCase().includes('veterin');
}

function isTosadorCargo(cargo?: string): boolean {
  const c = (cargo ?? '').toLowerCase();
  return c.includes('tosad') || c.includes('banhist');
}

export default function ManagerAgendaPage() {
  const [data, setData] = useState<string>(todayISO());
  const [cargo, setCargo] = useState<string[]>(['']);
  const [status, setStatus] = useState<string[]>(['']);
  const [profissional, setProfissional] = useState<string[]>(['']);
  const [nome, setNome] = useState<string>('');

  const { data: employees = [] } = useEmployees();

  const {
    data: agenda = [],
    isLoading,
    error,
  } = useAgenda({
    data,
    cargo: cargo[0] || undefined,
    status: status[0] || undefined,
    nome: nome || undefined,
  });


  const profissionalOptions = useMemo(() => {
    const items = employees
      .filter((e) => e.ativo !== false)
      .filter((e) => isVetCargo(e.cargo) || isTosadorCargo(e.cargo))
      .map((e) => ({ label: e.nome, value: String(e.id) }));
    return createListCollection({
      items: [{ label: 'Todos', value: '' }, ...items],
    });
  }, [employees]);


  const agendaFiltrada = useMemo(() => {
    const selectedId = profissional[0];
    if (!selectedId) return agenda;
    return agenda.filter(
      (item) => String(item.funcionario.id) === selectedId,
    );
  }, [agenda, profissional]);

  const totalAtendimentos = useMemo(
    () => agendaFiltrada.reduce((sum, i) => sum + i.agendamentos.length, 0),
    [agendaFiltrada],
  );

  const isDefaultDate = data === todayISO();
  const activeFilterCount = [
    !isDefaultDate,
    !!profissional[0],
    !!cargo[0],
    !!status[0],
    !!nome,
  ].filter(Boolean).length;

  function limparFiltros() {
    setCargo(['']);
    setStatus(['']);
    setProfissional(['']);
    setNome('');
    setData(todayISO());
  }

  return (
    <Box minH="100vh" py={12} px={6}>
      <Helmet>
        <title>Rabitto Pet Store — Agenda</title>
      </Helmet>
      <Stack gap={8} maxW="1100px" mx="auto">
        {}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={tokens.textPrimary}>
            Agenda da Equipe
          </Text>
          <Text fontSize="sm" color={tokens.textMuted}>
            {totalAtendimentos} atendimento{totalAtendimentos === 1 ? '' : 's'}{' '}
            • {agendaFiltrada.length} profissional
            {agendaFiltrada.length === 1 ? '' : 'is'} (09h–17h)
          </Text>
        </Box>

        {}
        <Stack
          gap={3}
          p={4}
          rounded="xl"
          bg={tokens.panelBg}
          borderWidth="1px"
          borderColor={tokens.panelBorder}
        >
          <Flex wrap="wrap" gap={4} align="flex-end">
            <FilterField label="Data" width="170px">
              <HStack
                gap={2}
                px={3}
                rounded="md"
                borderWidth="1px"
                borderColor={tokens.inputBorder}
                bg={tokens.inputBg}
              >
                <CalendarDays size={16} color={tokens.textMuted} />
                <Input
                  type="date"
                  size="sm"
                  variant="subtle"
                  bg="transparent"
                  border="none"
                  px={0}
                  color={tokens.textPrimary}
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  _focusVisible={{ outline: 'none', boxShadow: 'none' }}
                />
              </HStack>
            </FilterField>

            <FilterField label="Funcionário" width="220px">
              <HStack
                gap={2}
                px={3}
                rounded="md"
                borderWidth="1px"
                borderColor={tokens.inputBorder}
                bg={tokens.inputBg}
              >
                <Search size={16} color={tokens.textMuted} />
                <Input
                  placeholder="Buscar por nome..."
                  size="sm"
                  variant="subtle"
                  bg="transparent"
                  border="none"
                  px={0}
                  color={tokens.textPrimary}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  _focusVisible={{ outline: 'none', boxShadow: 'none' }}
                />
              </HStack>
            </FilterField>

            <FilterField label="Profissional" width="220px">
              <FilterSelect
                collection={profissionalOptions}
                value={profissional}
                onChange={setProfissional}
                placeholder="Todos"
              />
            </FilterField>

            <FilterField label="Cargo" width="160px">
              <FilterSelect
                collection={cargoOptions}
                value={cargo}
                onChange={setCargo}
                placeholder="Todos"
              />
            </FilterField>

            <FilterField label="Status" width="160px">
              <FilterSelect
                collection={statusOptions}
                value={status}
                onChange={setStatus}
                placeholder="Todos"
              />
            </FilterField>
          </Flex>

          <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
            <Text fontSize="xs" color={tokens.textMuted}>
              {activeFilterCount > 0
                ? `${activeFilterCount} filtro${activeFilterCount === 1 ? '' : 's'} ativo${activeFilterCount === 1 ? '' : 's'}`
                : 'Nenhum filtro ativo'}
            </Text>
            {activeFilterCount > 0 && (
              <Button
                size="xs"
                variant="ghost"
                color={tokens.textMuted}
                onClick={limparFiltros}
              >
                <X size={13} />
                Limpar filtros
              </Button>
            )}
          </Flex>
        </Stack>

        {}
        {isLoading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="lg" />
            <Text mt={4} color={tokens.textMuted}>
              Carregando agenda...
            </Text>
          </Box>
        ) : error ? (
          <Box textAlign="center" py={10}>
            <Text color={tokens.errorText}>Erro ao carregar a agenda</Text>
            <Button
              mt={4}
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </Box>
        ) : agendaFiltrada.length === 0 ? (
          <Box
            textAlign="center"
            py={20}
            borderStyle="dashed"
            borderWidth="2px"
            borderColor={tokens.panelBorder}
            borderRadius="xl"
          >
            <Flex justify="center" mb={3} color={tokens.textMuted}>
              <Users size={32} />
            </Flex>
            <Text fontSize="xl" color={tokens.textMuted}>
              Nenhum profissional encontrado
            </Text>
            <Text fontSize="sm" color={tokens.textMuted}>
              Ajuste os filtros ou selecione outra data
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
            {agendaFiltrada.map((item) => (
              <FuncionarioCard key={item.funcionario.id} item={item} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Box>
  );
}

interface FilterFieldProps {
  label: string;
  width: string;
  children: React.ReactNode;
}

function FilterField({ label, width, children }: FilterFieldProps) {
  return (
    <Box minW={0} width={{ base: 'full', md: width }}>
      <Text
        fontSize="xs"
        fontWeight="medium"
        color={tokens.textMuted}
        mb={1}
      >
        {label}
      </Text>
      {children}
    </Box>
  );
}

interface FilterSelectProps {
  collection: ListCollection<SelectItem>;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}

function FilterSelect({
  collection,
  value,
  onChange,
  placeholder,
}: FilterSelectProps) {
  return (
    <Select.Root
      collection={collection}
      size="sm"
      width="full"
      value={value}
      onValueChange={(details) => onChange(details.value)}
    >
      <Select.Control>
        <Select.Trigger
          bg={tokens.inputBg}
          borderColor={tokens.inputBorder}
          color={tokens.textPrimary}
        >
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

const cargoOptions = createListCollection({
  items: [
    { label: 'Todos', value: '' },
    { label: 'Veterinário', value: 'VETERINARIO' },
    { label: 'Tosador', value: 'TOSADOR' },
  ],
});

const statusOptions = createListCollection({
  items: [
    { label: 'Todos', value: '' },
    { label: 'Pendente', value: 'Pendente' },
    { label: 'Aguardando', value: 'Aguardando' },
    { label: 'Em Serviço', value: 'Em Serviço' },
    { label: 'Pronto', value: 'Pronto' },
    { label: 'Confirmado', value: 'Confirmado' },
    { label: 'Cancelado', value: 'Cancelado' },
    { label: 'Rejeitado', value: 'Rejeitado' },
  ],
});

interface FuncionarioCardProps {
  item: AgendaFuncionario;
}

function FuncionarioCard({ item }: FuncionarioCardProps) {
  const { funcionario, agendamentos } = item;
  const isVet = isVetCargo(funcionario.cargo);

  return (
    <Box
      rounded="xl"
      bg={tokens.panelBg}
      borderWidth="1px"
      borderColor={tokens.panelBorder}
      color={tokens.textPrimary}
      p={5}
      transition="transform 0.15s, box-shadow 0.15s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
    >
      {}
      <Flex justify="space-between" align="center" mb={4}>
        <HStack gap={3}>
          <Flex
            w={9}
            h={9}
            rounded="full"
            align="center"
            justify="center"
            bg={isVet ? 'blue.subtle' : 'orange.subtle'}
            color={isVet ? 'blue.fg' : 'orange.fg'}
          >
            {isVet ? <Stethoscope size={18} /> : <PawPrint size={18} />}
          </Flex>
          <Box>
            <Text fontWeight="semibold" lineHeight="1.2">
              {funcionario.nome}
            </Text>
            <Text fontSize="xs" color={tokens.textMuted}>
              {funcionario.cargo}
            </Text>
          </Box>
        </HStack>
        <Badge
          variant="subtle"
          colorPalette={agendamentos.length > 0 ? 'blue' : 'gray'}
        >
          {agendamentos.length}
        </Badge>
      </Flex>

      {}
      {agendamentos.length === 0 ? (
        <Text
          fontSize="sm"
          color={tokens.textMuted}
          textAlign="center"
          py={3}
        >
          Sem atendimentos
        </Text>
      ) : (
        <Stack gap={2}>
          {agendamentos.map((ag) => (
            <Flex
              key={ag.id}
              align="center"
              justify="space-between"
              gap={2}
              px={3}
              py={2}
              rounded="md"
              borderWidth="1px"
              borderColor={tokens.panelBorder}
            >
              <HStack gap={2} minW={0}>
                <Clock size={13} color={tokens.textMuted} />
                <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap">
                  {formatHora(ag.dataHora)}
                </Text>
                <Text fontSize="xs" color={tokens.textMuted} truncate>
                  {ag.pet.nome}
                  {ag.pet.tutor?.nome ? ` · ${ag.pet.tutor.nome}` : ''}
                </Text>
              </HStack>
              <Badge
                size="sm"
                variant="subtle"
                colorPalette={getBadgePalette(ag.status)}
              >
                {ag.status}
              </Badge>
            </Flex>
          ))}
        </Stack>
      )}
    </Box>
  );
}

function formatHora(dataHora: string): string {
  return new Date(dataHora).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getBadgePalette(status: string): string {
  switch (status) {
    case 'Pendente':
      return 'yellow';
    case 'Aguardando':
      return 'blue';
    case 'Em Serviço':
      return 'orange';
    case 'Pronto':
    case 'Confirmado':
      return 'green';
    case 'Cancelado':
    case 'Rejeitado':
      return 'red';
    default:
      return 'gray';
  }
}
