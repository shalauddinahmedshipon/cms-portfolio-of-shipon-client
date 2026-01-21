import type { EventListResponse, Event } from '@/types/event.types';
import { baseApi } from './baseApi';

export const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<
      EventListResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        eventType?: string;
        isActive?: boolean;
      }
    >({
      query: (params) => ({
        url: '/event',
        method: 'GET',
        params,
      }),
      providesTags: ['Event'],
    }),

    getEvent: builder.query<Event, string>({
      query: (id) => `/event/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Event', id }],
    }),

    createEvent: builder.mutation<Event, FormData>({
      query: (body) => ({
        url: '/event',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Event'],
    }),

    updateEvent: builder.mutation<
      Event,
      { id: string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/event/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        'Event',
        { type: 'Event', id: arg.id },
      ],
    }),

    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/event/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
