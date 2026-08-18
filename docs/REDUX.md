**Redux in Knoxit — Quick Reference**

- **Purpose:** centralize app state (auth + RTK Query cache) and provide typed dispatch/selectors for the React app.

**Key files**
- **Store:** [src/app/store.ts](src/app/store.ts#L1) — `configureStore` registers reducers and middleware and calls `setupListeners`.
- **Auth slice:** [src/features/auth/authSlice.ts](src/features/auth/authSlice.ts#L1) — `sessionLoaded` and `signedOut` reducers.
- **RTK Query API:** [src/services/api/knoxitApi.ts](src/services/api/knoxitApi.ts#L1) — `createApi` endpoints (generates `useGetSessionQuery`, `useLoginMutation`, etc.).
- **Typed hooks:** [src/app/hooks.ts](src/app/hooks.ts#L1) — `useAppDispatch`, `useAppSelector` (typed with `AppDispatch` / `RootState`).
- **Provider setup:** [src/app/providers.tsx](src/app/providers.tsx#L1) — wraps app with Redux `Provider`.

**How it fits in the app**
- `AppProviders` mounts the Redux store so any component can `dispatch` actions or `select` state.
- RTK Query is integrated into the store (reducer + middleware) so data fetching is declarative and cached.

**Concrete session flow (example)**
1. `AuthProvider` calls `useGetSessionQuery()` (RTK Query) to fetch current session: see [src/features/auth/AuthProvider.tsx](src/features/auth/AuthProvider.tsx#L1).
2. When the query finishes, `AuthProvider` dispatches `sessionLoaded(userOrNull)` to update the `auth` slice (action created by `createSlice`).
3. Other components read the current auth status via `useAppSelector(state => state.auth.status)` — e.g., `ProtectedRoute` uses this to either show loading, redirect to `/login`, or render the protected page: [src/features/auth/ProtectedRoute.tsx](src/features/auth/ProtectedRoute.tsx#L1).

**RTK Query notes**
- Endpoints are declared in [src/services/api/knoxitApi.ts](src/services/api/knoxitApi.ts#L1). RTK Query generates hooks like `useGetSessionQuery`, `useLoginMutation`, `useGetLeaguesQuery`.
- The API reducer is mounted on the store and the API middleware is added in [src/app/store.ts](src/app/store.ts#L1), enabling cache invalidation and automated refetch behaviors.

**TypeScript & patterns**
- `RootState` and `AppDispatch` are exported from `store` and used by `useAppSelector.withTypes` / `useAppDispatch.withTypes` in [src/app/hooks.ts](src/app/hooks.ts#L1).
- `createSlice` groups reducers and action creators (see `authSlice`).

**Where actions are dispatched or queries used**
- Session load: [src/features/auth/AuthProvider.tsx](src/features/auth/AuthProvider.tsx#L1) — `useGetSessionQuery` + `dispatch(sessionLoaded(...))`.
- Login/Signup: auth pages use `useLoginMutation` / `useSignupMutation` and `dispatch` on success ([src/features/auth/pages/Login.tsx](src/features/auth/pages/Login.tsx#L1)).
- Sign out: `SignOut` page dispatches `signedOut` after calling `useLogoutMutation` ([src/pages/menu/SignOut.tsx](src/pages/menu/SignOut.tsx#L1)).

**Quick examples**
- Dispatching the sessionLoaded action (from `AuthProvider`):

```ts
const { data, isLoading } = useGetSessionQuery();
useEffect(() => {
  if (!isLoading) dispatch(sessionLoaded(data?.user ?? null));
}, [data, isLoading]);
```

- Selecting auth status (from `ProtectedRoute`):

```ts
const status = useAppSelector((state) => state.auth.status);
if (status === 'guest') redirectToLogin();
```

**Where to extend**
- Add more slices under `src/features/` and register reducers in [src/app/store.ts](src/app/store.ts#L1).
- Add RTK Query endpoints to `knoxitApi` for new resources and use generated hooks in components.

------
File created to help explain how Redux + RTK Query are used in this project. Ask me to expand this into a README section or generate a component-by-component mapping next.
