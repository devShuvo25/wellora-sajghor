import { baseApi } from "./baseApi";

export const chatApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // ১. ইউজারের ইনবক্স বা চ্যাট লিস্ট নিয়ে আসা
    getUserChats: builder.query({
      query: () => ({
        url: "/chats/inbox",
        method: "GET",
      }),
      providesTags: ["Chat" as const],
    }),

    // ২. নির্দিষ্ট কনভারসেশনের মেসেজ হিস্ট্রি লোড করা
    getChatMessages: builder.query({
      query: (conversationId: string) => ({
        url: `/chats/messages/${conversationId}`,
        method: "GET",
      }),
      providesTags: (result, error, conversationId) => [
        { type: "Chat" as const, id: conversationId },
      ],
    }),

    // ৩. নতুন কনভারসেশন এক্সেস বা তৈরি করা
    accessConversation: builder.mutation({
      query: (partnerId: string) => ({
        url: "/chats/access",
        method: "POST",
        body: { partnerId }, 
      }),
      invalidatesTags: ["Chat"],
    }),

    // ৪. নাম বা ইমেইল দিয়ে ইউজার সার্চ করা (নতুন যোগ করা হয়েছে)
    // রাউট: GET /users?searchTerm=... (আপনার ব্যাকএন্ড অনুযায়ী URL চেক করে নিন)
    getAllUsers: builder.query({
      query: (searchTerm: string) => ({
        url: "/users", 
        method: "GET",
        params: { searchTerm }, // কোয়েরি প্যারামিটার হিসেবে পাঠানো হচ্ছে
      }),
    }),

  }),
});

export const { 
  useGetUserChatsQuery, 
  useGetChatMessagesQuery, 
  useAccessConversationMutation,
  useGetAllUsersQuery // এটি আপনার FloatingMessages কম্পোনেন্টে ব্যবহার করুন
} = chatApis;