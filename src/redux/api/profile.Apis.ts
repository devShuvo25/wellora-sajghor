import { baseApi } from "@/redux/api/baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Logged-in User's Full Profile
    getMyProfile: builder.query({
      query: () => ({
        url: "/profile/my-profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    // 2. Update Core Profile (Supports FormData for Image + Bio/Skills)
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/profile/update-profile",
        method: "PATCH",
        body: data, // Use FormData when sending the image
      }),
      invalidatesTags: ["Profile"],
    }),

    // 3. Dynamic Create (Portfolio, Education, Experience, Certification, Testimonial)
    createProfileItem: builder.mutation({
      query: ({ model, data} ) => ({
        url: `/profile/manage/${model}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // 4. Dynamic Update (Portfolio, Education, etc. by ID)
    updateProfileItem: builder.mutation({
      query: ({ model, id, data }) => ({
        url: `/profile/manage/${model}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // 5. Dynamic Delete
    deleteProfileItem: builder.mutation({
      query: ({ model, id }) => ({
        url: `/profile/manage/${model}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
  useCreateProfileItemMutation,
  useUpdateProfileItemMutation,
  useDeleteProfileItemMutation,
} = profileApi;