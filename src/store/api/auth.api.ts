import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
  query: (credentials) => ({
    url: "/auth/login",
    method: "POST",
    body: credentials,
  }),
  transformResponse: (response: any) => ({
    user: response.data.user,
    accessToken: response.data.accessToken,
  }),
}),


    // 🔥 NEW — get current user
    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET"
      }),
      transformResponse: (response: any) => response.data,
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST"
      }),
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery,useLogoutMutation } = authApi;
