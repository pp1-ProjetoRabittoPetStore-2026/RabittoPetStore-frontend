import { Link as RouterLink } from 'react-router';
import {
  Box,
  Flex,
  Grid,
  Heading,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ChevronRight } from 'lucide-react';
import { useAgendamentos } from '../../services/agendamentos/queries';
import { useEmployees } from '../../services/employee/queries';
import { tokens } from '../../styles/tokens';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function formatDate(): string {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

interface StatBlockProps {
  label: string;
  value: number;
  loading: boolean;
}

function StatBlock({ label, value, loading }: StatBlockProps) {
  return (
    <Stack gap="2">
      {loading ? (
        <Skeleton h="12" w="14" borderRadius="sm" />
      ) : (
        <Text
          fontSize="48px"
          fontWeight="700"
          color={tokens.accent}
          lineHeight="1"
          letterSpacing="-0.02em"
          fontVariantNumeric="tabular-nums"
        >
          {value}
        </Text>
      )}
      <Text
        fontSize="11px"
        fontWeight="500"
        color={tokens.textMuted}
        textTransform="uppercase"
        letterSpacing="0.1em"
      >
        {label}
      </Text>
    </Stack>
  );
}

interface NavItemProps {
  to: string;
  label: string;
  description: string;
}

function NavItem({ to, label, description }: NavItemProps) {
  return (
    <Flex
      as={RouterLink}
      to={to}
      align="center"
      justify="space-between"
      gap="4"
      py="4"
      px="2"
      mx="-2"
      borderBottom="1px solid"
      borderColor={tokens.panelBorder}
      textDecoration="none"
      borderRadius="sm"
      _hover={{ bg: tokens.panelBg }}
      _last={{ borderBottom: 'none' }}
      transition="background 120ms ease-out"
    >
      <Stack gap="0.5" flex="1">
        <Text
          fontWeight="600"
          fontSize="14px"
          color={tokens.textPrimary}
          lineHeight="1.3"
        >
          {label}
        </Text>
        <Text fontSize="12px" color={tokens.textMuted} lineHeight="1.4">
          {description}
        </Text>
      </Stack>
      <Box color={tokens.textMuted} flexShrink="0">
        <ChevronRight size={14} />
      </Box>
    </Flex>
  );
}

export default function HomePage() {
  const { data: employees, isLoading: loadingEmp } = useEmployees();
  const { data: agendamentos, isLoading: loadingAg } = useAgendamentos();

  const todayCount =
    agendamentos?.filter((a) => isToday(a.dataHora)).length ?? 0;
  const activeEmp = employees?.filter((e) => e.ativo !== false).length ?? 0;
  const inProgress =
    agendamentos?.filter((a) => a.status === 'Em Serviço').length ?? 0;

  return (
    <Stack gap="0">
      <Box pb="10">
        <Heading
          fontSize={{ base: '26px', md: '32px' }}
          fontWeight="800"
          color={tokens.textPrimary}
          letterSpacing="-0.03em"
          lineHeight="1.05"
        >
          {getGreeting()}, Gerente
        </Heading>
        <Text
          fontSize="13px"
          color={tokens.textMuted}
          mt="2"
          textTransform="capitalize"
          letterSpacing="0.01em"
        >
          {formatDate()}
        </Text>
      </Box>

      <Box
        as="hr"
        border="none"
        borderTop="1px solid"
        borderColor={tokens.panelBorder}
        mb="10"
      />

      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={{ base: '8', md: '12' }}
        pb="14"
      >
        <StatBlock label="Hoje" value={todayCount} loading={loadingAg} />
        <StatBlock
          label="Funcionários"
          value={activeEmp}
          loading={loadingEmp}
        />
        <StatBlock label="Em serviço" value={inProgress} loading={loadingAg} />
      </Grid>

      <Box>
        <Text
          fontSize="10px"
          fontWeight="600"
          color={tokens.textMuted}
          textTransform="uppercase"
          letterSpacing="0.15em"
          mb="1"
        >
          Módulos
        </Text>

        <Stack gap="0">
          <NavItem
            to="/manager/orders"
            label="Agendamentos"
            description="Pedidos e status dos serviços"
          />
          <NavItem
            to="/manager/employee"
            label="Funcionários"
            description="Equipe, cargos e permissões de acesso"
          />
          <NavItem
            to="/pets/status"
            label="Status dos Pets"
            description="Andamento dos serviços em tempo real"
          />
        </Stack>
      </Box>
    </Stack>
  );
}
