import { baseApi } from "@/redux/api/baseApi";

export const distributorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get logged-in distributor's profile
    getMyDistributorProfile: builder.query({
      query: () => ({
        url: "/distributors/me",
        method: "GET",
      }),
      providesTags: ["Distributor"],
    }),

    // 2. Update distributor profile
    updateDistributorProfile: builder.mutation({
      query: (data: FormData | object) => ({
        url: "/distributors/me",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Distributor"],
    }),

    // 3. Get distributor wallet/commission balance
    getDistributorWallet: builder.query({
      query: () => ({
        url: "/distributors/wallet",
        method: "GET",
      }),
      providesTags: ["DistributorWallet"],
    }),

    // 4. Get wallet transaction history
    getWalletTransactions: builder.query({
      query: (params?: { page?: number; limit?: number; type?: string }) => ({
        url: "/distributors/wallet/transactions",
        method: "GET",
        params,
      }),
      providesTags: ["DistributorWallet"],
    }),

    // 5. Request a payout/withdrawal
    requestWithdrawal: builder.mutation({
      query: (data: {
        amount: number;
        method: "bkash" | "nagad" | "bank";
        accountNumber: string;
        accountName: string;
      }) => ({
        url: "/distributors/wallet/withdraw",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DistributorWallet"],
    }),

    // 6. Get sales analytics
    getDistributorSalesAnalytics: builder.query({
      query: (params?: { period?: "7d" | "30d" | "90d" | "1y" }) => ({
        url: "/distributors/analytics",
        method: "GET",
        params,
      }),
      providesTags: ["DistributorAnalytics"],
    }),

    // 7. Get team overrides / sub-affiliates
    getTeamOverrides: builder.query({
      query: (params?: { page?: number; limit?: number }) => ({
        url: "/distributors/team",
        method: "GET",
        params,
      }),
      providesTags: ["Team"],
    }),

    // 8. Generate referral link
    generateReferralLink: builder.mutation({
      query: (data: {
        productId?: string;
        campaignTag: string;
        discountPercent?: number;
      }) => ({
        url: "/distributors/referrals/generate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Referrals"],
    }),

    // 9. Get referral links
    getMyReferralLinks: builder.query({
      query: () => ({
        url: "/distributors/referrals",
        method: "GET",
      }),
      providesTags: ["Referrals"],
    }),

    // 10. Get marketing assets for distributor
    getMarketingAssets: builder.query({
      query: (params?: { category?: string; type?: string }) => ({
        url: "/distributors/marketing-assets",
        method: "GET",
        params,
      }),
      providesTags: ["MarketingKits"],
    }),
  }),
});

export const {
  useGetMyDistributorProfileQuery,
  useUpdateDistributorProfileMutation,
  useGetDistributorWalletQuery,
  useGetWalletTransactionsQuery,
  useRequestWithdrawalMutation,
  useGetDistributorSalesAnalyticsQuery,
  useGetTeamOverridesQuery,
  useGenerateReferralLinkMutation,
  useGetMyReferralLinksQuery,
  useGetMarketingAssetsQuery,
} = distributorsApi;
