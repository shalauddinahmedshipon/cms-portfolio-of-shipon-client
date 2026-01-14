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
        accessToken: response.data.access_token,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
