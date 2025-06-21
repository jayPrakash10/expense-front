import { toast } from "sonner";
import {
  APIResponse,
  AuthResponse,
  OTPResponse,
  OTPVerification,
  SignupCredentials,
  User,
  Settings,
  Category,
  Expense,
  ExpenseResponse,
} from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const fetchWithAuth = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> => {
  const token = localStorage.getItem("expense-token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return { data };
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Request failed", {
      duration: 4000,
      position: "top-center",
      classNames: {
        error: "!bg-red-600",
      },
    });
    return {
      error: {
        message: error instanceof Error ? error.message : "Request failed",
      },
    };
  }
};

export const api = {
  auth: {
    googleSignIn: async (googleCredentials: {
      email: string;
      name: string;
      profile_img?: string;
    }) => fetchWithAuth<AuthResponse>(`${API_URL}/auth/google`, {
      method: "POST",
      body: JSON.stringify(googleCredentials),
    }),
    generateOTP: async (email: string) => {
      return fetchWithAuth<OTPResponse>(`${API_URL}/auth/send-otp`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },

    verifyOTP: async (verification: OTPVerification) => {
      return fetchWithAuth<AuthResponse>(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        body: JSON.stringify(verification),
      });
    },

    logout: async () => {
      localStorage.removeItem("expense-token");
      return { data: true };
    },
  },
  signup: {
    generateOTP: async (email: string) => {
      return fetchWithAuth<OTPResponse>(`${API_URL}/signup/generate-otp`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },

    createAccount: async (credentials: SignupCredentials) => {
      return fetchWithAuth<AuthResponse>(`${API_URL}/signup/verify-otp`, {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    },
  },
  categories: {
    getCategories: async () => {
      return fetchWithAuth<APIResponse<Category[]>>(
        `${API_URL}/subcategories`,
        {
          method: "GET",
        }
      );
    },
  },
  expenses: {
    getRecents: async ({
      limit,
      page = 1,
      mode,
      startDate,
      endDate,
      sub_category,
    }: {
      limit?: number;
      page?: number;
      mode?: string;
      startDate?: string;
      endDate?: string;
      sub_category?: string;
    }) => {
      return fetchWithAuth<APIResponse<ExpenseResponse[]>>(
        `${API_URL}/expenses?limit=${limit}&page=${page}${
          mode ? `&mode_of_payment=${mode}` : ""
        }${startDate ? `&startDate=${startDate}` : ""}${
          endDate ? `&endDate=${endDate}` : ""
        }${sub_category ? `&subcategory_id=${sub_category}` : ""}`,
        {
          method: "GET",
        }
      );
    },
    create: async (
      expense: Omit<Expense, "_id" | "createdAt" | "updatedAt" | "__v">
    ) => {
      return fetchWithAuth<APIResponse<Expense>>(`${API_URL}/expenses`, {
        method: "POST",
        body: JSON.stringify(expense),
      });
    },
    delete: async (id: string) => {
      return fetchWithAuth<APIResponse<void>>(`${API_URL}/expenses/${id}`, {
        method: "DELETE",
      });
    },
    deleteMultiple: async (ids: string[]) => {
      return fetchWithAuth<APIResponse<void>>(`${API_URL}/expenses/bulk`, {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      });
    },
    update: async (
      id: string,
      data: {
        subcategory_id?: string;
        amount?: number;
        date?: string;
        mode_of_payment?: string;
      }
    ) => {
      return fetchWithAuth<APIResponse<Expense>>(`${API_URL}/expenses/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    getMonthlyAnalytics: async ({
      month,
      year,
    }: {
      month: number;
      year: number;
    }) => {
      return fetchWithAuth<APIResponse<any>>(
        `${API_URL}/expenses/month?month=${month}&year=${year}`,
        {
          method: "GET",
        }
      );
    },
    getYearlyAnalytics: async ({ year }: { year: number }) => {
      return fetchWithAuth<APIResponse<any>>(
        `${API_URL}/expenses/year?year=${year}`,
        {
          method: "GET",
        }
      );
    },
  },
  user: {
    getProfile: async () => {
      return fetchWithAuth<APIResponse<{ user: User; settings: Settings }>>(
        `${API_URL}/users/profile`,
        {
          method: "GET",
        }
      );
    },
    update: async (data: Partial<User>) => {
      return fetchWithAuth<APIResponse<User>>(`${API_URL}/users`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    updateSettings: async (data: Partial<Settings>) => {
      return fetchWithAuth<APIResponse<Settings>>(`${API_URL}/settings`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
  },
};
