import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { useGetSessionQuery } from "../../services/api/knoxitApi";
import { sessionLoaded } from "./authSlice";

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { data, isError, isFetching, isLoading } = useGetSessionQuery();

  useEffect(() => {
    // A login invalidates the cached session and triggers a background fetch.
    // Do not overwrite the just-authenticated Redux state with the previous
    // guest/error result while that request is still in flight.
    if (isLoading || isFetching) return;
    dispatch(sessionLoaded(isError ? null : data?.user ?? null));
  }, [data, dispatch, isError, isFetching, isLoading]);

  return <>{children}</>;
}
