import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, Subcategory } from "@/types/api";

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
      state.categories.sort((a, b) =>
        a.category_name.localeCompare(b.category_name)
      );
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(
        (cat) => cat._id === action.payload._id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    addSubcategory: (
      state,
      action: PayloadAction<{ cat_id: string; sub_cat: Subcategory[] }>
    ) => {
      const index = state.categories.findIndex(
        (cat) => cat._id === action.payload.cat_id
      );

      if (index !== -1) {
        const subcategories = [...action.payload.sub_cat].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        state.categories[index].subcategories = subcategories;
      }
    },
    updateSubcategory: (
      state,
      action: PayloadAction<{ cat_id: string; sub_cat: Subcategory }>
    ) => {
      const index = state.categories.findIndex(
        (cat) => cat._id === action.payload.cat_id
      );

      if (index !== -1) {
        const subcategories = state.categories[index].subcategories?.map(
          (sub) => {
            if (sub._id === action.payload.sub_cat._id) {
              return action.payload.sub_cat;
            }
            return sub;
          }
        );
        state.categories[index].subcategories = subcategories;
      }
    },
    removeCategory: (state, action: PayloadAction<string[]>) => {
      state.categories = state.categories.filter(
        (cat) => !action.payload.includes(cat._id)
      );
    },
    removeSubcategory: (state, action: PayloadAction<string[]>) => {
      state.categories = state.categories.map((cat) => {
        return {
          ...cat,
          subcategories: cat.subcategories?.filter(
            (sub) => !action.payload.includes(sub._id)
          ),
        };
      });
    },
  },
});

export const {
  setCategories,
  setLoading,
  setError,
  addCategory,
  updateCategory,
  addSubcategory,
  updateSubcategory,
  removeCategory,
  removeSubcategory,
} = categorySlice.actions;

export default categorySlice.reducer;
