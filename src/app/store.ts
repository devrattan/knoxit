import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";
import { knoxitApi } from "../services/api/knoxitApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [knoxitApi.reducerPath]: knoxitApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(knoxitApi.middleware)
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
