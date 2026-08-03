import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { useGetSessionQuery } from "../../services/api/knoxitApi";
import { sessionLoaded } from "./authSlice";

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { data, isError, isLoading } = useGetSessionQuery();

  useEffect(() => {
    if (isLoading) return;
    dispatch(sessionLoaded(isError ? null : data?.user ?? null));
  }, [data, dispatch, isError, isLoading]);

  return <>{children}</>;
}
