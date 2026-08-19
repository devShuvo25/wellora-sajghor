import { baseApi } from "@/redux/api/baseApi";

export const proposalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Submit a Proposal (Freelancer action)
    createProposal: builder.mutation({
      query: (data) => ({
        url: "/proposals/submit-proposal",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Proposals", "Jobs"],
    }),

    // 2. Get Proposals for a specific Job (Client view)
    getProposalsByJob: builder.query({
      query: (jobId) => ({
        url: `/proposals/job/${jobId}`,
        method: "GET",
      }),
      providesTags: ["Proposals"],
    }),

    // 3. Get Logged-in Freelancer's Proposals
    getMyProposals: builder.query({
      query: () => ({
        url: "/proposals/my-proposals",
        method: "GET",
      }),
      providesTags: ["Proposals"],
    }),

    // 4. Update Proposal Status (Client: Accept/Reject/Shortlist)
    updateProposalStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/proposals/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Proposals", "Jobs"],
    }),

    // 5. Delete/Withdraw a Proposal (Freelancer action)
    withdrawProposal: builder.mutation({
      query: (id) => ({
        url: `/proposals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Proposals"],
    }),
  }),
});

export const {
  useCreateProposalMutation,
  useGetProposalsByJobQuery,
  useGetMyProposalsQuery,
  useUpdateProposalStatusMutation,
  useWithdrawProposalMutation,
} = proposalApi;