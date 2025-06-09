'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { plansApi } from '@/lib/api';
import { Plan } from '@/lib/types';
import { 
  Search, 
  Edit, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  User
} from 'lucide-react';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPlans, setTotalPlans] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const plansPerPage = 20;
  const totalPages = Math.ceil(totalPlans / plansPerPage);

  useEffect(() => {
    loadPlans();
  }, [currentPage]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await plansApi.getPlans(currentPage, plansPerPage);
      setPlans(response.plans || []);
      setTotalPlans(response.total || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar planos');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setShowEditModal(true);
  };

  const handleSavePlan = async (planData: Partial<Plan>) => {
    if (!editingPlan) return;

    try {
      await plansApi.updatePlan(editingPlan.id, planData);
      setShowEditModal(false);
      setEditingPlan(null);
      loadPlans();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar plano');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'expired':
        return 'Expirado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const filteredPlans = plans.filter(plan =>
    plan.projects.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.projects.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.profiles.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.profiles.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-3xl font-bold text-gray-900">Planos</h1>
            <p className="mt-2 text-gray-600">Gerencie todos os planos da plataforma</p>
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
            placeholder="Buscar planos..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Plans Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th>Pagador</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Limite de Tamanho</th>
                  <th>Expira em</th>
                  <th>Pago em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan) => (
                  <tr key={plan.id}>
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">{plan.projects.name}</div>
                        <div className="text-sm text-gray-500">{plan.projects.business_name}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{plan.profiles.name}</div>
                          <div className="text-sm text-gray-500">{plan.profiles.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        R$ {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(plan.status)}`}>
                        {getStatusText(plan.status)}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-gray-900">{plan.projectSizeLimit} Usuarios</span>
                    </td>
                    <td>
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(plan.expiresOn).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td>
                      {plan.paiedIn ? (
                        <div className="text-sm text-gray-900">
                          {new Date(plan.paiedIn).toLocaleDateString('pt-BR')}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
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
            Mostrando {((currentPage - 1) * plansPerPage) + 1} a {Math.min(currentPage * plansPerPage, totalPlans)} de {totalPlans} planos
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
        {showEditModal && editingPlan && (
          <EditPlanModal
            plan={editingPlan}
            onSave={handleSavePlan}
            onClose={() => {
              setShowEditModal(false);
              setEditingPlan(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
}

// Edit Plan Modal Component
function EditPlanModal({ 
  plan, 
  onSave, 
  onClose 
}: { 
  plan: Plan; 
  onSave: (data: Partial<Plan>) => void; 
  onClose: () => void; 
}) {
  const [formData, setFormData] = useState({
    status: plan.status,
    expiresOn: plan.expiresOn.split('T')[0] // Convert to date input format
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      status: formData.status,
      expiresOn: new Date(formData.expiresOn).toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Plano</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="input"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="active">Ativo</option>
              <option value="pending">Pendente</option>
              <option value="cancelled">Cancelado</option>
              <option value="expired">Expirado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Expiração</label>
            <input
              type="date"
              className="input"
              value={formData.expiresOn}
              onChange={(e) => setFormData({ ...formData, expiresOn: e.target.value })}
              required
            />
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