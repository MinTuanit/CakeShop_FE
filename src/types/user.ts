export interface User {
  _id?: string;
  name: string;
  phone: string;
  password?: string;
  role: string;
  email?: string;
  address?: string;
  isActive: boolean;
  avatar?: string;
  dateOfBirth?: string; // ISO string, nếu trả về từ BE là string
  lastLogin?: string;   // ISO string, nếu trả về từ BE là string
  refreshToken?: string;
}
