import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
      transformResponse: (response: any) => ({
        user: response.data.user,
      }),
    }),

    // 🔥 NEW — get current user
    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery } = authApi;
