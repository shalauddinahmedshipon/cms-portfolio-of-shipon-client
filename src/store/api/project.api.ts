import { Project } from "@/types/project.types";
import { baseApi } from "./baseApi"
import { TAGS } from "@/types/api.tags"



export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<any, any>({
      query: (params) => ({
        url: "/project",
        params,
      }),
      transformResponse: (res: any) => res.data,
      providesTags: [{ type: TAGS.PROJECT, id: "LIST" }],
    }),

    createProject: builder.mutation<Project, FormData>({
      query: (body) => ({
        url: "/project",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAGS.PROJECT, id: "LIST" }],
    }),

    updateProject: builder.mutation<
      Project,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/project/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: TAGS.PROJECT, id: "LIST" }],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/project/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: TAGS.PROJECT, id: "LIST" }],
    }),

   reorderProjects: builder.mutation<
  void,
  { ids: string[] }
>({
  query: (body) => ({
    url: "/project/reorder",
    method: "PATCH",
    body,
  }),
  invalidatesTags: [{ type: TAGS.PROJECT, id: "LIST" }],
}),

  }),
})

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useReorderProjectsMutation,
} = projectApi
