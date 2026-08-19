import { baseApi } from "@/redux/api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // 1. Get All Users (For Admin Dashboard / Search)
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params: params, // Handles filtering, search, and pagination
      }),
      providesTags: ["User"],
    }),

    // 2. Get User By ID (For Public Profiles)
    getUserById: builder.query({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // 3. Update User (Handles Profile Image & Info)
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data, // Accepts FormData for image uploads
      }),
      // Invalidates the general list and the specific user cache
      invalidatesTags: (result, error, { id }) => ["User", { type: "User", id }],
    }),

    // 4. Delete User (Admin Only)
    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;