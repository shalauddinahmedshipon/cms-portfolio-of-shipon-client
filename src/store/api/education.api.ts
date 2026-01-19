import { baseApi } from "./baseApi"
import { TAGS } from "@/types/api.tags"
import type { Education } from "@/types/education.types"
import type { ApiResponse } from "@/types/api.response.types"

export const educationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Education ─────────────────────────────
    getEducations: builder.query<Education[], void>({
      query: () => "/education",

      transformResponse: (
        response: ApiResponse<Education[]>
      ) => response.data,

      providesTags: [TAGS.EDUCATION],
    }),

    getEducation: builder.query<Education, string>({
      query: (id) => `/education/${id}`,

      transformResponse: (
        response: ApiResponse<Education>
      ) => response.data,

      providesTags: [TAGS.EDUCATION],
    }),

    createEducation: builder.mutation<Education, FormData>({
      query: (formData) => ({
        url: "/education",
        method: "POST",
        body: formData,
      }),

      transformResponse: (
        response: ApiResponse<Education>
      ) => response.data,

      invalidatesTags: [TAGS.EDUCATION],
    }),

    updateEducation: builder.mutation<
      Education,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/education/${id}`,
        method: "PATCH",
        body: data,
      }),

      transformResponse: (
        response: ApiResponse<Education>
      ) => response.data,

      invalidatesTags: [TAGS.EDUCATION],
    }),

    deleteEducation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/education/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [TAGS.EDUCATION],
    }),
  }),
})

export const {
  useGetEducationsQuery,
  useGetEducationQuery,
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} = educationApi
