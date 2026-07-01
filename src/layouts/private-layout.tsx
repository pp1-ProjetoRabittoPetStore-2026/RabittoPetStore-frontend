import { useState } from 'react';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router';
import {
  Box,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerPositioner,
  DrawerRoot,
  Flex,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Calendar, CalendarDays, History, Home, LogOut, Menu, Scissors, Stethoscope, Users, X } from 'lucide-react';
import { useLogout } from '../services/auth/queries';
import { authService, type Role } from '../services/auth/storage';
import { tokens } from '../styles/tokens';
import rabittoLogo from '../assets/rabitto-logo.png';

const ALL_NAV_ITEMS: {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: Role[];
}[] = [
  { label: 'Principal',        path: '/',                 icon: Home,         roles: ['GERENTE', 'CAIXA', 'TOSADOR', 'VETERINARIO'] },
  { label: 'Agendamentos',     path: '/manager/orders',   icon: Calendar,     roles: ['GERENTE'] },
  { label: 'Agenda',           path: '/manager/agenda',   icon: CalendarDays, roles: ['GERENTE'] },
  { label: 'Funcionários',     path: '/manager/employee', icon: Users,        roles: ['GERENTE'] },
  { label: 'Serviços',         path: '/manager/servicos', icon: Scissors,     roles: ['GERENTE'] },
  { label: 'Histórico',        path: '/pets/history',     icon: History,      roles: ['GERENTE', 'TOSADOR'] },
  { label: 'Minhas Consultas', path: '/vet/agenda',       icon: Stethoscope,  roles: ['VETERINARIO'] },
];

interface NavLinkProps {
  label: string;
  path: string;
  icon: React.ElementType;
  onClick?: () => void;
}

function NavLink({ label, path, icon: Icon, onClick }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Box
      asChild
      onClick={onClick}
      display="flex"
      alignItems="center"
      gap="2"
      px="3"
      py="2"
      borderRadius="lg"
      textDecoration="none"
      color={isActive ? tokens.accent : tokens.textMuted}
      fontWeight={isActive ? '600' : '400'}
      fontSize="sm"
      bg={isActive ? 'oklch(0.73 0.08 65 / 0.12)' : 'transparent'}
      _hover={{ color: tokens.textPrimary, bg: 'oklch(0.73 0.08 65 / 0.08)' }}
      transition="color 120ms ease-out, background 120ms ease-out"
      whiteSpace="nowrap"
    >
      <RouterLink to={path}>
        <Icon size={15} />
        {label}
      </RouterLink>
    </Box>
  );
}

export default function PrivateLayout() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { mutate: logout, isPending } = useLogout();

  const role = authService.getRole();
  const navItems = ALL_NAV_ITEMS.filter(
    (item) => role != null && item.roles.includes(role),
  );

  function handleLogout() {
    logout(undefined, {
      onSettled: () => {
        authService.removeToken();
        navigate('/login', { replace: true });
      },
    });
  }

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg={tokens.pageBg}
      fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    >
      {}
      <Flex
        as="header"
        h="56px"
        px={{ base: '4', md: '6' }}
        align="center"
        justify="space-between"
        bg={tokens.panelBg}
        borderBottom="1px solid"
        borderColor={tokens.panelBorder}
        position="sticky"
        top="0"
        zIndex="10"
        flexShrink="0"
      >
        {}
        <HStack gap="3">
          <IconButton
            aria-label="Abrir menu"
            variant="ghost"
            size="sm"
            display={{ base: 'inline-flex', md: 'none' }}
            color={tokens.textMuted}
            _hover={{ color: tokens.textPrimary, bg: 'oklch(0.73 0.08 65 / 0.08)' }}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={18} />
          </IconButton>

          <HStack gap="2" textDecoration="none" asChild>
            <RouterLink to="/">
              <Image
                src={rabittoLogo}
                alt="Rabitto"
                h="28px"
                filter="drop-shadow(0 0 8px oklch(0.73 0.08 65 / 0.3))"
              />
            </RouterLink>
          </HStack>
        </HStack>

        {}
        <HStack gap="1" display={{ base: 'none', md: 'flex' }}>
          {navItems.map((item) => (
            <NavLink key={item.path} {...item} />
          ))}
        </HStack>

        {}
        <Box
          as="button"
          onClick={handleLogout}
          display="flex"
          alignItems="center"
          gap="2"
          px="3"
          py="2"
          borderRadius="lg"
          fontSize="13px"
          fontWeight="500"
          color={tokens.textMuted}
          bg="transparent"
          border="none"
          cursor={isPending ? 'not-allowed' : 'pointer'}
          opacity={isPending ? 0.5 : 1}
          _hover={{ color: tokens.errorText }}
          transition="color 120ms ease-out"
          fontFamily="inherit"
        >
          <LogOut size={14} />
          <Text display={{ base: 'none', sm: 'block' }} fontSize="13px">Sair</Text>
        </Box>
      </Flex>

      {}
      <Box flex="1" overflow="auto" p={{ base: '5', md: '8' }}>
        <Outlet />
      </Box>

      {}
      <DrawerRoot
        open={drawerOpen}
        placement="start"
        onOpenChange={(d) => setDrawerOpen(d.open)}
      >
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent
            bg={tokens.panelBg}
            borderRight="1px solid"
            borderColor={tokens.panelBorder}
            maxW="260px"
          >
            <DrawerBody p="5">
              <Flex justify="space-between" align="center" mb="8">
                <HStack gap="2">
                  <Image
                    src={rabittoLogo}
                    alt="Rabitto"
                    h="26px"
                    filter="drop-shadow(0 0 8px oklch(0.73 0.08 65 / 0.3))"
                  />
                </HStack>
                <IconButton
                  aria-label="Fechar menu"
                  variant="ghost"
                  size="sm"
                  color={tokens.textMuted}
                  _hover={{ color: tokens.textPrimary, bg: 'oklch(0.73 0.08 65 / 0.08)' }}
                  onClick={() => setDrawerOpen(false)}
                >
                  <X size={16} />
                </IconButton>
              </Flex>

              <Stack gap="1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    {...item}
                    onClick={() => setDrawerOpen(false)}
                  />
                ))}
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    </Flex>
  );
}
