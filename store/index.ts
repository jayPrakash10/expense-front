import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userReducer from './slices/userSlice';
import globalReducer from './slices/globalSlice';
import categoryReducer from './slices/categorySlice';
import expenseReducer from './slices/expenseSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    global: globalReducer,
    categories: categoryReducer,
    expenses: expenseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
