// authApi.ts
import { baseApi } from "@/redux/api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1.1–1.4 Register User ADMIN / USER)
    registerUser: builder.mutation({
      query: ({ data }) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    // 1.5 Login
    loginUser: builder.mutation({
      query: ({ data }) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    // 1.6 Google login
    googleLogin: builder.mutation({
      query: (code: string) => ({
        url: "/auth/google-signin",
        method: "POST",
        body: { code }, 
      }),
    }),

    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    logOut: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // 1.6 Forgot Password
    forgotPassword: builder.mutation({
      query: ({ data }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // 1.7 Reset Password
    resetPassword: builder.mutation({
      query: ({ data }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // 1.8 Change Password (Authorized)
    changePassword: builder.mutation({
      query: ({ data }) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetMeQuery,
  useLogOutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGoogleLoginMutation
} = authApi;
