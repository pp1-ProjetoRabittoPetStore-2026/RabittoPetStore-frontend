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
} from '@chakra-ui/react';
import { CalendarDays, Clock, PawPrint, Stethoscope } from 'lucide-react';

import { useColorModeValue } from '@/components/ui/color-mode';
import { useVetAgenda } from '@/services/vet/queries';
import type { Agendamento } from '@/services/agendamentos/types';



function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}



export default function VetAgendaPage() {
  const [data, setData] = useState<string>(todayISO());
  const { data: consultas = [], isLoading, error } = useVetAgenda(data);

  return (
    <Box minH="100vh" py={12} px={6}>
      <Helmet>
        <title>Rabitto Pet Store — Consultas</title>
      </Helmet>
      <Stack gap={8} maxW="760px" mx="auto">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          wrap="wrap"
          gap={4}
        >
          <HStack gap={3}>
            <Stethoscope size={22} />
            <Box>
              <Text fontSize="2xl" fontWeight="bold">
                Minhas Consultas
              </Text>
              <Text fontSize="sm" color="gray.500">
                Agenda médica do dia (ordem cronológica)
              </Text>
            </Box>
          </HStack>

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

        {isLoading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="lg" />
            <Text mt={4} color="gray.500">
              Carregando consultas...
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
        ) : consultas.length === 0 ? (
          <Box
            textAlign="center"
            py={20}
            borderStyle="dashed"
            borderWidth="2px"
            borderRadius="xl"
          >
            <Text fontSize="xl" color="gray.500">
              Nenhuma consulta agendada
            </Text>
            <Text fontSize="sm" color="gray.400">
              Você não tem consultas marcadas para esta data
            </Text>
          </Box>
        ) : (
          <Stack gap={3}>
            {consultas.map((c) => (
              <ConsultaRow key={c.id} agendamento={c} />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

function ConsultaRow({ agendamento }: { agendamento: Agendamento }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const hora = new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={5}
      shadow="sm"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <HStack gap={4}>
          <HStack gap={1} color="gray.500" minW="64px">
            <Clock size={15} />
            <Text fontSize="sm" fontWeight="semibold">
              {hora}
            </Text>
          </HStack>
          <HStack gap={2}>
            <PawPrint size={16} />
            <Box>
              <Text fontWeight="medium">{agendamento.pet.nome}</Text>
              <Text fontSize="xs" color="gray.500">
                {agendamento.servicos.map((s) => s.nome).join(', ')}
              </Text>
            </Box>
          </HStack>
        </HStack>
        <Badge colorPalette="green">{agendamento.status}</Badge>
      </Flex>
    </Box>
  );
}
