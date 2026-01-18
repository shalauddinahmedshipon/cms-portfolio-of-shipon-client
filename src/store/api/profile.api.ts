// src/store/api/profile.api.ts
import { TAGS } from "@/types/api.tags";
import { baseApi } from "./baseApi"

import type { Profile, ContactInfo, CodingProfile } from "@/types/profile.types"
import { ApiResponse } from "@/types/api.response.types";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Profile ───────────────────────────────
   
  getProfile: builder.query<Profile, void>({
  query: () => "/profile",
  transformResponse: (response: ApiResponse<Profile>) => response.data,
   providesTags: [TAGS.PROFILE],
}),


    updateProfile: builder.mutation<Profile, FormData>({
      query: (formData) => ({
        url: "/profile",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TAGS.PROFILE],
    }),

    updateContactInfo: builder.mutation<
      ContactInfo,
      Partial<ContactInfo>
    >({
      query: (body) => ({
        url: "/profile/contact",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [TAGS.PROFILE],
    }),

    // ── Coding Profiles ───────────────────────
    getCodingProfiles: builder.query<CodingProfile[], void>({
      query: () => "/profile/coding-profiles",
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: TAGS.CODING_PROFILE,
                id: item.id,
              })),
              { type: TAGS.CODING_PROFILE, id: "LIST" },
            ]
          : [{ type: TAGS.CODING_PROFILE, id: "LIST" }],
    }),

    createCodingProfile: builder.mutation<CodingProfile, FormData>({
      query: (formData) => ({
        url: "/profile/coding-profiles",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: TAGS.CODING_PROFILE, id: "LIST" }],
    }),

    updateCodingProfile: builder.mutation<
      CodingProfile,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/profile/coding-profiles/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAGS.CODING_PROFILE, id },
        { type: TAGS.CODING_PROFILE, id: "LIST" },
      ],
    }),

    deleteCodingProfile: builder.mutation<void, string>({
      query: (id) => ({
        url: `/profile/coding-profiles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: TAGS.CODING_PROFILE, id },
        { type: TAGS.CODING_PROFILE, id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateContactInfoMutation,
  useGetCodingProfilesQuery,
  useCreateCodingProfileMutation,
  useUpdateCodingProfileMutation,
  useDeleteCodingProfileMutation,
} = profileApi
