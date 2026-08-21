import { baseApi } from "@/redux/api/baseApi";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Customer: Get my orders
    getMyOrders: builder.query({
      query: (params?: { status?: string; page?: number; limit?: number }) => ({
        url: "/orders/my-orders",
        method: "GET",
        params,
      }),
      providesTags: ["Orders"],
    }),

    // 2. Customer: Create a storefront order
    createOrder: builder.mutation({
      query: (data: {
        items: { productId: string; quantity: number }[];
        shippingAddressId?: string;
        shippingAddress?: {
          name: string;
          phone: string;
          address: string;
          city: string;
          district: string;
        };
        paymentMethod: "cod" | "bkash" | "nagad" | "card";
        couponCode?: string;
        loyaltyPointsToRedeem?: number;
      }) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders", "Wishlist", "Loyalty"],
    }),

    // 3. Customer: Get single order detail
    getOrderById: builder.query({
      query: (id: string) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // 4. Admin: Get all orders with filters
    getAllOrders: builder.query({
      query: (params?: {
        status?: string;
        channel?: string;
        search?: string;
        page?: number;
        limit?: number;
        from?: string;
        to?: string;
      }) => ({
        url: "/admin/orders",
        method: "GET",
        params,
      }),
      providesTags: ["Orders"],
    }),

    // 5. Admin: Update order status
    updateOrderStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => ["Orders", { type: "Order", id }],
    }),

    // 6. Distributor: Get distributor's orders
    getDistributorOrders: builder.query({
      query: (params?: { status?: string; page?: number; limit?: number }) => ({
        url: "/orders/distributor",
        method: "GET",
        params,
      }),
      providesTags: ["Orders"],
    }),

    // 7. Distributor: Create order on behalf of customer
    createDistributorOrder: builder.mutation({
      query: (data: {
        customerName: string;
        phoneNumber: string;
        deliveryAddress?: string;
        address?: string;
        items: { productId: string; quantity: number }[];
        channel?: string;
        notes?: string;
      }) => ({
        url: "/orders/distributor",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders", "DistributorAnalytics", "DistributorWallet"],
    }),

    // 8. Admin/Distributor: Cancel an order
    cancelOrder: builder.mutation({
      query: ({ id, reason }: { id: string; reason?: string }) => ({
        url: `/orders/${id}/cancel`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => ["Orders", { type: "Order", id }],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetDistributorOrdersQuery,
  useCreateDistributorOrderMutation,
  useCancelOrderMutation,
} = ordersApi;
