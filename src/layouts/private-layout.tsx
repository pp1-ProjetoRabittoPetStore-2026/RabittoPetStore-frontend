import { useState } from 'react';
import {
  Box,
  Button,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Menu } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useLogout } from '../services/auth/queries';
import { authService } from '../services/auth/storage';

const NAV_ITEMS = [
  { label: 'Principal', path: '/' },
  { label: 'Status dos Serviços', path: '/pets/status' },
  { label: 'Gerenciar Pedidos', path: '/manager/orders' },
  { label: 'Gerenciar Empregados', path: '/manager/employee' },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleGoTo(path: string) {
    navigate(path);
    onNavigate?.();
  }

  return (
    <Stack gap={2}>
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <Button
            key={item.path}
            variant={isActive ? 'solid' : 'ghost'}
            justifyContent="flex-start"
            onClick={() => handleGoTo(item.path)}
            colorPalette={isActive ? 'blue' : undefined}
          >
            {item.label}
          </Button>
        );
      })}
    </Stack>
  );
}

export default function PrivateLayout() {
  const navigate = useNavigate();
  const { mutate: logout, isPending } = useLogout();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function handleLogout() {
    logout(undefined, {
      onSettled: () => {
        authService.removeToken();
        navigate('/login', { replace: true });
      },
    });
  }

  return (
    <Flex minH="100vh" direction="column" bg="bg.subtle">
      <Flex
        h={16}
        px={{ base: 4, md: 6 }}
        align="center"
        justify="space-between"
        borderBottomWidth="1px"
        bg="bg"
      >
        <HStack gap={3}>
          <IconButton
            aria-label="Abrir menu"
            variant="ghost"
            display={{ base: 'inline-flex', md: 'none' }}
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu size={18} />
          </IconButton>
          <Heading size="md">RabittoPetStore</Heading>
        </HStack>

        <Button onClick={handleLogout} loading={isPending} size="sm">
          Sair
        </Button>
      </Flex>

      <Flex flex={1} overflow="hidden">
        <Box
          w="64"
          borderRightWidth="1px"
          p={4}
          bg="bg"
          display={{ base: 'none', md: 'block' }}
        >
          <Text fontSize="sm" color="fg.muted" mb={3}>
            Navegacao
          </Text>
          <SidebarContent />
        </Box>

        <Box flex={1} p={{ base: 4, md: 6 }} overflow="auto">
          <Outlet />
        </Box>
      </Flex>

      <DrawerRoot
        open={isDrawerOpen}
        placement="start"
        onOpenChange={(details) => setIsDrawerOpen(details.open)}
      >
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent>
            <DrawerHeader>
              <HStack justify="space-between" w="full">
                <Text fontWeight="semibold">Menu</Text>
                <DrawerCloseTrigger />
              </HStack>
            </DrawerHeader>
            <DrawerBody>
              <SidebarContent onNavigate={() => setIsDrawerOpen(false)} />
            </DrawerBody>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    </Flex>
  );
}
