import { Helmet } from 'react-helmet-async';
import { useMemo } from 'react';
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  CalendarCheck,
  CalendarClock,
  PawPrint,
  Users,
  Clock,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { useAgendamentos } from '../../services/agendamentos/queries';
import { usePets } from '../../services/pets/queries';
import { useTutores } from '../../services/tutores/queries';
import { authService } from '../../services/auth/storage';
import { tokens } from '../../styles/tokens';

const STATUS_HEX: Record<string, string> = {
  Pendente: '#9CA3AF',
  Aguardando: '#F59E0B',
  'Em Serviço': '#3B82F6',
  Pronto: '#22C55E',
  Confirmado: '#16A34A',
  Rejeitado: '#EF4444',
  Cancelado: '#DC2626',
};

const INACTIVE_STATUS = new Set(['Rejeitado', 'Cancelado']);

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

const roleDisplay: Record<string, string> = {
  GERENTE: 'Gerente',
  TOSADOR: 'Tosador',
  VETERINARIO: 'Veterinário',
  CAIXA: 'Caixa',
  TUTOR: 'Tutor',
};

function startOfToday(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

function dayKey(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function HomePage() {
  const { data: agendamentos = [], isLoading: loadingAg } = useAgendamentos();
  const { data: pets = [], isLoading: loadingPets } = usePets();
  const { data: tutores = [], isLoading: loadingTut } = useTutores();

  const metrics = useMemo(() => {
    const today = startOfToday();
    const now = new Date();

    const ativos = agendamentos.filter(
      (a) => !INACTIVE_STATUS.has(a.status),
    );

    const total = agendamentos.length;
    const upcoming = ativos.filter((a) => new Date(a.dataHora) >= now).length;
    const todayCount = ativos.filter((a) => {
      const d = new Date(a.dataHora);
      return d >= today && d < new Date(today.getTime() + 86400000);
    }).length;
    const inProgress = agendamentos.filter(
      (a) => a.status === 'Em Serviço',
    ).length;

    const receita = ativos.reduce(
      (sum, a) =>
        sum + a.servicos.reduce((s, sv) => s + (sv.preco ?? 0), 0),
      0,
    );

    return {
      total,
      upcoming,
      todayCount,
      inProgress,
      receita,
    };
  }, [agendamentos]);

  // appointments per day, last 7 days (active only)
  const perDay = useMemo(() => {
    const days: { dia: string; agendamentos: number }[] = [];
    const base = startOfToday();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(base.getTime() - i * 86400000);
      days.push({ dia: dayKey(d), agendamentos: 0 });
    }
    const index = new Map(days.map((d, i) => [d.dia, i]));
    agendamentos.forEach((a) => {
      if (INACTIVE_STATUS.has(a.status)) return;
      const k = dayKey(new Date(a.dataHora));
      const i = index.get(k);
      if (i != null) days[i].agendamentos += 1;
    });
    return days;
  }, [agendamentos]);

  // distribution by status
  const byStatus = useMemo(() => {
    const counts = new Map<string, number>();
    agendamentos.forEach((a) => {
      counts.set(a.status, (counts.get(a.status) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [agendamentos]);

  // top services
  const topServicos = useMemo(() => {
    const counts = new Map<string, number>();
    agendamentos.forEach((a) => {
      if (INACTIVE_STATUS.has(a.status)) return;
      a.servicos.forEach((s) => {
        counts.set(s.nome, (counts.get(s.nome) ?? 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .map(([nome, total]) => ({ nome, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [agendamentos]);

  return (
    <Stack gap="8">
      <Helmet>
        <title>Rabitto Pet Store — Dashboard</title>
      </Helmet>

      {}
      <Box>
        <Heading
          fontSize={{ base: '24px', md: '30px' }}
          fontWeight="800"
          color={tokens.textPrimary}
          letterSpacing="-0.03em"
          lineHeight="1.05"
        >
          {getGreeting()}, {roleDisplay[authService.getRole() ?? 'GERENTE']}
        </Heading>
        <Text
          fontSize="13px"
          color={tokens.textMuted}
          mt="1"
          textTransform="capitalize"
        >
          {formatDate()}
        </Text>
      </Box>

      {}
      <SimpleGrid columns={{ base: 2, md: 3, xl: 5 }} gap="4">
        <KpiCard
          icon={CalendarCheck}
          label="Agendamentos"
          value={metrics.total}
          loading={loadingAg}
        />
        <KpiCard
          icon={CalendarClock}
          label="Próximos"
          value={metrics.upcoming}
          loading={loadingAg}
        />
        <KpiCard
          icon={PawPrint}
          label="Pets"
          value={pets.length}
          loading={loadingPets}
        />
        <KpiCard
          icon={Users}
          label="Clientes"
          value={tutores.length}
          loading={loadingTut}
        />
        <KpiCard
          icon={Clock}
          label="Hoje"
          value={metrics.todayCount}
          loading={loadingAg}
        />
      </SimpleGrid>

      {}
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap="4">
        <ChartCard title="Agendamentos (últimos 7 dias)" span={2}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={perDay}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid stroke={tokens.panelBorder} vertical={false} />
              <XAxis
                dataKey="dia"
                tick={{ fontSize: 12, fill: tokens.textMuted }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: tokens.textMuted }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: tokens.panelBorder, opacity: 0.4 }}
                contentStyle={{
                  background: tokens.panelBg,
                  border: `1px solid ${tokens.inputBorder}`,
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="agendamentos"
                fill={tokens.accent}
                radius={[6, 6, 0, 0]}
                maxBarSize={42}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Por status">
          {byStatus.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={byStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {byStatus.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_HEX[entry.name] ?? '#9CA3AF'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: tokens.panelBg,
                    border: `1px solid ${tokens.inputBorder}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <StatusLegend data={byStatus} />
        </ChartCard>
      </SimpleGrid>

      {}
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap="4">
        <ChartCard title="Serviços mais agendados" span={2}>
          {topServicos.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={topServicos}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid stroke={tokens.panelBorder} horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: tokens.textMuted }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="nome"
                  width={120}
                  tick={{ fontSize: 12, fill: tokens.textMuted }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: tokens.panelBorder, opacity: 0.4 }}
                  contentStyle={{
                    background: tokens.panelBg,
                    border: `1px solid ${tokens.inputBorder}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="total"
                  fill={tokens.accent}
                  radius={[0, 6, 6, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <Stack gap="4">
          <MiniStat
            icon={Activity}
            label="Em serviço agora"
            value={String(metrics.inProgress)}
            loading={loadingAg}
          />
          <MiniStat
            icon={CalendarCheck}
            label="Receita estimada (ativos)"
            value={`R$ ${metrics.receita.toFixed(2)}`}
            loading={loadingAg}
          />
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  loading: boolean;
}

function KpiCard({ icon: Icon, label, value, loading }: KpiCardProps) {
  return (
    <Box
      bg={tokens.panelBg}
      borderWidth="1px"
      borderColor={tokens.panelBorder}
      rounded="xl"
      p="4"
    >
      <Flex align="center" gap="2" color={tokens.textMuted} mb="2">
        <Icon size={16} />
        <Text
          fontSize="11px"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.08em"
        >
          {label}
        </Text>
      </Flex>
      {loading ? (
        <Skeleton h="9" w="16" rounded="sm" />
      ) : (
        <Text
          fontSize={{ base: '28px', md: '34px' }}
          fontWeight="800"
          color={tokens.textPrimary}
          lineHeight="1"
          fontVariantNumeric="tabular-nums"
        >
          {value}
        </Text>
      )}
    </Box>
  );
}

interface MiniStatProps {
  icon: React.ElementType;
  label: string;
  value: string;
  loading: boolean;
}

function MiniStat({ icon: Icon, label, value, loading }: MiniStatProps) {
  return (
    <Box
      bg={tokens.panelBg}
      borderWidth="1px"
      borderColor={tokens.panelBorder}
      rounded="xl"
      p="5"
      flex="1"
    >
      <Flex align="center" gap="2" color={tokens.textMuted} mb="2">
        <Icon size={16} />
        <Text fontSize="12px" fontWeight="500">
          {label}
        </Text>
      </Flex>
      {loading ? (
        <Skeleton h="7" w="24" rounded="sm" />
      ) : (
        <Text
          fontSize="24px"
          fontWeight="700"
          color={tokens.accent}
          lineHeight="1"
        >
          {value}
        </Text>
      )}
    </Box>
  );
}

interface ChartCardProps {
  title: string;
  span?: number;
  children: React.ReactNode;
}

function ChartCard({ title, span = 1, children }: ChartCardProps) {
  return (
    <Box
      gridColumn={{ lg: span === 2 ? 'span 2' : 'auto' }}
      bg={tokens.panelBg}
      borderWidth="1px"
      borderColor={tokens.panelBorder}
      rounded="xl"
      p="5"
    >
      <Text
        fontSize="13px"
        fontWeight="600"
        color={tokens.textPrimary}
        mb="4"
      >
        {title}
      </Text>
      {children}
    </Box>
  );
}

function StatusLegend({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) return null;
  return (
    <Flex wrap="wrap" gap="2" mt="3">
      {data.map((d) => (
        <Flex key={d.name} align="center" gap="1">
          <Box
            w="2"
            h="2"
            rounded="full"
            bg={STATUS_HEX[d.name] ?? '#9CA3AF'}
          />
          <Text fontSize="11px" color={tokens.textMuted}>
            {d.name} ({d.value})
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}

function EmptyChart() {
  return (
    <Flex h="260px" align="center" justify="center">
      <Text fontSize="sm" color={tokens.textMuted}>
        Sem dados
      </Text>
    </Flex>
  );
}
