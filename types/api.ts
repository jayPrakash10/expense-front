export interface APIResponse<T = any> {
  data?: T;
  meta?: Pagination;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

export interface AuthResponse {
  message: string;
  success: boolean;
  data?: {
    token: string;
    user: User;
  };
}

export interface OTPResponse {
  message: string;
  success: boolean;
  data?: {
    email: string;
  };
}

export interface OTPVerification {
  email: string;
  otp: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  otp: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string | null;
  profile_img: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Settings {
  _id?: string;
  user_id?: string;
  currency?: string;
  language?: string;
  quickAdd?: Subcategory[];
  currentIncome?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Expense {
  _id?: string;
  category_id?: string;
  subcategory_id: string;
  mode_of_payment: string;
  amount: number;
  date: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Subcategory {
  _id: string;
  name: string;
  color: string;
}

export interface CreateSubcategory {
  name: string;
  color: string;
}

export interface CreateBulkSubcategory {
  category_id: string;
  subcategories: CreateSubcategory[];
}

export interface Category {
  _id: string;
  category_name: string;
  category_color: string;
  subcategories?: Subcategory[];
}

export interface CreateCategory {
  name: string;
  color: string;
  subcategories: CreateSubcategory[];
}

export interface ExpenseResponse {
  _id: string;
  user_id: User;
  subcategory_id: {
    _id: string;
    category_id: {
      _id: string;
      name: string;
    };
    name: string;
  };
  amount: number;
  date: string;
  mode_of_payment: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Overview {
  summary: {
    totalExpenses: number;
    monthlyIncome: number;
    remainingBalance: number;
    currency: string;
  };
  categories: {
    id: string;
    name: string;
    color: string;
    amount: number;
    percentage: number;
  }[];
}

export interface Pagination {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}
