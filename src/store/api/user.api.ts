// store/api/user.api.ts
import { ApiResponse } from "@/types/api.response.types"
import { baseApi } from "./baseApi"
import { TAGS } from "@/types/api.tags"
import type { User, CreateUserPayload } from "@/types/auth.types"

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ======================
    // GET ALL USERS (ADMIN)
    // ======================
    getUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => "/auth/users",
      providesTags: [TAGS.USER],
    }),

    // ======================
    // CREATE CONTENT MANAGER
    // ======================
    createUser: builder.mutation<ApiResponse<User>, CreateUserPayload>({
      query: (body) => ({
        url: "/auth/create-content-manager",
        method: "POST",
        body,
      }),
      invalidatesTags: [TAGS.USER],
    }),

    // ======================
    // DELETE USER
    // ======================
    deleteUser: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/auth/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAGS.USER],
    }),

    // ======================
    // TOGGLE USER ACTIVE
    // ======================
    toggleUserActive: builder.mutation<ApiResponse<User>, string>({
      query: (id) => ({
        url: `/auth/users/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: [TAGS.USER],
    }),

    updateAccount: builder.mutation<
      ApiResponse<{ message: string }>,
      {
        fullName?: string
        oldPassword?: string
        newPassword?: string
        confirmPassword?: string
      }
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body,
      }),
    }),

  }),
})

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useToggleUserActiveMutation,
  useUpdateAccountMutation
} = userApi
