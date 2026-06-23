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
  HStack,
  Input,
  Table,
  Portal,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import {
  CalendarDays,
  Clock,
  PawPrint,
  Stethoscope,
  Search,
} from 'lucide-react';

import { useAgenda } from '@/services/agenda/queries';
import type { AgendaFuncionario } from '@/services/agenda/types';
import { tokens } from '@/styles/tokens';



function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export default function ManagerAgendaPage() {
  const [data, setData] = useState<string>(todayISO());
  const [cargo, setCargo] = useState<string[]>(['']);
  const [status, setStatus] = useState<string[]>(['']);
  const [nome, setNome] = useState<string>('');

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

  return (
    <Box minH="100vh" py={12} px={6}>
      <Helmet>
        <title>Rabitto Pet Store — Agenda</title>
      </Helmet>
      <Stack gap={8}>
        {}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          wrap="wrap"
          gap={4}
        >
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color={tokens.textPrimary}>
              Agenda da Equipe
            </Text>
            <Text fontSize="sm" color={tokens.textMuted}>
              Atendimentos por funcionário (09h–17h)
            </Text>
          </Box>

          <HStack gap={2}>
            <CalendarDays size={18} color={tokens.textMuted} />
            <Input
              type="date"
              size="sm"
              width="180px"
              value={data}
              bg={tokens.inputBg}
              borderColor={tokens.inputBorder}
              color={tokens.textPrimary}
              onChange={(e) => setData(e.target.value)}
            />
          </HStack>
        </Flex>

        {}
        <Flex wrap="wrap" gap={3} alignItems="flex-end">
          <HStack
            gap={2}
            px={3}
            rounded="md"
            borderWidth="1px"
            borderColor={tokens.inputBorder}
            bg={tokens.inputBg}
            width={{ base: 'full', md: '260px' }}
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

          <Select.Root
            collection={cargoOptions}
            size="sm"
            width="200px"
            value={cargo}
            onValueChange={(details) => setCargo(details.value)}
          >
            <Select.Control>
              <Select.Trigger
                bg={tokens.inputBg}
                borderColor={tokens.inputBorder}
                color={tokens.textPrimary}
              >
                <Select.ValueText placeholder="Cargo" />
              </Select.Trigger>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {cargoOptions.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Select.Root
            collection={statusOptions}
            size="sm"
            width="200px"
            value={status}
            onValueChange={(details) => setStatus(details.value)}
          >
            <Select.Control>
              <Select.Trigger
                bg={tokens.inputBg}
                borderColor={tokens.inputBorder}
                color={tokens.textPrimary}
              >
                <Select.ValueText placeholder="Status" />
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
        ) : agenda.length === 0 ? (
          <Box
            textAlign="center"
            py={20}
            borderStyle="dashed"
            borderWidth="2px"
            borderColor={tokens.panelBorder}
            borderRadius="xl"
          >
            <Text fontSize="xl" color={tokens.textMuted}>
              Nenhum funcionário disponível
            </Text>
            <Text fontSize="sm" color={tokens.textMuted}>
              Não há veterinários ou banhistas ativos para esta data
            </Text>
          </Box>
        ) : (
          <Box
            rounded="xl"
            overflow="hidden"
            bg={tokens.panelBg}
            borderWidth="1px"
            borderColor={tokens.panelBorder}
            color={tokens.textPrimary}
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
                    <Table.ColumnHeader color={tokens.textMuted}>Funcionário</Table.ColumnHeader>
                    <Table.ColumnHeader color={tokens.textMuted}>Cargo</Table.ColumnHeader>
                    <Table.ColumnHeader color={tokens.textMuted}>Atendimentos</Table.ColumnHeader>
                    <Table.ColumnHeader color={tokens.textMuted}>Horários</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {agenda.map((item) => (
                    <FuncionarioRow key={item.funcionario.id} item={item} />
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </Box>
        )}
      </Stack>
    </Box>
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

interface FuncionarioRowProps {
  item: AgendaFuncionario;
}

function FuncionarioRow({ item }: FuncionarioRowProps) {
  const { funcionario, agendamentos } = item;

  const isVet = (funcionario.cargo ?? '')
    .toLowerCase()
    .includes('veterin');

  return (
    <Table.Row>
      <Table.Cell>
        <HStack gap={3}>
          {isVet ? <Stethoscope size={18} /> : <PawPrint size={18} />}
          <Text fontWeight="medium">{funcionario.nome}</Text>
        </HStack>
      </Table.Cell>
      <Table.Cell>
        <Text fontSize="sm" color={tokens.textMuted}>
          {funcionario.cargo}
        </Text>
      </Table.Cell>
      <Table.Cell>
        <Badge
          variant="subtle"
          colorPalette={agendamentos.length > 0 ? 'blue' : 'gray'}
        >
          {agendamentos.length}{' '}
          {agendamentos.length === 1 ? 'agendamento' : 'agendamentos'}
        </Badge>
      </Table.Cell>
      <Table.Cell>
        {agendamentos.length === 0 ? (
          <Text fontSize="sm" color={tokens.textMuted}>
            —
          </Text>
        ) : (
          <HStack gap={2} wrap="wrap">
            {agendamentos.map((ag) => (
              <HStack
                key={ag.id}
                gap={1}
                px={2}
                py={1}
                rounded="md"
                borderWidth="1px"
                borderColor={tokens.panelBorder}
                color={tokens.textMuted}
              >
                <Clock size={12} />
                <Text fontSize="xs" fontWeight="medium">
                  {formatHora(ag.dataHora)}
                </Text>
                <Text fontSize="xs">· {ag.pet.nome}</Text>
                <Badge
                  size="sm"
                  variant="subtle"
                  colorPalette={getBadgePalette(ag.status)}
                >
                  {ag.status}
                </Badge>
              </HStack>
            ))}
          </HStack>
        )}
      </Table.Cell>
    </Table.Row>
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
      return 'red';
    default:
      return 'gray';
  }
}
