import { baseApi } from "@/redux/api/baseApi";
import { RootState } from "../store";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    streamAiProposal: builder.query({
      queryFn: () => ({ data: "" }),

      async onCacheEntryAdded(
        { messages, systemPrompt },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState },
      ) {
        try {
          await cacheDataLoaded;

          const state = getState() as RootState;
          const token = state.auth?.token;
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

          // ✅ Your manual POST request remains here
          const response = await fetch(`${baseUrl}/ai/chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `${token}` } : {}),
            },
            body: JSON.stringify({ messages, systemPrompt }),
          });

          if (!response.ok) throw new Error("Failed to connect to AI");
          if (!response.body) throw new Error("No response body");

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let accumulatedText = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log("Stream complete");
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            console.log("Chunk received:", chunk); // 👈 Add this to debug
            accumulatedText += chunk;

            updateCachedData(() => accumulatedText);
          }
        } catch (error) {
          console.error("AI Stream Error:", error);
        }

        await cacheEntryRemoved;
      },
    }),
  }),
});

export const { useLazyStreamAiProposalQuery } = aiApi;
