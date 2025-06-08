import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthResponse, Analytics, User, Project, Plan, Payment, ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = Cookies.get('master_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('master_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (totpCode: string): Promise<AuthResponse> => {
    const response = await api.post('/master/auth', { totpCode });
    return response.data;
  },
};

export const analyticsApi = {
  getAnalytics: async (): Promise<Analytics> => {
    const response = await api.get('/master/analytics');
    return response.data;
  },
  
  getSummary: async (): Promise<any> => {
    const response = await api.get('/master/stats/summary');
    return response.data;
  },
};

export const usersApi = {
  getUsers: async (page = 1, limit = 20): Promise<ApiResponse<User[]>> => {
    const response = await api.get(`/master/users?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/master/users/${id}`);
    return response.data;
  },
  
  updateUser: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put(`/master/users/${id}`, data);
    return response.data;
  },
  
  deleteUser: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/master/users/${id}`);
    return response.data;
  },
};

export const projectsApi = {
  getProjects: async (page = 1, limit = 20): Promise<ApiResponse<Project[]>> => {
    const response = await api.get(`/master/projects?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  updateProject: async (id: string, data: Partial<Project>): Promise<ApiResponse<Project>> => {
    const response = await api.put(`/master/projects/${id}`, data);
    return response.data;
  },
  
  deleteProject: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/master/projects/${id}`);
    return response.data;
  },
};

export const plansApi = {
  getPlans: async (page = 1, limit = 20): Promise<ApiResponse<Plan[]>> => {
    const response = await api.get(`/master/plans?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  updatePlan: async (id: string, data: Partial<Plan>): Promise<ApiResponse<Plan>> => {
    const response = await api.put(`/master/plans/${id}`, data);
    return response.data;
  },
};

export const paymentsApi = {
  getPayments: async (page = 1, limit = 20): Promise<ApiResponse<Payment[]>> => {
    const response = await api.get(`/master/payments?page=${page}&limit=${limit}`);
    return response.data;
  },
};

export const healthApi = {
  checkHealth: async (): Promise<any> => {
    const response = await api.get('/master/health');
    return response.data;
  },
};

export default api;