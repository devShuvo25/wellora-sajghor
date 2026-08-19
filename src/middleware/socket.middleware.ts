/* eslint-disable @typescript-eslint/no-explicit-any */
import { Middleware } from "@reduxjs/toolkit";
import io from "socket.io-client";
import { ChatActionTypes, MessagePayload } from "../interface/socket";
import {
  receiveMessage,
  removeTyping,
  setActiveRoom,
  setTyping,
} from "@/redux/features/chatSlice";
import { toast } from "sonner"; 
import { addNotification } from "@/redux/features/notification.slice";

// Update your interface to include notification types if necessary
// import { addNotification } from "@/redux/features/notificationSlice";

let socket: ReturnType<typeof io> | null = null;

export const socketMiddleware: Middleware<object, any> =
  (store) => (next) => (action: any) => {
    const { dispatch } = store;

    // 1. CONNECTION HANDLING
    if (action.type === ChatActionTypes.CONNECT) {
      if (!socket || !socket.connected) {
        const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
        
        socket = io(SOCKET_URL, {
          withCredentials: true,
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 2000,
        } as any);

        // --- Socket Event Listeners ---

        socket.on("connect", () => {
          console.log("✅ Socket Connected Successfully. ID:", socket?.id);
          
          // Join the notification room immediately if userId is provided in payload
          if (action.payload?.userId) {
            socket?.emit("join_notification_room", action.payload.userId);
            console.log(`🔔 Joined Notification Room: ${action.payload.userId}`);
          }
        });

        socket.on("connect_error", (error: Error) => {
          console.error("Socket Connection Error:", error.message);
        });

        // NEW: Notification Listener
        socket.on("new_notification", (data: any) => {
          console.log("🔔 New notification received:", data);
          
          // Show real-time alert
          toast.success(data.title || "New Notification", {
            description: data.message,
            duration: 5000,
          });

          // Optional: dispatch to your notification slice to update list/count
          dispatch(addNotification(data));
        });

        socket.on("receive_message", (data: MessagePayload) => {
          console.log("📩 New message received from server:", data);
          dispatch(receiveMessage(data));
        });

        socket.on("user_typing", (data: any) => {
          dispatch(setTyping({
            userId: data.userId,
            userName: data.userName || "Someone",
            roomId: data.roomId,
          }));
        });

        socket.on("user_stop_typing", (data: { userId: string }) => {
          dispatch(removeTyping(data.userId));
        });

        socket.on("disconnect", (reason: string) => {
          console.warn("⚠️ Socket Disconnected. Reason:", reason);
          if (reason === "io server disconnect") {
            socket?.connect();
          }
        });
      }
    }

    // 2. SEND MESSAGE LOGIC
    if (action.type === ChatActionTypes.SEND_MESSAGE) {
      if (socket && socket.connected) {
        socket.emit("send_message", action.payload);
      } else {
        console.warn("⚠️ Attempted to send message while socket is disconnected.");
        if (socket) {
          socket.connect();
          setTimeout(() => {
            if (socket?.connected) {
              socket.emit("send_message", action.payload);
            }
          }, 1000);
        } else {
          dispatch({ type: ChatActionTypes.CONNECT });
        }
      }
    }

    // 3. JOIN CHAT ROOM
    if (action.type === setActiveRoom.type || action.type === "chat/setActiveRoom") {
      if (socket && socket.connected) {
        console.log("🏠 Joining Chat Room:", action.payload);
        socket.emit("join_room", action.payload);
      }
    }

    // NEW: MANUALLY JOIN NOTIFICATION ROOM (Optional fallback)
    if (action.type === "notifications/join_room") {
      if (socket && socket.connected) {
        socket.emit("join_notification_room", action.payload);
      }
    }

    // 4. TYPING STATUS
    if (action.type === ChatActionTypes.START_TYPING) {
      if (socket && socket.connected) {
        socket.emit("start_typing", action.payload);
      }
    }

    // 5. DISCONNECT
    if (action.type === ChatActionTypes.DISCONNECT && socket) {
      console.log("🔌 Manually disconnecting socket...");
      socket.disconnect();
      socket = null;
    }

    return next(action);
  };