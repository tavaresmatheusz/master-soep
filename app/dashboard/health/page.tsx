'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { checkHealth } from '@/lib/actions';
import { 
  Activity, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Server,
  Database,
  Wifi,
  Clock
} from 'lucide-react';

interface HealthStatus {
  status: string;
  timestamp: string;
  message: string;
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    checkHealthStatus();
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(checkHealthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealthStatus = async () => {
    try {
      setLoading(true);
      const data = await checkHealth();
      setHealth(data);
      setLastChecked(new Date());
      setError('');
    } catch (err: any) {
      setError(err.message || 'Erro ao verificar saúde do sistema');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'error':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Activity className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ok':
        return 'Sistema Operacional';
      case 'warning':
        return 'Atenção Necessária';
      case 'error':
        return 'Sistema com Problemas';
      default:
        return 'Status Desconhecido';
    }
  };

  // Dados simulados para demonstração
  const systemMetrics = [
    {
      name: 'API Server',
      status: 'ok',
      icon: Server,
      description: 'Servidor principal funcionando normalmente',
      uptime: '99.9%',
      responseTime: '45ms'
    },
    {
      name: 'Database',
      status: 'ok',
      icon: Database,
      description: 'Banco de dados Supabase conectado',
      uptime: '99.8%',
      responseTime: '12ms'
    },
    {
      name: 'External APIs',
      status: 'ok',
      icon: Wifi,
      description: 'Integrações externas funcionando',
      uptime: '98.5%',
      responseTime: '120ms'
    },
    {
      name: 'Background Jobs',
      status: 'ok',
      icon: Clock,
      description: 'Processamento em segundo plano ativo',
      uptime: '99.2%',
      responseTime: 'N/A'
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saúde do Sistema</h1>
            <p className="mt-2 text-gray-600">Monitoramento em tempo real da plataforma</p>
          </div>
          <button
            onClick={checkHealthStatus}
            className="btn-primary flex items-center"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Verificar Agora
          </button>
        </div>

        {/* Status Principal */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {health ? getStatusIcon(health.status) : <Activity className="h-6 w-6 text-gray-600" />}
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {health ? getStatusText(health.status) : 'Verificando...'}
                </h2>
                <p className="text-gray-600">
                  {health ? health.message : 'Aguardando verificação de saúde'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
                health ? `${getStatusBgColor(health.status)} ${getStatusColor(health.status)}` : 'bg-gray-100 text-gray-600'
              }`}>
                {health ? health.status.toUpperCase() : 'CHECKING'}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Última verificação: {lastChecked.toLocaleTimeString('pt-BR')}
              </p>
            </div>
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

        {/* Métricas do Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${getStatusBgColor(metric.status)}`}>
                    <Icon className={`h-6 w-6 ${getStatusColor(metric.status)}`} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{metric.name}</h3>
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      getStatusBgColor(metric.status)
                    } ${getStatusColor(metric.status)}`}>
                      {metric.status.toUpperCase()}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{metric.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Uptime:</span>
                    <span className="font-medium text-gray-900">{metric.uptime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tempo de Resposta:</span>
                    <span className="font-medium text-gray-900">{metric.responseTime}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Histórico de Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Status (Últimas 24h)</h3>
          <div className="space-y-4">
            {[
              { time: '14:30', status: 'ok', message: 'Todos os sistemas operacionais' },
              { time: '14:00', status: 'ok', message: 'Verificação de rotina concluída' },
              { time: '13:30', status: 'ok', message: 'Backup automático realizado' },
              { time: '13:00', status: 'warning', message: 'Latência elevada detectada - resolvida automaticamente' },
              { time: '12:30', status: 'ok', message: 'Sistema funcionando normalmente' },
            ].map((entry, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${getStatusBgColor(entry.status)}`}>
                  {getStatusIcon(entry.status)}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{entry.message}</p>
                    <span className="text-xs text-gray-500">{entry.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h4 className="text-md font-semibold text-gray-900 mb-2">Versão da API</h4>
            <div className="text-2xl font-bold text-blue-600">v1.2.3</div>
            <p className="text-sm text-gray-600">Última atualização: 15/01/2024</p>
          </div>

          <div className="card">
            <h4 className="text-md font-semibold text-gray-900 mb-2">Ambiente</h4>
            <div className="text-2xl font-bold text-green-600">Produção</div>
            <p className="text-sm text-gray-600">Região: São Paulo (sa-east-1)</p>
          </div>

          <div className="card">
            <h4 className="text-md font-semibold text-gray-900 mb-2">Próxima Manutenção</h4>
            <div className="text-2xl font-bold text-orange-600">20/01/2024</div>
            <p className="text-sm text-gray-600">Janela: 02:00 - 04:00 (UTC-3)</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}