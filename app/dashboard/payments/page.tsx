'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getPayments } from '@/lib/actions';
import { Payment } from '@/lib/types';
import { 
  Search, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  CreditCard,
  User,
  Calendar
} from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const paymentsPerPage = 20;
  const totalPages = Math.ceil(totalPayments / paymentsPerPage);

  useEffect(() => {
    loadPayments();
  }, [currentPage]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await getPayments(currentPage, paymentsPerPage);
      setPayments(response.payments || []);
      setTotalPayments(response.total || 0);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pagamentos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'debit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'pix':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Cartão de Crédito';
      case 'debit_card':
        return 'Cartão de Débito';
      case 'pix':
        return 'PIX';
      case 'bank_transfer':
        return 'Transferência Bancária';
      default:
        return method;
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.profiles.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.externalReference.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-3xl font-bold text-gray-900">Pagamentos</h1>
            <p className="mt-2 text-gray-600">Histórico de todos os pagamentos da plataforma</p>
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
            placeholder="Buscar pagamentos..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Payments Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>ID do Pagamento</th>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Método</th>
                  <th>Status</th>
                  <th>Referência Externa</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <div className="font-mono text-sm text-gray-900">
                        {payment.id}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{payment.profiles.name}</div>
                          <div className="text-sm text-gray-500">{payment.profiles.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-lg font-semibold text-gray-900">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-sm text-gray-900">
                        {getMethodIcon(payment.method)}
                        <span className="ml-2">{getMethodText(payment.method)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                    <td>
                      <div className="font-mono text-sm text-gray-600">
                        {payment.externalReference}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(payment.created_at).toLocaleDateString('pt-BR')}
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
            Mostrando {((currentPage - 1) * paymentsPerPage) + 1} a {Math.min(currentPage * paymentsPerPage, totalPayments)} de {totalPayments} pagamentos
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Arrecadado</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {filteredPayments
                    .filter(p => p.status === 'paid')
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pagamentos Processados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPayments.filter(p => p.status === 'paid').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pagamentos Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPayments.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}