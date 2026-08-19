// app/redux/api/notificationApi.ts
import { baseApi } from "@/redux/api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get All Notifications for the logged-in user
    getMyNotifications: builder.query({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),

    // 2. Get Unread Count for the badge
    getUnreadCount: builder.query({
      query: () => ({
        url: "/notifications/unread-count",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),

    // 3. Mark All Notifications as Read
    markAsRead: builder.mutation({
      query: () => ({
        url: "/notifications/mark-as-read",
        method: "PATCH",
      }),
      // Invalidates both the list and the count
      invalidatesTags: ["Notifications"],
    }),

    // 4. Delete a Single Notification
    deleteNotification: builder.mutation({
      query: (id: string) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // 5. Delete All Notifications (Clear All)
    deleteAllNotifications: builder.mutation({
      query: () => ({
        url: "/notifications",
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationApi;