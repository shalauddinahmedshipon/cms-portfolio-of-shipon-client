// store/api/gallery.api.ts
import { baseApi } from "./baseApi"
import { TAGS } from "@/types/api.tags"
import type { Gallery } from "@/types/gallery.types"
import type { ApiResponse } from "@/types/api.response.types"


export interface GalleryPaginatedResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  data: Gallery[]
}


export const galleryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
 getGallery: builder.query<GalleryPaginatedResponse, { page?: number; limit?: number } | void>({
  query: ({ page = 1, limit = 10 } = {}) => `/gallery?page=${page}&limit=${limit}`,
  transformResponse: (res: any) => res.data, // unwrap the backend data object
  providesTags: [TAGS.GALLERY],
}),

    createGallery: builder.mutation<Gallery, FormData>({
      query: (formData) => ({
        url: "/gallery",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TAGS.GALLERY],
    }),
   
    deleteGallery: builder.mutation<void, string>({
      query: (id) => ({
        url: `/gallery/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAGS.GALLERY],
    }),
  }),
})

export const {
  useGetGalleryQuery,
  useCreateGalleryMutation,
  useDeleteGalleryMutation,
} = galleryApi
