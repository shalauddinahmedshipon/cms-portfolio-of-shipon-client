import { Blog } from "@/types/blog.types";
import { baseApi } from "./baseApi";
import { TAGS } from "@/types/api.tags";
import { BlogsResponse } from "@/types/api.response.types";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogsResponse, any>({
      query: (params) => ({
        url: "/blog",
        params,
      }),
      transformResponse: (response: any): BlogsResponse => {
        const innerData = response?.data?.data || response?.data || [];
        const innerMeta = response?.data?.meta || {
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
      providesTags: [{ type: TAGS.BLOG, id: "LIST" }],
    }),

    getBlog: builder.query<Blog, string>({
      query: (id) => `/blog/${id}`,
      providesTags: (result, error, id) => [{ type: TAGS.BLOG, id }],
    }),

    createBlog: builder.mutation<Blog, FormData>({
      query: (body) => ({
        url: "/blog",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAGS.BLOG, id: "LIST" }],
    }),

    updateBlog: builder.mutation<Blog, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/blog/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: TAGS.BLOG, id: "LIST" },
        { type: TAGS.BLOG, id },
      ],
    }),

    deleteBlog: builder.mutation<void, string>({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: TAGS.BLOG, id: "LIST" }],
    }),

    reorderBlogs: builder.mutation<void, { ids: string[] }>({
      query: (body) => ({
        url: "/blog/reorder",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: TAGS.BLOG, id: "LIST" }],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useReorderBlogsMutation,
} = blogApi;
