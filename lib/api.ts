import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5003';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to automatically attach JWT token if present
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- TYPE DEFINITIONS ---

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminProfile {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AdminProfile;
}

export interface Member {
  id: number;
  fullName: string;
  memberId: string;
  phone: string;
  email: string | null;
  emergencyContact: string | null;
  telegramUsername: string | null;
  serviceType: string | null;
  membershipTier: string | null;
  status: 'active' | 'inactive' | 'frozen' | 'pending' | 'expired';
  startDate: string | null;
  endDate: string | null;
  registrationDate: string;
  service?: {
    id: number;
    name: string;
    price: number;
  } | null;
}

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  frozenMembers: number;
  pendingMembers: number;
}

export interface Attendance {
  id: number;
  date: string;
  member: Member | null;
  memberId: number;
}

export interface AttendanceStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  averageDaily: number;
}

export interface TodayCheckIn {
  id: number;
  memberName: string;
  checkInTime: string;
}

export interface TodayAttendance {
  count: number;
  checkIns: TodayCheckIn[];
}

export type TransactionType = 'income' | 'expense' | 'positive_return' | 'negative_return';

export interface Transaction {
  id: number;
  type: TransactionType;
  description: string | null;
  category: string;
  transactionDate: string;
  paymentMethod: string | null;
  amount: number;
  member: Member | null;
}

export interface HealthMetric {
  id: number;
  measuredAt: string;
  weight: number | null;
  bmi: number | null;
  bodyFatPercent: number | null;
  muscleMass: number | null;
}

export interface Service {
  id: number;
  name: string;
  category: string | null;
  description: string | null;
  duration: number;
  durationUnit: string;
  price: number;
}

export interface ServiceStats {
  total: number;
  active: number;
  inactive: number;
  categories: number;
  byCategory: Array<{ category: string; count: number }>;
}

export interface Staff {
  id: number;
  fullName: string;
  localId: string;
  role: string | null;
  phoneNumber: string | null;
}

export interface StaffAttendance {
  id: number;
  scannedAt: string | null;
  staff: Staff | null;
}

export interface SmsBalance {
  balance: string;
  estimatedMessages: number;
}

export interface SmsHistory {
  id: number;
  phoneNumber: string;
  message: string;
  status: string;
  sentAt: string | null;
  memberId?: number;
}

export interface PotentialCustomer {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  serviceId: number | null;
  registeredAt: string;
  status: string;
}

export interface DashboardOverview {
  totalMembers: number;
  activeMembers: number;
  attendanceToday: number;
  revenueThisMonth: number;
  newMembersThisMonth: number;
}

export interface RevenueBreakdown {
  thisMonth: number;
  thisYear: number;
  byMonth: Array<{ month: string; revenue: number }>;
  byCategory: Array<{ category: string; revenue: number }>;
}

export interface MemberGrowth {
  total: number;
  newThisMonth: number;
  newLastMonth: number;
  monthOverMonthGrowth: number;
}

// --- API CLIENTS ---

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/auth/login', { email, password });
    return response.data;
  },
  getProfile: async (): Promise<AdminProfile> => {
    const response = await api.get<AdminProfile>('/api/auth/profile');
    return response.data;
  },
  updateProfile: async (data: { email?: string; password?: string; currentPassword?: string }): Promise<AdminProfile> => {
    const response = await api.put<AdminProfile>('/api/auth/profile', data);
    return response.data;
  },
};

export const membersApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<PaginatedResponse<Member>> => {
    const response = await api.get<PaginatedResponse<Member>>('/api/members', { params });
    return response.data;
  },
  getOne: async (id: number): Promise<Member> => {
    const response = await api.get<Member>(`/api/members/${id}`);
    return response.data;
  },
  getStats: async (): Promise<MemberStats> => {
    const response = await api.get<MemberStats>('/api/members/stats');
    return response.data;
  },
  search: async (q: string, limit?: number): Promise<Member[]> => {
    const response = await api.get<Member[]>('/api/members/search', { params: { q, limit } });
    return response.data;
  },
};

export const attendanceApi = {
  getAll: async (params?: { page?: number; limit?: number; startDate?: string; endDate?: string }): Promise<PaginatedResponse<Attendance>> => {
    const response = await api.get<PaginatedResponse<Attendance>>('/api/attendance', { params });
    return response.data;
  },
  getStats: async (): Promise<AttendanceStats> => {
    const response = await api.get<AttendanceStats>('/api/attendance/stats');
    return response.data;
  },
  getToday: async (): Promise<TodayAttendance> => {
    const response = await api.get<TodayAttendance>('/api/attendance/today');
    return response.data;
  },
  getByMember: async (memberId: number, params?: { limit?: number }): Promise<PaginatedResponse<Attendance>> => {
    const response = await api.get<PaginatedResponse<Attendance>>(`/api/attendance/member/${memberId}`, { params });
    return response.data;
  },
};

export const transactionsApi = {
  getAll: async (params?: { page?: number; limit?: number; transactionType?: string; startDate?: string; endDate?: string }): Promise<PaginatedResponse<Transaction>> => {
    const response = await api.get<PaginatedResponse<Transaction>>('/api/transactions', { params });
    return response.data;
  },
  getByMember: async (memberId: number, params?: { limit?: number }): Promise<PaginatedResponse<Transaction>> => {
    const response = await api.get<PaginatedResponse<Transaction>>(`/api/transactions/member/${memberId}`, { params });
    return response.data;
  },
};

export const healthMetricsApi = {
  getByMember: async (memberId: number, params?: { limit?: number }): Promise<PaginatedResponse<HealthMetric>> => {
    const response = await api.get<PaginatedResponse<HealthMetric>>(`/api/health-metrics/member/${memberId}`, { params });
    return response.data;
  },
};

export const servicesApi = {
  getAll: async (params?: { category?: string }): Promise<PaginatedResponse<Service>> => {
    const response = await api.get<PaginatedResponse<Service>>('/api/services', { params });
    return response.data;
  },
  getStats: async (): Promise<ServiceStats> => {
    const response = await api.get<ServiceStats>('/api/services/stats');
    return response.data;
  },
};

export const staffApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Staff>> => {
    const response = await api.get<PaginatedResponse<Staff>>('/api/staff', { params });
    return response.data;
  },
  getAttendanceByDate: async (date: string): Promise<StaffAttendance[]> => {
    const response = await api.get<StaffAttendance[]>('/api/staff-attendance/by-date', { params: { date } });
    return response.data;
  },
  getAttendanceByStaff: async (staffId: number, fromDate: string, toDate: string): Promise<StaffAttendance[]> => {
    const response = await api.get<StaffAttendance[]>(`/api/staff/${staffId}/attendance`, { params: { fromDate, toDate } });
    return response.data;
  },
};

export const syncApi = {
  getLastSync: async (): Promise<{ lastSyncAt: string | null }> => {
    const response = await api.get<{ lastSyncAt: string | null }>('/api/sync/last-sync');
    return response.data;
  },
};

export const potentialCustomersApi = {
  getPotentialCustomers: async (status?: string, limit?: number, offset?: number): Promise<{ data: PotentialCustomer[]; total: number }> => {
    const response = await api.get<{ data: PotentialCustomer[]; total: number }>('/api/admin/potential-customers', { params: { status, limit, offset } });
    return response.data;
  },
  register: async (data: {
    fullName: string;
    phoneNumber: string;
    email?: string;
    serviceId?: number;
    notes?: string;
    age?: number;
    height?: string;
    telegramUsername?: string;
    remark?: string;
    objective?: string;
  }): Promise<any> => {
    const response = await api.post('/api/public/register', data);
    return response.data;
  },
};

export const smsApi = {
  getBalance: async (): Promise<SmsBalance> => {
    const response = await api.get<SmsBalance>('/api/sms/balance');
    return response.data;
  },
  sendSingle: async (phone: string, message: string, memberId?: number): Promise<any> => {
    const response = await api.post('/api/sms/send', { phone, message, memberId });
    return response.data;
  },
  sendBulk: async (phones: string[], message: string, campaign?: string): Promise<{ campaignId: string | null; count: number }> => {
    const response = await api.post<{ campaignId: string | null; count: number }>('/api/sms/bulk', { phones, message, campaign });
    return response.data;
  },
  getHistory: async (params?: { page?: number; limit?: number; days?: number }): Promise<PaginatedResponse<SmsHistory>> => {
    const response = await api.get<PaginatedResponse<SmsHistory>>('/api/sms/history', { params });
    return response.data;
  },
};

export const dashboardApi = {
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await api.get<DashboardOverview>('/api/dashboard/stats');
    return response.data;
  },
  getRevenue: async (): Promise<RevenueBreakdown> => {
    const response = await api.get<RevenueBreakdown>('/api/dashboard/revenue');
    return response.data;
  },
  getMemberGrowth: async (): Promise<MemberGrowth> => {
    const response = await api.get<MemberGrowth>('/api/dashboard/member-growth');
    return response.data;
  },
};
