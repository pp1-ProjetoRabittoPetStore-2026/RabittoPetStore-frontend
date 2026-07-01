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
      items: [{ label: 'Todos os profissionais', value: '' }, ...items],
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

  return (
    <Box minH="100vh" py={12} px={6}>
      <Helmet>
        <title>Rabitto Pet Store — Agenda</title>
      </Helmet>
      <Stack gap={8} maxW="1100px" mx="auto">
        {}
        <Flex
          justifyContent="space-between"
          alignItems={{ base: 'flex-start', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          gap={4}
        >
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

          <HStack
            gap={2}
            px={3}
            py={1}
            rounded="lg"
            borderWidth="1px"
            borderColor={tokens.inputBorder}
            bg={tokens.inputBg}
          >
            <CalendarDays size={18} color={tokens.textMuted} />
            <Input
              type="date"
              size="sm"
              width="170px"
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
        </Flex>

        {}
        <Flex
          wrap="wrap"
          gap={3}
          alignItems="center"
          p={4}
          rounded="xl"
          bg={tokens.panelBg}
          borderWidth="1px"
          borderColor={tokens.panelBorder}
        >
          <HStack
            gap={2}
            px={3}
            rounded="md"
            borderWidth="1px"
            borderColor={tokens.inputBorder}
            bg={tokens.inputBg}
            width={{ base: 'full', md: '240px' }}
          >
            <Search size={16} color={tokens.textMuted} />
            <Input
              placeholder="Buscar funcionário..."
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

          <FilterSelect
            collection={profissionalOptions}
            value={profissional}
            onChange={setProfissional}
            placeholder="Profissional"
            width="220px"
          />

          <FilterSelect
            collection={cargoOptions}
            value={cargo}
            onChange={setCargo}
            placeholder="Cargo"
            width="180px"
          />

          <FilterSelect
            collection={statusOptions}
            value={status}
            onChange={setStatus}
            placeholder="Status"
            width="180px"
          />

          <Button
            size="sm"
            variant="ghost"
            color={tokens.textMuted}
            onClick={() => {
              setCargo(['']);
              setStatus(['']);
              setProfissional(['']);
              setNome('');
              setData(todayISO());
            }}
          >
            Limpar filtros
          </Button>
        </Flex>

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

interface FilterSelectProps {
  collection: ListCollection<SelectItem>;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  width: string;
}

function FilterSelect({
  collection,
  value,
  onChange,
  placeholder,
  width,
}: FilterSelectProps) {
  return (
    <Select.Root
      collection={collection}
      size="sm"
      width={{ base: 'full', md: width }}
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
    { label: 'Todos os cargos', value: '' },
    { label: 'Veterinário', value: 'VETERINARIO' },
    { label: 'Tosador', value: 'TOSADOR' },
  ],
});

const statusOptions = createListCollection({
  items: [
    { label: 'Todos os status', value: '' },
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
