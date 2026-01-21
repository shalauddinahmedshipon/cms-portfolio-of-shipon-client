import { baseApi } from "./baseApi";
import { TAGS } from "@/types/api.tags";

export const achievementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAchievements: builder.query<any, any>({
      query: () => ({
        url: "/achievements",
      }),
      providesTags: [{ type: TAGS.ACHIEVEMENT, id: "LIST" }],
    }),

    createAchievement: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/achievements",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAGS.ACHIEVEMENT, id: "LIST" }],
    }),

    updateAchievement: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/achievements/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: TAGS.ACHIEVEMENT, id: "LIST" },
        { type: TAGS.ACHIEVEMENT, id },
      ],
    }),

    deleteAchievement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/achievements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: TAGS.ACHIEVEMENT, id: "LIST" }],
    }),

    reorderAchievements: builder.mutation<void, { ids: string[] }>({
      query: (body) => ({
        url: "/achievements/reorder",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: TAGS.ACHIEVEMENT, id: "LIST" }],
    }),
  }),
});

export const {
  useGetAchievementsQuery,
  useCreateAchievementMutation,
  useUpdateAchievementMutation,
  useDeleteAchievementMutation,
  useReorderAchievementsMutation,
} = achievementApi;