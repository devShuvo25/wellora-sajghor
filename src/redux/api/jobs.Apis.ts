import { baseApi } from "@/redux/api/baseApi";

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get All Jobs (Supports Search, Filters, and Pagination)
    getAllJobs: builder.query({
      query: (params) => ({
        url: "/jobs",
        method: "GET",
        params: params, // Pass filters like category, budgetType, or searchTerm
      }),
      providesTags: ["Jobs"],
    }),

    getMyPostedJobs: builder.query({
      query: (filter) => ({
        url: "/jobs/my-jobs",
        method: "GET",
        params : filter
      }),
      providesTags: ["Jobs"],
    }),
    
    // 2. Get Single Job Details by ID
    getSingleJob: builder.query({
      query: (id: string) => ({
        url: `/jobs/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Jobs", id }],
    }),

    // 3. Create a New Job (Client Only)
    createJob: builder.mutation({
      query: (data) => ({
        url: "/jobs/create-job",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Jobs"],
    }),

    // 4. Update an Existing Job
    updateJob: builder.mutation({
      query: ({ id, data }) => ({
        url: `/jobs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Jobs", { type: "Jobs", id }],
    }),

    // 5. Delete a Job
    deleteJob: builder.mutation({
      query: (id: string) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Jobs"],
    }),

    // 6. Get Jobs created by the logged-in Client

  }),
});

export const {
  useGetAllJobsQuery,
  useGetSingleJobQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetMyPostedJobsQuery,
} = jobApi;