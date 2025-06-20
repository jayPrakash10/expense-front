import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExpenseResponse, Pagination } from "@/types/api";

interface ExpenseState {
  expenses: ExpenseResponse[];
  recentExpenses: ExpenseResponse[];
  dashboardAnalytics: {
    totalAmount: number;
    barChartData: {
      date: string;
      amount: number;
    }[];
    pieChartData: {
      name: string;
      amount: number;
      fill: string;
    }[];
  };
  monthlyAnalytics: {
    totalAmount: number;
    barChartData: {
      date: string;
      amount: number;
    }[];
    pieChartData: {
      name: string;
      amount: number;
      fill: string;
    }[];
    expenses: ExpenseResponse[];
    topPaymentMode: {
      mostUsedPaymentMode: {
        mode: string;
        amount: number;
      };
      highestAmountPaymentMode: {
        mode: string;
        amount: number;
      };
    };
  };
  yearlyAnalytics: {
    totalAmount: number;
    barChartData: {
      date: string;
      amount: number;
    }[];
    pieChartData: {
      name: string;
      amount: number;
      fill: string;
    }[];
    expenses: ExpenseResponse[];
    topPaymentMode: {
      mostUsedPaymentMode: {
        mode: string;
        amount: number;
      };
      highestAmountPaymentMode: {
        mode: string;
        amount: number;
      };
    };
  };
}

const initialState: ExpenseState = {
  expenses: [],
  recentExpenses: [],
  dashboardAnalytics: {
    totalAmount: 0,
    barChartData: [],
    pieChartData: [],
  },
  monthlyAnalytics: {
    totalAmount: 0,
    barChartData: [],
    pieChartData: [],
    expenses: [],
    topPaymentMode: {
      mostUsedPaymentMode: {
        mode: "",
        amount: 0,
      },
      highestAmountPaymentMode: {
        mode: "",
        amount: 0,
      },
    },
  },
  yearlyAnalytics: {
    totalAmount: 0,
    barChartData: [],
    pieChartData: [],
    expenses: [],
    topPaymentMode: {
      mostUsedPaymentMode: {
        mode: "",
        amount: 0,
      },
      highestAmountPaymentMode: {
        mode: "",
        amount: 0,
      },
    },
  },
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenses: (state, action: PayloadAction<ExpenseResponse[]>) => {
      state.expenses = action.payload;
    },
    updateExpense: (state, action: PayloadAction<ExpenseResponse>) => {
      const index = state.expenses.findIndex(
        (expense) => expense._id === action.payload._id
      );
      if (index !== -1) {
        state.expenses[index] = action.payload;
      } else {
        state.expenses.unshift(action.payload);
      }
    },
    setRecentExpenses: (state, action: PayloadAction<ExpenseResponse[]>) => {
      state.recentExpenses = action.payload;
    },
    setDashboardAnalytics: (state, action: PayloadAction<any>) => {
      state.dashboardAnalytics = action.payload;
    },
    setMonthlyAnalytics: (state, action: PayloadAction<any>) => {
      state.monthlyAnalytics = action.payload;
    },
    setYearlyAnalytics: (state, action: PayloadAction<any>) => {
      state.yearlyAnalytics = action.payload;
    },
  },
});

export const {
  setExpenses,
  updateExpense,
  setRecentExpenses,
  setDashboardAnalytics,
  setMonthlyAnalytics,
  setYearlyAnalytics,
} = expenseSlice.actions;

export default expenseSlice.reducer;
