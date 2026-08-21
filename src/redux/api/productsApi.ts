import { baseApi } from "@/redux/api/baseApi";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get All Products (supports filtering, search, pagination)
    getProducts: builder.query({
      query: (params?: {
        category?: string;
        search?: string;
        page?: number;
        limit?: number;
        sort?: string;
      }) => ({
        url: "/products",
        method: "GET",
        params,
      }),
      providesTags: ["Products"],
    }),

    // 2. Get Single Product by ID
    getProductById: builder.query({
      query: (id: string) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // 3. Create Product (Admin only)
    createProduct: builder.mutation({
      query: (data: FormData) => ({
        url: "/products",
        method: "POST",
        body: data, // FormData for image upload
      }),
      invalidatesTags: ["Products"],
    }),

    // 4. Update Product (Admin only)
    updateProduct: builder.mutation({
      query: ({ id, data }: { id: string; data: FormData | object }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Products", { type: "Product", id }],
    }),

    // 5. Delete Product (Admin only)
    deleteProduct: builder.mutation({
      query: (id: string) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // 6. Get Product Reviews
    getProductReviews: builder.query({
      query: (productId: string) => ({
        url: `/products/${productId}/reviews`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // 7. Submit Product Review
    submitProductReview: builder.mutation({
      query: ({ productId, data }: { productId: string; data: { rating: number; comment: string } }) => ({
        url: `/products/${productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductReviewsQuery,
  useSubmitProductReviewMutation,
} = productsApi;
