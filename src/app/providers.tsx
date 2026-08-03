import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "../features/auth/AuthProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
