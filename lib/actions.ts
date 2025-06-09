'use server';

import { cookies } from 'next/headers';
import { Analytics } from './types';
import { authApi } from './api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('master_token')?.value;

  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function checkLogin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('master_token')?.value;
  if (!token) {
    return false;
  }
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}/master/analytics`, {
      method: 'GET',
      headers,
      cache: 'no-store', // Para sempre buscar dados atualizados
    });

    if (!response.ok) {
      if (response.status === 401) {
        return false; // Token inválido ou expirado
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true; // Login válido
  } catch (error) {
    console.error('Erro ao verificar login:', error);
    return false;
  }
}

export async function login(totpCode: string): Promise<{ access_token: string }> {
  try {
    const response = await authApi.login(totpCode);

    return response;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw new Error('Erro ao fazer login');
  }
}

export async function getAnalytics(): Promise<Analytics> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/master/analytics`, {
      method: 'GET',
      headers,
      cache: 'no-store', // Para sempre buscar dados atualizados
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar analytics:', error);
    throw new Error('Erro ao carregar analytics');
  }
}

export async function getSummary(): Promise<any> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/master/stats/summary`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar summary:', error);
    throw new Error('Erro ao carregar resumo');
  }
}

// Users Actions
export async function getUsers(page = 1, limit = 20): Promise<any> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/master/users?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw new Error('Erro ao carregar usuários');
  }
}

export async function updateUser(id: string, userData: any): Promise<any> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/master/users/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw new Error('Erro ao atualizar usuário');
  }
}

export async function deleteUser(id: string): Promise<any> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/master/users/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw new Error('Erro ao deletar usuário');
  }
}

// Projects Actions
export async function getProjects(page = 1, limit = 20): Promise<any> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/master/projects?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    throw new Error('Erro ao carregar projetos');
  }
}

export async function updateProject(id: string, projectData: any): Promise<any> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/master/projects/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    throw new Error('Erro ao atualizar projeto');
  }
}

export async function deleteProject(id: string): Promise<any> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/master/projects/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    throw new Error('Erro ao deletar projeto');
  }
}

// Payments Actions
export async function getPayments(page = 1, limit = 20): Promise<any> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/master/payments?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    throw new Error('Erro ao carregar pagamentos');
  }
}
// Plans Actions
export async function getPlans(page = 1, limit = 20): Promise<any> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/master/plans?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    throw new Error('Erro ao carregar planos');
  }
}

export async function updatePlan(id: string, planData: any): Promise<any> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/master/plans/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(planData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    throw new Error('Erro ao atualizar plano');
  }
}
// Health Actions
export async function checkHealth(): Promise<any> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/master/health`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao verificar saúde do sistema:', error);
    throw new Error('Erro ao verificar saúde do sistema');
  }
}
