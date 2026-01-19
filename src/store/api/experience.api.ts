import { baseApi } from "./baseApi"
import { TAGS } from "@/types/api.tags"

import type { Experience } from "@/types/experience.types"
import type { ApiResponse } from "@/types/api.response.types"

export const experienceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Experience ─────────────────────────────
    getExperiences: builder.query<Experience[], void>({
      query: () => "/experience",

      transformResponse: (
        response: ApiResponse<Experience[]>
      ) => response.data,

      providesTags: [TAGS.EXPERIENCE],
    }),

    getExperience: builder.query<Experience, string>({
      query: (id) => `/experience/${id}`,

      transformResponse: (
        response: ApiResponse<Experience>
      ) => response.data,

      providesTags: [TAGS.EXPERIENCE],
    }),

    createExperience: builder.mutation<Experience, FormData>({
      query: (formData) => ({
        url: "/experience",
        method: "POST",
        body: formData,
      }),

      transformResponse: (
        response: ApiResponse<Experience>
      ) => response.data,

      invalidatesTags: [TAGS.EXPERIENCE],
    }),

    updateExperience: builder.mutation<
      Experience,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/experience/${id}`,
        method: "PATCH",
        body: data,
      }),

      transformResponse: (
        response: ApiResponse<Experience>
      ) => response.data,

      invalidatesTags: [TAGS.EXPERIENCE],
    }),

    deleteExperience: builder.mutation<void, string>({
      query: (id) => ({
        url: `/experience/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [TAGS.EXPERIENCE],
    }),
  }),
})

export const {
  useGetExperiencesQuery,
  useGetExperienceQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experienceApi
