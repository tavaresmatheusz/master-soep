'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getUsers, updateUser, deleteUser } from '@/lib/actions';
import { User } from '@/lib/types';
import { 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const usersPerPage = 20;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers(currentPage, usersPerPage);
      setUsers(response.users || []);
      setTotalUsers(response.total || 0);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, userData);
      setShowEditModal(false);
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar usuário');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      await deleteUser(userId);
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar usuário');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
            <p className="mt-2 text-gray-600">Gerencie todos os usuários da plataforma</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar usuários..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Empresa</th>
                  <th>Projetos</th>
                  <th>Total Gasto</th>
                  <th>Criado em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        {user.lastLogin && (
                          <div className="text-sm text-gray-500">
                            Último login: {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.company}</td>
                    <td>
                      <div className="text-sm">
                        <div>{user.activeProjectsCount} ativos</div>
                        <div className="text-gray-500">{user.projectsCount} total</div>
                      </div>
                    </td>
                    <td>R$ {user.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td>{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * usersPerPage) + 1} a {Math.min(currentPage * usersPerPage, totalUsers)} de {totalUsers} usuários
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-secondary disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && editingUser && (
          <EditUserModal
            user={editingUser}
            onSave={handleSaveUser}
            onClose={() => {
              setShowEditModal(false);
              setEditingUser(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
}

// Edit User Modal Component
function EditUserModal({ 
  user, 
  onSave, 
  onClose 
}: { 
  user: User; 
  onSave: (data: Partial<User>) => void; 
  onClose: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    company: user.company,
    bio: user.bio || '',
    website: user.website || '',
    active: user.active !== false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Usuário</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <input
              type="text"
              className="input"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              className="input"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              className="input"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">Usuário ativo</label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Salvar
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}