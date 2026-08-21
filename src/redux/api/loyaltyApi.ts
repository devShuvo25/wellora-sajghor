import { baseApi } from "@/redux/api/baseApi";

export const loyaltyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get my loyalty points summary
    getMyLoyaltyPoints: builder.query({
      query: () => ({
        url: "/loyalty/my-points",
        method: "GET",
      }),
      providesTags: ["Loyalty"],
    }),

    // 2. Get loyalty transaction history
    getLoyaltyHistory: builder.query({
      query: (params?: { page?: number; limit?: number }) => ({
        url: "/loyalty/history",
        method: "GET",
        params,
      }),
      providesTags: ["Loyalty"],
    }),

    // 3. Redeem points (apply to cart)
    redeemPoints: builder.mutation({
      query: (data: { points: number; orderId?: string }) => ({
        url: "/loyalty/redeem",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Loyalty", "Orders"],
    }),

    // 4. Get loyalty tiers / program details
    getLoyaltyProgram: builder.query({
      query: () => ({
        url: "/loyalty/program",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetMyLoyaltyPointsQuery,
  useGetLoyaltyHistoryQuery,
  useRedeemPointsMutation,
  useGetLoyaltyProgramQuery,
} = loyaltyApi;
