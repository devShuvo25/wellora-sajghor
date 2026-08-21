import { baseApi } from "@/redux/api/baseApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get my wishlist
    getMyWishlist: builder.query({
      query: () => ({
        url: "/wishlist",
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),

    // 2. Add product to wishlist
    addToWishlist: builder.mutation({
      query: (productId: string) => ({
        url: "/wishlist",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // 3. Remove product from wishlist
    removeFromWishlist: builder.mutation({
      query: (productId: string) => ({
        url: `/wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // 4. Clear entire wishlist
    clearWishlist: builder.mutation({
      query: () => ({
        url: "/wishlist",
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetMyWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} = wishlistApi;
