export const ChatActionTypes = {
  CONNECT: 'chat/connect',
  DISCONNECT: 'chat/disconnect',
  SEND_MESSAGE: 'chat/sendMessage',
  START_TYPING: 'chat/startTyping',
} as const;

export interface MessagePayload {
  id?: string;
  roomId: string;
  senderId?: string;
  senderName?: string;
  content?: string;
  message?: string;
  timestamp?: string;
  [key: string]: unknown;
}
