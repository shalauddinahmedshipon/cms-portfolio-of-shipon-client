import { Project } from "@/types/project.types"
import { baseApi } from "./baseApi"
import { TAGS } from "@/types/api.tags"
import { ProjectsResponse } from "@/types/api.response.types";



export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
   getProjects: builder.query<ProjectsResponse, any>({
  query: (params) => ({
    url: "/project",
    params,
  }),
  transformResponse: (response: any): ProjectsResponse => {
    // Your backend returns { data: { data: [...], meta: {...} }, ... }
    const innerData = response?.data?.data || response?.data || [];           // array of projects
    const innerMeta = response?.data?.meta || {                               // meta object
      page: 1,
      limit: 10,
      total: innerData.length,
      totalPages: 1,
    };

    return {
      data: innerData,
      meta: innerMeta,
    };
  },
  providesTags: [{ type: TAGS.PROJECT, id: "LIST" }],
}),

    // ... other endpoints unchanged
    getProject: builder.query<Project, string>({
      query: (id) => `/project/${id}`,
      providesTags: (result, error, id) => [{ type: TAGS.PROJECT, id }],
    }),

    createProject: builder.mutation<Project, FormData>({
      query: (body) => ({
        url: "/project",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAGS.PROJECT, id: "LIST" }],
    }),

    updateProject: builder.mutation<Project, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/project/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: TAGS.PROJECT, id: "LIST" },
        { type: TAGS.PROJECT, id },
      ],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/project/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: TAGS.PROJECT, id: "LIST" }],
    }),

    reorderProjects: builder.mutation<void, { ids: string[] }>({
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
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useReorderProjectsMutation,
} = projectApi