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
  Stack,
  Text,
} from '@chakra-ui/react';
import { Activity, Calendar, Home, LogOut, Menu, Users, X } from 'lucide-react';
import { useLogout } from '../services/auth/queries';
import { authService } from '../services/auth/storage';
import { tokens } from '../styles/tokens';

const NAV_ITEMS = [
  { label: 'Principal',       path: '/',                 icon: Home },
  { label: 'Agendamentos',    path: '/manager/orders',   icon: Calendar },
  { label: 'Funcionários',    path: '/manager/employee', icon: Users },
  { label: 'Status dos Pets', path: '/pets/status',      icon: Activity },
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
      as={RouterLink}
      to={path}
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
      <Icon size={15} />
      {label}
    </Box>
  );
}

export default function PrivateLayout() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { mutate: logout, isPending } = useLogout();

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
      {/* Navbar */}
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
        {/* Logo + hamburger */}
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

          <HStack gap="2" as={RouterLink} to="/" textDecoration="none">
            <Text
              fontSize="17px"
              lineHeight="1"
              userSelect="none"
              filter="drop-shadow(0 0 8px oklch(0.73 0.08 65 / 0.4))"
            >
              🐾
            </Text>
            <Text fontWeight="800" fontSize="15px" color={tokens.accent} letterSpacing="-0.3px">
              Rabitto
            </Text>
          </HStack>
        </HStack>

        {/* Desktop nav links */}
        <HStack gap="1" display={{ base: 'none', md: 'flex' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.path} {...item} />
          ))}
        </HStack>

        {/* Logout */}
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

      {/* Content */}
      <Box flex="1" overflow="auto" p={{ base: '5', md: '8' }}>
        <Outlet />
      </Box>

      {/* Mobile drawer */}
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
                  <Text fontSize="18px" filter="drop-shadow(0 0 8px oklch(0.73 0.08 65 / 0.4))">
                    🐾
                  </Text>
                  <Text fontWeight="800" fontSize="15px" color={tokens.accent} letterSpacing="-0.3px">
                    Rabitto
                  </Text>
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
                {NAV_ITEMS.map((item) => (
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
