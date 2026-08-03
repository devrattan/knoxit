import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  allLeagues,
  chipBalance,
  dailyReward,
  myAdminLeagueRequests,
  publicFriendsLeagues
} from "../../lib/mockData";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";

type MockArgs = string | { url: string; method?: string; body?: any };

async function mockBaseQuery(args: MockArgs) {
  const request = typeof args === "string" ? { url: args, method: "GET" } : args;
  await new Promise((resolve) => setTimeout(resolve, 80));

  if (request.url === "/api/session") return { data: { user: { id: "demo-user", username: "You" } } };
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
    getSession: builder.query<{ user: { id: string; username: string } | null }, void>({
      query: () => "/api/session",
      providesTags: ["Session"]
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
  useGetLeaguesQuery,
  useJoinLeagueMutation,
  useGetPublicFriendsLeaguesQuery,
  useRequestFriendsLeagueMutation,
  useJoinByCodeMutation,
  useGetChipBalanceQuery
} = knoxitApi;
