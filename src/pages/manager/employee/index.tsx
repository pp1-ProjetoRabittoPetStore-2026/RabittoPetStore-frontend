import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Trash2, Plus, ShieldAlert } from 'lucide-react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Table,
  Badge,
  IconButton,
  Dialog,
  Input,
  Field,
  Stack,
  createListCollection,
  HStack,
  Spinner,
} from '@chakra-ui/react';

import {
  useCreateEmployee,
  useDeactivateEmployee,
  useEmployees,
  useUpdateEmployee,
} from '@/services/employee/queries';
import {
  ROLE_PERMISSIONS,
  type Employee,
  type Role,
} from '@/services/employee/types';

// Esquema de validação
const employeeSchema = z.object({
  nome: z.string().min(2, 'Nome muito curto'),
  cargo: z.string().min(1, 'Selecione um cargo'),
  cpf: z.string().min(11, 'CPF inválido'),
  telefone: z.string().min(8, 'Telefone inválido'),
  senha: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

const roles = createListCollection({
  items: [
    { label: 'Gerente', value: 'GERENTE' },
    { label: 'Caixa', value: 'CAIXA' },
    { label: 'Tosador', value: 'TOSADOR' },
    { label: 'Veterinário', value: 'VETERINARIO' },
  ],
});

export default function EmployeePage() {
  const { data: employees, isLoading } = useEmployees();
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deactivateMutation = useDeactivateEmployee();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const selectedRole = watch('cargo') as Role;

  const openCreateModal = () => {
    setEditingEmployee(null);
    reset({ nome: '', cargo: '', cpf: '', telefone: '', senha: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    reset({
      nome: emp.nome,
      cargo: emp.cargo,
      cpf: emp.cpf,
      telefone: emp.telefone,
      senha: '',
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: EmployeeFormData) => {
    if (editingEmployee) {
      updateMutation.mutate(
        {
          id: editingEmployee.id!,
          data: { ...data, ativo: editingEmployee.ativo },
        },
        {
          onSuccess: () => setIsModalOpen(false),
        },
      );
      return;
    }

    createMutation.mutate(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  return (
    <Box p="8" maxW="1280px" mx="auto">
      {/* Header */}
      <Flex justify="space-between" align="center" mb="8">
        <Box>
          <Heading size="xl" color="gray.800">
            Equipe & Acessos
          </Heading>
          <Text color="gray.500">
            Gerencie funcionários, cargos e permissões do sistema.
          </Text>
        </Box>
        <Button colorPalette="blue" onClick={openCreateModal} gap="2">
          <Plus size={18} /> Novo Funcionário
        </Button>
      </Flex>

      {/* Tabela com Sticky Header (Chakra v3 Pattern) */}
      <Box rounded="xl" overflow="hidden" bg={'#09090B'}>
        <Table.ScrollArea h="600px">
          <Table.Root size="md" stickyHeader>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Nome</Table.ColumnHeader>
                <Table.ColumnHeader>Cargo</Table.ColumnHeader>
                <Table.ColumnHeader>CPF</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={5} textAlign="center" py="10">
                    <Spinner />
                  </Table.Cell>
                </Table.Row>
              ) : (
                employees?.map((emp) => (
                  <Table.Row key={emp.id} opacity={emp.ativo ? 1 : 0.6}>
                    <Table.Cell>
                      <HStack gap="3">
                        <Box
                          w="9"
                          h="9"
                          rounded="full"
                          bg="purple.500"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontWeight="bold"
                        >
                          {emp.nome.charAt(0).toUpperCase()}
                        </Box>
                        <Text fontWeight="medium">{emp.nome}</Text>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        variant="subtle"
                        colorPalette={getRoleColor(emp.cargo)}
                      >
                        {emp.cargo}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{emp.cpf}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        variant="solid"
                        colorPalette={emp.ativo ? 'green' : 'red'}
                      >
                        {emp.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <HStack gap="2" justify="flex-end">
                        <IconButton
                          variant="ghost"
                          colorPalette="blue"
                          onClick={() => openEditModal(emp)}
                        >
                          <Pencil size={18} />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          colorPalette="red"
                          disabled={!emp.ativo}
                          onClick={() => deactivateMutation.mutate(emp.id!)}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>

      {/* Modal Refatorado para Dialog do Chakra v3 */}
      <Dialog.Root
        open={isModalOpen}
        onOpenChange={(e) => setIsModalOpen(e.open)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="2xl" p="6">
            <Dialog.Header>
              <Dialog.Title fontSize="xl">
                {editingEmployee ? 'Editar Perfil' : 'Cadastrar Funcionário'}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form id="employee-form" onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="4">
                  <Field.Root invalid={!!errors.nome}>
                    <Field.Label>Nome Completo</Field.Label>
                    <Input
                      {...register('nome')}
                      placeholder="Ex: Maria Oliveira"
                    />
                    <Field.ErrorText>{errors.nome?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.cargo}>
                    <Field.Label>Cargo</Field.Label>
                    <select
                      {...register('cargo')}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                      }}
                    >
                      <option value="">Selecione o cargo</option>
                      {roles.items.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <Field.ErrorText>{errors.cargo?.message}</Field.ErrorText>
                  </Field.Root>

                  {selectedRole && ROLE_PERMISSIONS[selectedRole] && (
                    <Box p="3" rounded="md">
                      <HStack
                        color="blue.700"
                        mb="2"
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        <ShieldAlert size={14} /> <Text>PERMISSÕES:</Text>
                      </HStack>
                      <HStack flexWrap="wrap" gap="1">
                        {ROLE_PERMISSIONS[selectedRole].map((perm) => (
                          <Badge key={perm} size="sm" variant="outline">
                            {perm}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
                  )}

                  <HStack gap="4">
                    <Field.Root invalid={!!errors.cpf}>
                      <Field.Label>CPF</Field.Label>
                      <Input
                        {...register('cpf')}
                        placeholder="000.000.000-00"
                      />
                    </Field.Root>
                    <Field.Root invalid={!!errors.telefone}>
                      <Field.Label>Telefone</Field.Label>
                      <Input
                        {...register('telefone')}
                        placeholder="(81) 99999-9999"
                      />
                    </Field.Root>
                  </HStack>

                  <Field.Root invalid={!!errors.senha}>
                    <Field.Label>
                      Senha {editingEmployee && '(Opcional)'}
                    </Field.Label>
                    <Input type="password" {...register('senha')} />
                    <Field.HelperText fontSize="xs">
                      {editingEmployee
                        ? 'Deixe vazio para manter'
                        : 'Senha de acesso inicial'}
                    </Field.HelperText>
                  </Field.Root>
                </Stack>
              </form>
            </Dialog.Body>
            <Dialog.Footer mt="6">
              <Dialog.CloseTrigger asChild>
                <Button variant="outline">Cancelar</Button>
              </Dialog.CloseTrigger>
              <Button
                type="submit"
                form="employee-form"
                colorPalette="blue"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                Salvar Funcionário
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}

// Helper para cores de badge
const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    GERENTE: 'purple',
    CAIXA: 'blue',
    VETERINARIO: 'green',
    TOSADOR: 'orange',
  };
  return colors[role] || 'gray';
};
