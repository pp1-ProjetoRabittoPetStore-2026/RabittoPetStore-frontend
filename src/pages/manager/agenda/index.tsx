'use client';

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
} from '@chakra-ui/react';
import { CalendarDays, Clock, PawPrint, Stethoscope } from 'lucide-react';

import { useColorModeValue } from '@/components/ui/color-mode';
import { useAgenda } from '@/services/agenda/queries';
import type { AgendaFuncionario } from '@/services/agenda/types';
import type { Agendamento } from '@/services/agendamentos/types';

// yyyy-MM-dd no fuso local (input type=date e @RequestParam LocalDate)
function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export default function ManagerAgendaPage() {
  const [data, setData] = useState<string>(todayISO());
  const { data: agenda = [], isLoading, error } = useAgenda(data);

  return (
    <Box minH="100vh" py={12} px={6}>
      <Stack gap={8} maxW="900px" mx="auto">
        {/* Cabeçalho e seletor de data */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          wrap="wrap"
          gap={4}
        >
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              Agenda da Equipe
            </Text>
            <Text fontSize="sm" color="gray.500">
              Atendimentos por funcionário (09h–17h)
            </Text>
          </Box>

          <HStack gap={2}>
            <CalendarDays size={18} color="gray" />
            <Input
              type="date"
              size="sm"
              width="180px"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </HStack>
        </Flex>

        {/* Conteúdo */}
        {isLoading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="lg" />
            <Text mt={4} color="gray.500">
              Carregando agenda...
            </Text>
          </Box>
        ) : error ? (
          <Box textAlign="center" py={10}>
            <Text color="red.500">Erro ao carregar a agenda</Text>
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
            borderRadius="xl"
          >
            <Text fontSize="xl" color="gray.500">
              Nenhum funcionário disponível
            </Text>
            <Text fontSize="sm" color="gray.400">
              Não há veterinários ou banhistas ativos para esta data
            </Text>
          </Box>
        ) : (
          <Stack gap={6}>
            {agenda.map((item) => (
              <FuncionarioAgendaCard
                key={item.funcionario.id}
                item={item}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

interface FuncionarioAgendaCardProps {
  item: AgendaFuncionario;
}

function FuncionarioAgendaCard({ item }: FuncionarioAgendaCardProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { funcionario, agendamentos } = item;

  const isVet = (funcionario.cargo ?? '')
    .toLowerCase()
    .includes('veterin');

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={6}
      shadow="sm"
    >
      {/* Cabeçalho do funcionário */}
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <HStack gap={3}>
          {isVet ? <Stethoscope size={20} /> : <PawPrint size={20} />}
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              {funcionario.nome}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {funcionario.cargo}
            </Text>
          </Box>
        </HStack>
        <Badge colorPalette={agendamentos.length > 0 ? 'blue' : 'gray'}>
          {agendamentos.length}{' '}
          {agendamentos.length === 1 ? 'agendamento' : 'agendamentos'}
        </Badge>
      </Flex>

      {/* Lista de agendamentos */}
      {agendamentos.length === 0 ? (
        <Text
          fontSize="sm"
          color="gray.400"
          borderTopWidth="1px"
          borderColor={borderColor}
          pt={4}
        >
          Nenhum atendimento agendado para o dia.
        </Text>
      ) : (
        <Stack
          gap={3}
          borderTopWidth="1px"
          pt={4}
          borderColor={borderColor}
        >
          {agendamentos.map((ag) => (
            <AgendamentoRow key={ag.id} agendamento={ag} />
          ))}
        </Stack>
      )}
    </Box>
  );
}

function AgendamentoRow({ agendamento }: { agendamento: Agendamento }) {
  const hora = new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <HStack gap={3}>
        <HStack gap={1} color="gray.500" minW="64px">
          <Clock size={14} />
          <Text fontSize="sm" fontWeight="medium">
            {hora}
          </Text>
        </HStack>
        <Box>
          <Text fontWeight="medium">{agendamento.pet.nome}</Text>
          <Text fontSize="xs" color="gray.500">
            {agendamento.servico.nome}
          </Text>
        </Box>
      </HStack>
      <Badge colorPalette={getBadgePalette(agendamento.status)}>
        {agendamento.status}
      </Badge>
    </Flex>
  );
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
