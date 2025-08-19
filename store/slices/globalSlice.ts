import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaymentMode } from "@/constants/paymentModes";

interface GlobalState {
  category: string;
  mode: PaymentMode;
  amount: string;
  date: number | null;
  isAddExpenseOpen: boolean;
  isManageQuickAddOpen: boolean;
  isUpdateExpenseOpen: boolean;
  expenseId?: string;
}

const initialState: GlobalState = {
  category: "",
  mode: "" as PaymentMode,
  amount: "",
  date: new Date().getTime(),
  isAddExpenseOpen: false,
  isManageQuickAddOpen: false,
  isUpdateExpenseOpen: false,
  expenseId: undefined,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setAddExpenseCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setAddExpenseMode: (state, action: PayloadAction<PaymentMode>) => {
      state.mode = action.payload;
    },
    setAddExpenseAmount: (state, action: PayloadAction<string>) => {
      state.amount = action.payload;
    },
    setAddExpenseDate: (state, action: PayloadAction<number | null>) => {
      state.date = action.payload;
    },
    resetAddExpenseForm: (state) => {
      state.category = "";
      state.mode = "" as PaymentMode;
      state.amount = "";
      state.date = new Date().getTime();
      state.expenseId = undefined;
    },
    toggleAddExpenseDialog: (state, action: PayloadAction<boolean>) => {
      state.isAddExpenseOpen = action.payload;
    },
    toggleManageQuickAddDialog: (state, action: PayloadAction<boolean>) => {
      state.isManageQuickAddOpen = action.payload;
    },
    toggleUpdateExpenseDialog: (state, action: PayloadAction<boolean>) => {
      state.isUpdateExpenseOpen = action.payload;
    },
    setExpenseId: (state, action: PayloadAction<string>) => {
      state.expenseId = action.payload;
    },
  },
});

export const {
  setAddExpenseCategory,
  setAddExpenseMode,
  setAddExpenseAmount,
  setAddExpenseDate,
  resetAddExpenseForm,
  toggleAddExpenseDialog,
  toggleManageQuickAddDialog,
  toggleUpdateExpenseDialog,
  setExpenseId,
} = globalSlice.actions;

export default globalSlice.reducer;
