'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { analyticsApi } from '@/lib/api';
import { Analytics } from '@/lib/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  FolderOpen, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsApi.getAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  if (!analytics) return null;

  const statsCards = [
    {
      title: 'Receita Mensal',
      value: `R$ ${analytics.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Total de Usuários',
      value: analytics.totalUsers.toLocaleString('pt-BR'),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+8.2%',
      changeType: 'positive'
    },
    {
      title: 'Projetos Ativos',
      value: analytics.activeProjects.toLocaleString('pt-BR'),
      icon: FolderOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+15.3%',
      changeType: 'positive'
    },
    {
      title: 'Total de Pagamentos',
      value: analytics.totalPayments.toLocaleString('pt-BR'),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+22.1%',
      changeType: 'positive'
    }
  ];

  const projectsData = [
    { name: 'Ativos', value: analytics.activeProjects, color: '#10B981' },
    { name: 'Expirados', value: analytics.expiredProjects, color: '#EF4444' }
  ];

  const paymentMethodsData = [
    { name: 'Cartão de Crédito', value: 45, color: '#3B82F6' },
    { name: 'PIX', value: 30, color: '#10B981' },
    { name: 'Cartão de Débito', value: 20, color: '#F59E0B' },
    { name: 'Transferência', value: 5, color: '#EF4444' }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Detalhados</h1>
            <p className="mt-2 text-gray-600">Análise completa da performance da plataforma</p>
          </div>
          <button
            onClick={loadAnalytics}
            className="btn-primary flex items-center"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <p className="text-xs text-gray-500">vs mês anterior</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Crescimento de Usuários */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crescimento de Usuários</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Crescimento de Receita */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crescimento de Receita</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.revenueGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Receita']} />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Status dos Projetos */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Projetos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pagamentos Recentes Detalhados */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimos Pagamentos</h3>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Método</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentPayments.slice(0, 10).map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <div className="font-medium text-gray-900">{payment.id}</div>
                    </td>
                    <td>
                      <div className="font-semibold text-gray-900">
                        R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">{payment.method}</span>
                    </td>
                    <td>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">
                        {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights e Métricas Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h4 className="text-md font-semibold text-gray-900 mb-2">Taxa de Conversão</h4>
            <div className="text-3xl font-bold text-green-600">87.5%</div>
            <p className="text-sm text-gray-600">Usuários que se tornaram pagantes</p>
          </div>

          <div className="card">
            <h4 className="text-md font-semibold text-gray-900 mb-2">Ticket Médio</h4>
            <div className="text-3xl font-bold text-blue-600">
              R$ {(analytics.monthlyRevenue / analytics.totalPayments).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-gray-600">Valor médio por pagamento</p>
          </div>

          <div className="card">
            <h4 className="text-md font-semibold text-gray-900 mb-2">Projetos por Usuário</h4>
            <div className="text-3xl font-bold text-purple-600">
              {(analytics.totalProjects / analytics.totalUsers).toFixed(1)}
            </div>
            <p className="text-sm text-gray-600">Média de projetos por usuário</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}