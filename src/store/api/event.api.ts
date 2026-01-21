import type { Event, EventListResponse } from "@/types/event.types"
import { baseApi } from "./baseApi"
import { TAGS } from "@/types/api.tags"

export const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- GET EVENTS (LIST) ----------
    getEvents: builder.query<
      EventListResponse,
      {
        page?: number
        limit?: number
        search?: string
        eventType?: string
        isActive?: boolean
      }
    >({
      query: (params) => ({
        url: "/event",
        params,
      }),
      transformResponse: (response: any): EventListResponse => {

        const innerData = response?.data?.data || []
        const innerMeta = response?.data?.meta || {
          page: 1,
          limit: 10,
          total: innerData.length,
          totalPages: 1,
        }

        return {
          data: innerData,
          meta: innerMeta,
        }
      },
      providesTags: [{ type: TAGS.EVENT, id: "LIST" }],
    }),

    // ---------- GET SINGLE ----------
    getEvent: builder.query<Event, string>({
      query: (id) => `/event/${id}`,
      providesTags: (_r, _e, id) => [{ type: TAGS.EVENT, id }],
    }),

    // ---------- CREATE ----------
    createEvent: builder.mutation<Event, FormData>({
      query: (body) => ({
        url: "/event",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAGS.EVENT, id: "LIST" }],
    }),

    // ---------- UPDATE ----------
    updateEvent: builder.mutation<Event, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/event/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: TAGS.EVENT, id: "LIST" },
        { type: TAGS.EVENT, id },
      ],
    }),

    // ---------- DELETE ----------
    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/event/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: TAGS.EVENT, id: "LIST" }],
    }),
  }),
})

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi
