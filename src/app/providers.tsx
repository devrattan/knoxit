import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "../features/auth/AuthProvider";
import { ThemeProvider } from "../features/theme/theme";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
