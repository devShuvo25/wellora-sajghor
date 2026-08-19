// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { MessagePayload } from "@/interface/socket";
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// // টাইপিং পেলোড ইন্টারফেস
// interface ITypingPayload {
//   userId: string;
//   userName: string;
//   roomId: string; 
// }


// interface ChatState {
//   messages: MessagePayload[];
//   activeRoom: string | null;
//   typingUsers: ITypingPayload[]; 
//   chats: any[]; 
// }

// const initialState: ChatState = {
//   messages: [],
//   activeRoom: null,
//   typingUsers: [],
//   chats: [], 
// };

// const chatSlice = createSlice({
//   name: "chat",
//   initialState,
//   reducers: {
//     // ১. পুরো চ্যাট লিস্ট (Inbox) সেট করা
//     setChats: (state, action: PayloadAction<any[]>) => {
//       state.chats = action.payload;
//     },

//     // ২. একটিভ রুম সেট করা
//     setActiveRoom: (state, action: PayloadAction<string>) => {
//       state.activeRoom = action.payload;
//       state.messages = []; 
//     },

//     // ৩. চ্যাট হিস্ট্রি লোড করা
//     setMessages: (state, action: PayloadAction<MessagePayload[]>) => {
//       state.messages = action.payload;
//     },

//     // ৪. সকেট থেকে আসা মেসেজ রিসিভ করা (আপনার ইন্টারফেস অনুযায়ী আপডেট করা)
// receiveMessage: (state, action: PayloadAction<MessagePayload>) => {
//   // message-এর বদলে content ডিস্ট্রাকচার করুন
//   const { roomId, content, timestamp } = action.payload as any; 

//   if (state.activeRoom === String(roomId)) {
//     state.messages.push(action.payload);
//   }

//   const chatIndex = state.chats.findIndex((c: any) => String(c.id) === String(roomId));
  
//   if (chatIndex !== -1) {
//     state.chats[chatIndex].lastMessage = content; // এখানে content দিন
//     state.chats[chatIndex].updatedAt = timestamp;
    
//     const [movedChat] = state.chats.splice(chatIndex, 1);
//     state.chats.unshift(movedChat);
//   }
// },
//     // ৫. টাইপিং স্ট্যাটাস সেট করা
//     setTyping: (state, action: PayloadAction<ITypingPayload>) => {
//       if (!state.typingUsers.find(u => u.userId === action.payload.userId)) {
//         state.typingUsers.push(action.payload);
//       }
//     },

//     // ৬. টাইপিং স্ট্যাটাস রিমুভ করা
//     removeTyping: (state, action: PayloadAction<string>) => {
//       state.typingUsers = state.typingUsers.filter(u => u.userId !== action.payload);
//     },
//   },
// });

// export const { 
//   setChats,
//   setActiveRoom, 
//   setMessages, 
//   receiveMessage, 
//   setTyping, 
//   removeTyping 
// } = chatSlice.actions;

// export default chatSlice.reducer;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessagePayload } from "@/interface/socket";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITypingPayload {
  userId: string;
  userName: string;
  roomId: string; 
}

interface ChatState {
  messages: MessagePayload[];
  activeRoom: string | null;
  typingUsers: ITypingPayload[]; 
  chats: any[]; 
}

const initialState: ChatState = {
  messages: [],
  activeRoom: null,
  typingUsers: [],
  chats: [], 
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // ১. ইনবক্স লিস্ট সেট করা
    setChats: (state, action: PayloadAction<any[]>) => {
      state.chats = action.payload;
    },

    // ২. একটিভ রুম সেট করা
    setActiveRoom: (state, action: PayloadAction<string>) => {
      state.activeRoom = action.payload;
      state.messages = []; 
    },

    // ৩. চ্যাট হিস্ট্রি লোড করা
    setMessages: (state, action: PayloadAction<MessagePayload[]>) => {
      state.messages = action.payload;
    },

    // ৪. সকেট থেকে মেসেজ রিসিভ এবং ইনবক্স আপডেট
    receiveMessage: (state, action: PayloadAction<MessagePayload>) => {
      const newMessage = action.payload;
      
      // ID এবং Content নিরাপদভাবে এক্সট্রাক্ট করা
      const incomingRoomId = String(newMessage.roomId || (newMessage as any).conversationId);
      const messageContent = (newMessage as any).content || (newMessage as any).message;

      // ক. যদি ইউজার বর্তমানে ঐ রুমে থাকে, মেসেজ লিস্টে যোগ করো
      if (state.activeRoom === incomingRoomId) {
        state.messages.push(newMessage);
      }

      // খ. ইনবক্স লিস্ট আপডেট করা
      const chatIndex = state.chats.findIndex(
        (c: any) => String(c.id) === incomingRoomId
      );

      if (chatIndex !== -1) {
        // নতুন অবজেক্ট তৈরি (Immutability নিশ্চিত করতে)
        const updatedChat = {
          ...state.chats[chatIndex],
          lastMessage: messageContent,
          updatedAt: newMessage.timestamp || new Date().toISOString()
        };
        
        // লিস্ট থেকে ঐ চ্যাটটি সরিয়ে শুরুতে নিয়ে আসা (Top of Inbox)
        state.chats.splice(chatIndex, 1);
        state.chats.unshift(updatedChat);
      } else {
        // যদি ইনবক্সে চ্যাটটি আগে না থাকে (নতুন ইউজারের মেসেজ), 
        // তবে পুরো ইনবক্স একবার API থেকে রিফেচ করা সবচেয়ে বুদ্ধিমানের কাজ।
        // অথবা এখানে একটি ডামি অবজেক্ট পুশ করা যায়।
      }
    },

    setTyping: (state, action: PayloadAction<ITypingPayload>) => {
      if (!state.typingUsers.find(u => u.userId === action.payload.userId)) {
        state.typingUsers.push(action.payload);
      }
    },

    removeTyping: (state, action: PayloadAction<string>) => {
      state.typingUsers = state.typingUsers.filter(u => u.userId !== action.payload);
    },
  },
});

export const { 
  setChats,
  setActiveRoom, 
  setMessages, 
  receiveMessage, 
  setTyping, 
  removeTyping 
} = chatSlice.actions;

export default chatSlice.reducer;