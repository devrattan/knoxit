import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  allLeagues,
  chipBalance,
  dailyReward,
  myAdminLeagueRequests,
  publicFriendsLeagues
} from "../../lib/mockData";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:4000" : "");
const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";

export type SessionUser = {
  id: string;
  email: string;
  username: string;
};

type MockArgs = string | { url: string; method?: string; body?: any };

async function mockBaseQuery(args: MockArgs) {
  const request = typeof args === "string" ? { url: args, method: "GET" } : args;
  await new Promise((resolve) => setTimeout(resolve, 80));

  if (request.url === "/api/session") {
    return { data: { user: { id: "demo-user", email: "demo@knoxit.local", username: "you" } } };
  }
  if (request.url === "/api/auth/login" || request.url === "/api/auth/signup") {
    return { data: { user: { id: "demo-user", email: request.body?.email, username: request.body?.username ?? "you" } } };
  }
  if (request.url === "/api/auth/logout") return { data: undefined };
  if (request.url === "/api/leagues") return { data: allLeagues };
  if (request.url === "/api/friends-leagues/public") return { data: publicFriendsLeagues };
  if (request.url === "/api/friends-leagues/requests/mine") return { data: myAdminLeagueRequests };
  if (request.url === "/api/shop/balance") return { data: { balance: chipBalance } };
  if (request.url === "/api/shop/daily-reward") return { data: dailyReward };
  if (request.method && request.method !== "GET") return { data: { ok: true, ...request.body } };

  return { error: { status: 404, data: { error: "Mock endpoint not implemented" } } };
}

export const knoxitApi = createApi({
  reducerPath: "knoxitApi",
  baseQuery: useMockApi
    ? mockBaseQuery
    : fetchBaseQuery({
        baseUrl: apiBaseUrl,
        credentials: "include"
      }),
  tagTypes: [
    "Session",
    "League",
    "FriendsLeague",
    "JoinRequest",
    "Pick",
    "Fixture",
    "Shop",
    "Notification",
    "Referral",
    "Chat",
    "SplitVote"
  ],
  endpoints: (builder) => ({
    getSession: builder.query<{ user: SessionUser | null }, void>({
      query: () => "/api/session",
      providesTags: ["Session"]
    }),
    login: builder.mutation<{ user: SessionUser }, { email: string; password: string }>({
      query: (body) => ({ url: "/api/auth/login", method: "POST", body }),
      invalidatesTags: ["Session"]
    }),
    signup: builder.mutation<{ user: SessionUser }, { username: string; email: string; password: string }>({
      query: (body) => ({ url: "/api/auth/signup", method: "POST", body }),
      invalidatesTags: ["Session"]
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/api/auth/logout", method: "POST" }),
      invalidatesTags: ["Session"]
    }),
    getLeagues: builder.query<any[], void>({
      query: () => "/api/leagues",
      providesTags: ["League"]
    }),
    joinLeague: builder.mutation<{ joined: boolean }, string>({
      query: (id) => ({ url: `/api/leagues/${id}/join`, method: "POST" }),
      invalidatesTags: ["League", "Shop"]
    }),
    getPublicFriendsLeagues: builder.query<any[], void>({
      query: () => "/api/friends-leagues/public",
      providesTags: ["FriendsLeague"]
    }),
    requestFriendsLeague: builder.mutation<any, { leagueId: string; message?: string }>({
      query: ({ leagueId, message }) => ({
        url: `/api/friends-leagues/${leagueId}/request`,
        method: "POST",
        body: { message }
      }),
      invalidatesTags: ["FriendsLeague", "JoinRequest"]
    }),
    joinByCode: builder.mutation<any, { inviteCode: string }>({
      query: (body) => ({ url: "/api/friends-leagues/join-by-code", method: "POST", body }),
      invalidatesTags: ["FriendsLeague", "League"]
    }),
    getChipBalance: builder.query<{ balance: number }, void>({
      query: () => "/api/shop/balance",
      providesTags: ["Shop"]
    })
  })
});

export const {
  useGetSessionQuery,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useGetLeaguesQuery,
  useJoinLeagueMutation,
  useGetPublicFriendsLeaguesQuery,
  useRequestFriendsLeagueMutation,
  useJoinByCodeMutation,
  useGetChipBalanceQuery
} = knoxitApi;
