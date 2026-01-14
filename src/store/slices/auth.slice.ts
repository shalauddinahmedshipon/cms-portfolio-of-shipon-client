import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  role: "ADMIN" | "CONTENT_MANAGER";
  fullName?: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}


const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;


