import { baseApi } from "./baseApi"
import { TAGS } from "@/types/api.tags"
import type { Skill, SkillCategory } from "@/types/skill.types"
import type { ApiResponse } from "@/types/api.response.types"

export const skillApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─────────────────────────────────────
    // CATEGORY
    // ─────────────────────────────────────

    getSkillCategories: builder.query<SkillCategory[], void>({
      query: () => "/skill/categories",

      transformResponse: (
        response: ApiResponse<SkillCategory[]>
      ) => response.data,

      providesTags: [TAGS.SKILL_CATEGORY, TAGS.SKILL],
    }),

    createSkillCategory: builder.mutation<
      SkillCategory,
      Partial<SkillCategory>
    >({
      query: (body) => ({
        url: "/skill/category",
        method: "POST",
        body,
      }),

      transformResponse: (
        response: ApiResponse<SkillCategory>
      ) => response.data,

      invalidatesTags: [TAGS.SKILL_CATEGORY],
    }),

    updateSkillCategory: builder.mutation<
      SkillCategory,
      { id: string } & Partial<SkillCategory>
    >({
      query: ({ id, ...body }) => ({
        url: `/skill/category/${id}`,
        method: "PATCH",
        body,
      }),

      transformResponse: (
        response: ApiResponse<SkillCategory>
      ) => response.data,

      invalidatesTags: [TAGS.SKILL_CATEGORY],
    }),

    deleteSkillCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/skill/category/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [TAGS.SKILL_CATEGORY, TAGS.SKILL],
    }),

    // ─────────────────────────────────────
    // SKILL
    // ─────────────────────────────────────

    createSkill: builder.mutation<Skill, FormData>({
      query: (formData) => ({
        url: "/skill",
        method: "POST",
        body: formData,
      }),

      transformResponse: (
        response: ApiResponse<Skill>
      ) => response.data,

      invalidatesTags: [TAGS.SKILL],
    }),

    updateSkill: builder.mutation<
      Skill,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/skill/${id}`,
        method: "PATCH",
        body: data,
      }),

      transformResponse: (
        response: ApiResponse<Skill>
      ) => response.data,

      invalidatesTags: [TAGS.SKILL],
    }),

    deleteSkill: builder.mutation<void, string>({
      query: (id) => ({
        url: `/skill/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [TAGS.SKILL],
    }),

    // ─────────────────────────────────────
    // REORDER
    // ─────────────────────────────────────

    reorderSkills: builder.mutation<
      void,
      Array<{ id: string; order: number }>
    >({
      query: (body) => ({
        url: "/skill/reorder",
        method: "PATCH",
        body,
      }),

      invalidatesTags: [TAGS.SKILL],
    }),

    reorderCategories: builder.mutation<
      void,
      Array<{ id: string; order: number }>
    >({
      query: (body) => ({
        url: "/skill/category/reorder",
        method: "PATCH",
        body,
      }),

      invalidatesTags: [TAGS.SKILL_CATEGORY],
    }),
  }),
})

export const {
  useGetSkillCategoriesQuery,
  useCreateSkillCategoryMutation,
  useUpdateSkillCategoryMutation,
  useDeleteSkillCategoryMutation,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useReorderSkillsMutation,
  useReorderCategoriesMutation,
} = skillApi
