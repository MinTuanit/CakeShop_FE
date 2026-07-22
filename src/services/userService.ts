import apiClient from "@/src/services/apiClient";

export interface UserStats {
  totalCustomers: number;
  averageSpending: number;
  activeRate: number;
}

export interface UserItem {
  _id: string;
  name: string;
  phone: string;
  role: string;
  email?: string;
  address?: string;
  isActive: boolean;
  avatar?: string;
  dateOfBirth?: string;
  lastLogin?: string;
  createdAt: string;
  totalSpending: number;
  totalOrders: number;
  badge: string;
  isVip: boolean;
}

export interface UsersResponse {
  users: UserItem[];
  total: number;
  page: number;
  limit: number;
  stats: UserStats;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  tab?: string;
  sortBy?: string;
}

export function getAllUsers(params: GetUsersParams = {}) {
  return apiClient.get<UsersResponse>("/users", {
    params,
    withCredentials: true,
  });
}

export function updateUserStatus(userId: string, isActive: boolean) {
  return apiClient.patch<{ user: UserItem }>(
    `/users/${userId}/status`,
    { isActive },
    { withCredentials: true }
  );
}

export function getCurrentUser() {
  return apiClient.get<{ user: UserItem | null }>("/users/me", {
    withCredentials: true,
  });
}
