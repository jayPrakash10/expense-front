import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, Settings } from "@/types/api";

interface AuthState {
  user: User | null;
  settings: Settings;
}

const initialState: AuthState = {
  user: null,
  settings: {
    currency: "",
    language: "en",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setSettings: (state, action: PayloadAction<Settings>) => {
      state.settings = action.payload;
    },
    updateSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const { setUser, updateUser, setSettings, updateSettings } =
  userSlice.actions;

export default userSlice.reducer;
