// import { AuthState, User } from "@/types/auth.types";
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// const initialState: AuthState = {
//   user: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setCredentials: (state, action: PayloadAction<{ user: User }>) => {
//       state.user = action.payload.user;
//       state.isAuthenticated = true;
//     },
//     setUser: (state, action: PayloadAction<Partial<User>>) => {
//       if (state.user) {
//         state.user = { ...state.user, ...action.payload };
//       }
//     },
//     logout: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { setCredentials, setUser, logout } = authSlice.actions;
// export default authSlice.reducer;


import { AuthState, User } from "@/types/auth.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
        setUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials,setUser, logout } = authSlice.actions;
export default authSlice.reducer;
