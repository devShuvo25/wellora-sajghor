import { baseApi } from "@/redux/api/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Admin dashboard overview stats
    getAdminDashboardStats: builder.query({
      query: (params?: { period?: "7d" | "30d" | "90d" | "1y" }) => ({
        url: "/admin/stats",
        method: "GET",
        params,
      }),
      providesTags: ["AdminStats"],
    }),

    // 2. Get all orders (admin)
    getAdminOrders: builder.query({
      query: (params?: {
        status?: string;
        channel?: string;
        search?: string;
        page?: number;
        limit?: number;
      }) => ({
        url: "/admin/orders",
        method: "GET",
        params,
      }),
      providesTags: ["Orders"],
    }),

    // 3. Update order status (admin)
    updateAdminOrderStatus: builder.mutation({
      query: ({ id, status, trackingCode }: { id: string; status: string; trackingCode?: string }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PATCH",
        body: { status, trackingCode },
      }),
      invalidatesTags: (result, error, { id }) => ["Orders", { type: "Order", id }],
    }),

    // 4. Get all distributors (admin)
    getAllDistributors: builder.query({
      query: (params?: {
        tier?: string;
        region?: string;
        search?: string;
        status?: "pending" | "approved" | "suspended";
        page?: number;
        limit?: number;
      }) => ({
        url: "/admin/distributors",
        method: "GET",
        params,
      }),
      providesTags: ["Admin"],
    }),

    // 5. Approve / Suspend distributor
    updateDistributorStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: "approved" | "suspended" | "pending" }) => ({
        url: `/admin/distributors/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Admin"],
    }),

    // 6. Admin product management
    getAdminProducts: builder.query({
      query: (params?: {
        category?: string;
        search?: string;
        lowStock?: boolean;
        page?: number;
        limit?: number;
      }) => ({
        url: "/admin/products",
        method: "GET",
        params,
      }),
      providesTags: ["Products"],
    }),

    // 7. Update product stock (admin)
    updateProductStock: builder.mutation({
      query: ({ id, stock }: { id: string; stock: number }) => ({
        url: `/admin/products/${id}/stock`,
        method: "PATCH",
        body: { stock },
      }),
      invalidatesTags: (result, error, { id }) => ["Products", { type: "Product", id }],
    }),

    // 8. Upload marketing kit
    uploadMarketingKit: builder.mutation({
      query: (data: FormData) => ({
        url: "/admin/marketing-kits",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MarketingKits"],
    }),

    // 9. Get all marketing kits
    getMarketingKits: builder.query({
      query: (params?: { category?: string; page?: number; limit?: number }) => ({
        url: "/admin/marketing-kits",
        method: "GET",
        params,
      }),
      providesTags: ["MarketingKits"],
    }),

    // 10. Delete marketing kit
    deleteMarketingKit: builder.mutation({
      query: (id: string) => ({
        url: `/admin/marketing-kits/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MarketingKits"],
    }),

    // 11. Get portal settings
    getAdminSettings: builder.query({
      query: () => ({
        url: "/admin/settings",
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

    // 12. Update portal settings
    updateAdminSettings: builder.mutation({
      query: (data: object) => ({
        url: "/admin/settings",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetAdminDashboardStatsQuery,
  useGetAdminOrdersQuery,
  useUpdateAdminOrderStatusMutation,
  useGetAllDistributorsQuery,
  useUpdateDistributorStatusMutation,
  useGetAdminProductsQuery,
  useUpdateProductStockMutation,
  useUploadMarketingKitMutation,
  useGetMarketingKitsQuery,
  useDeleteMarketingKitMutation,
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} = adminApi;
