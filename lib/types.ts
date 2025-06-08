export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  bio?: string;
  website?: string;
  created_at: string;
  projectsCount: number;
  activeProjectsCount: number;
  totalSpent: number;
  lastLogin?: string;
  active?: boolean;
}

export interface Project {
  id: string;
  name: string;
  business_name: string;
  profileId: string;
  profileName: string;
  planStatus: string;
  planExpiresOn: string;
  membersCount: number;
  created_at: string;
  description?: string;
  active?: boolean;
}

export interface Plan {
  id: string;
  projectId: string;
  payerId: string;
  projectSizeLimit: number;
  price: number;
  status: string;
  expiresOn: string;
  paiedIn: string;
  created_at: string;
  projects: {
    name: string;
    business_name: string;
  };
  profiles: {
    name: string;
    email: string;
  };
}

export interface Payment {
  id: string;
  profileId: string;
  amount: number;
  planId: string;
  method: string;
  status: string;
  externalReference: string;
  lastPaymentId: string;
  created_at: string;
  profiles: {
    name: string;
    email: string;
  };
}

export interface Analytics {
  monthlyRevenue: number;
  totalUsers: number;
  activeProjects: number;
  expiredProjects: number;
  totalProjects: number;
  totalPayments: number;
  recentPayments: Payment[];
  userGrowth: Array<{
    month: string;
    count: number;
  }>;
  revenueGrowth: Array<{
    month: string;
    revenue: number;
  }>;
}

export interface AuthResponse {
  access_token: string;
  expires_in: number;
}

export interface ApiResponse<T> {
  data?: T;
  users?: T;
  projects?: T;
  plans?: T;
  payments?: T;
  total?: number;
  message?: string;
}