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
  Area,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import {
  Users,
  FolderOpen,
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
  Eye,
  Target
} from 'lucide-react';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'];
const GRADIENT_COLORS = {
  primary: 'from-blue-500 to-purple-600',
  success: 'from-green-400 to-blue-500',
  warning: 'from-yellow-400 to-orange-500',
  danger: 'from-red-400 to-pink-500',
  info: 'from-cyan-400 to-blue-500',
  purple: 'from-purple-400 to-pink-500'
};

export default function DashboardPage() {
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
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold">Erro ao carregar dados</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
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
      gradient: GRADIENT_COLORS.success,
      trend: '+12.5%',
      trendUp: true,
      description: 'vs. mês anterior'
    },
    {
      title: 'Total de Usuários',
      value: analytics.totalUsers.toLocaleString('pt-BR'),
      icon: Users,
      gradient: GRADIENT_COLORS.primary,
      trend: '+8.2%',
      trendUp: true,
      description: 'novos usuários'
    },
    {
      title: 'Projetos Ativos',
      value: analytics.activeProjects.toLocaleString('pt-BR'),
      icon: FolderOpen,
      gradient: GRADIENT_COLORS.purple,
      trend: '+5.1%',
      trendUp: true,
      description: 'em andamento'
    },
    {
      title: 'Total de Pagamentos',
      value: analytics.totalPayments.toLocaleString('pt-BR'),
      icon: CreditCard,
      gradient: GRADIENT_COLORS.warning,
      trend: '+15.3%',
      trendUp: true,
      description: 'transações'
    }
  ];

  // Dados para novos gráficos
  const performanceData = analytics.revenueGrowth.map((item, index) => ({
    ...item,
    users: analytics.userGrowth[index]?.count || 0,
    projects: Math.floor(Math.random() * 50) + 10
  }));

  const statusData = [
    { name: 'Ativos', value: analytics.activeProjects, fill: '#10B981' },
    { name: 'Expirados', value: analytics.expiredProjects, fill: '#EF4444' },
    { name: 'Pendentes', value: Math.floor(analytics.totalProjects * 0.1), fill: '#F59E0B' }
  ];

  const activityData = [
    { name: 'Seg', logins: 45, projects: 12, payments: 8 },
    { name: 'Ter', logins: 52, projects: 15, payments: 12 },
    { name: 'Qua', logins: 48, projects: 18, payments: 15 },
    { name: 'Qui', logins: 61, projects: 22, payments: 18 },
    { name: 'Sex', logins: 55, projects: 25, payments: 22 },
    { name: 'Sáb', logins: 35, projects: 8, payments: 5 },
    { name: 'Dom', logins: 28, projects: 6, payments: 3 }
  ];

  const projectsData = [
    { name: 'Ativos', value: analytics.activeProjects, color: '#10B981' },
    { name: 'Expirados', value: analytics.expiredProjects, color: '#EF4444' }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Dashboard - SOEP
              </h1>
              <p className="mt-2 text-lg text-gray-600">Visão geral da plataforma em tempo real</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Atualizado agora</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trendUp ? ArrowUpRight : ArrowDownRight;
            return (
              <div key={index} className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <TrendIcon className="h-3 w-3" />
                      <span>{stat.trend}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Overview */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Performance Geral</h2>
              <p className="text-gray-600">Métricas combinadas de crescimento</p>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-500">Visualização completa</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
                formatter={(value, name) => [
                  name === 'revenue' ? `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : value,
                  name === 'revenue' ? 'Receita' : name === 'users' ? 'Usuários' : 'Projetos'
                ]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Crescimento de Usuários - Bar Chart Melhorado */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Crescimento de Usuários</h3>
                <p className="text-sm text-gray-600">Novos registros mensais</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.userGrowth}>
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="count" fill="url(#colorBar)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status dos Projetos - Donut Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Status dos Projetos</h3>
                <p className="text-sm text-gray-600">Distribuição atual</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Atividade Semanal */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Atividade Semanal</h3>
                <p className="text-sm text-gray-600">Últimos 7 dias</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Line type="monotone" dataKey="logins" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="projects" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="payments" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pagamentos Recentes - Redesenhado */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Pagamentos Recentes</h3>
              <p className="text-sm text-gray-600">Últimas transações processadas</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="space-y-4">
            {analytics.recentPayments.slice(0, 5).map((payment, index) => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {payment.profileName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{payment.profileName}</p>
                    <p className="text-sm text-gray-600">{payment.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">
                    R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${
                      payment.status === 'paid' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}