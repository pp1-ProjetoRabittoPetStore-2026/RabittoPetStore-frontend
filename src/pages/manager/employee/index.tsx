import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Trash2, Plus, X, ShieldAlert } from 'lucide-react';
import './Employee.css';
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

const employeeSchema = z.object({
  nome: z.string().min(2, 'Nome muito curto'),
  cargo: z.string().min(1, 'Selecione um cargo'),
  cpf: z.string().min(11, 'CPF inválido'),
  telefone: z.string().min(8, 'Telefone inválido'),
  senha: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

const roles: Role[] = ['GERENTE', 'CAIXA', 'TOSADOR', 'VETERINARIO'];

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

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = (data: EmployeeFormData) => {
    if (editingEmployee && editingEmployee.id) {
      updateMutation.mutate(
        {
          id: editingEmployee.id,
          data: { ...data, ativo: editingEmployee.ativo },
        },
        { onSuccess: () => setIsModalOpen(false) },
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  const handleDeactivate = (id?: number) => {
    if (
      id &&
      confirm(
        'Tem certeza que deseja desativar este funcionário? O acesso ao sistema será revogado.',
      )
    ) {
      deactivateMutation.mutate(id);
    }
  };

  return (
    <div className="employee-page-container">
      <header className="employee-page-header">
        <div>
          <h1>Equipe & Acessos</h1>
          <p>
            Gerencie funcionários, cargos e permissões de acesso ao sistema.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} />
          <span>Novo Funcionário</span>
        </button>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div className="loading-state">Carregando dados...</div>
        ) : (
          <table className="employee-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Status</th>
                <th className="actions-header">Ações</th>
              </tr>
            </thead>
            <tbody>
              {employees?.map((emp) => (
                <tr key={emp.id} className={!emp.ativo ? 'inactive-row' : ''}>
                  <td className="emp-name">
                    <div className="avatar">
                      {emp.nome.charAt(0).toUpperCase()}
                    </div>
                    <span>{emp.nome}</span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-role badge-${emp.cargo.toLowerCase()}`}
                    >
                      {emp.cargo}
                    </span>
                  </td>
                  <td>{emp.cpf}</td>
                  <td>{emp.telefone}</td>
                  <td>
                    {emp.ativo ? (
                      <span className="badge badge-active">Ativo</span>
                    ) : (
                      <span className="badge badge-inactive">Inativo</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="icon-btn edit-btn"
                      onClick={() => openEditModal(emp)}
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="icon-btn delete-btn"
                      onClick={() => handleDeactivate(emp.id)}
                      disabled={!emp.ativo}
                      title={
                        emp.ativo ? 'Desativar Acesso' : 'Conta Desativada'
                      }
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {(!employees || employees.length === 0) && (
                <tr>
                  <td colSpan={6} className="empty-state">
                    Nenhum funcionário cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content glass-effect"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>
                {editingEmployee ? 'Editar Perfil' : 'Cadastrar Funcionário'}
              </h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="employee-form">
              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  {...register('nome')}
                  placeholder="Ex: Maria Oliveira"
                />
                {errors.nome && (
                  <span className="error-text">{errors.nome.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Cargo & Nível de Acesso</label>
                <select {...register('cargo')}>
                  <option value="">Selecione o cargo do funcionário</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.cargo && (
                  <span className="error-text">{errors.cargo.message}</span>
                )}

                {selectedRole && ROLE_PERMISSIONS[selectedRole] && (
                  <div className="permissions-box">
                    <div className="permissions-header">
                      <ShieldAlert size={14} />
                      <span>Permissões Concedidas:</span>
                    </div>
                    <div className="permissions-list">
                      {ROLE_PERMISSIONS[selectedRole].map((perm) => (
                        <span key={perm} className="permission-tag">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>CPF</label>
                  <input
                    type="text"
                    {...register('cpf')}
                    placeholder="000.000.000-00"
                  />
                  {errors.cpf && (
                    <span className="error-text">{errors.cpf.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    {...register('telefone')}
                    placeholder="(00) 00000-0000"
                  />
                  {errors.telefone && (
                    <span className="error-text">
                      {errors.telefone.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>
                  Senha de Acesso{' '}
                  {editingEmployee && (
                    <span className="optional">(Opcional)</span>
                  )}
                </label>
                <input
                  type="password"
                  {...register('senha')}
                  placeholder="******"
                />
                {errors.senha && (
                  <span className="error-text">{errors.senha.message}</span>
                )}
                <small className="help-text">
                  {editingEmployee
                    ? 'Deixe em branco para manter a senha atual.'
                    : 'Esta senha será usada pelo funcionário para acessar o sistema.'}
                </small>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Salvando...'
                    : 'Salvar Funcionário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
