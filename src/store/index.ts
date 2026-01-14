import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/auth.slice";
import { baseApi } from "./api/baseApi";

// 🔹 Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // persist ONLY auth
};

// 🔹 Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

// 🔹 Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // REQUIRED for redux-persist
    }).concat(baseApi.middleware),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
