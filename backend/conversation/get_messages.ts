import { api } from "encore.dev/api";
import { conversationDB } from "./db";
import type { Message } from "./add_message";

export interface GetMessagesRequest {
  conversationId: number;
}

export interface GetMessagesResponse {
  messages: Message[];
}

// Retrieves all messages for a conversation.
export const getMessages = api<GetMessagesRequest, GetMessagesResponse>(
  { expose: true, method: "GET", path: "/conversations/:conversationId/messages" },
  async (req) => {
    const rows = await conversationDB.queryAll<{
      id: number;
      conversation_id: number;
      role: string;
      content: string;
      created_at: Date;
    }>`
      SELECT id, conversation_id, role, content, created_at
      FROM conversation_messages
      WHERE conversation_id = ${req.conversationId}
      ORDER BY created_at ASC
    `;

    const messages: Message[] = rows.map(row => ({
      id: row.id,
      conversationId: row.conversation_id,
      role: row.role as "user" | "assistant",
      content: row.content,
      createdAt: row.created_at,
    }));

    return { messages };
  }
);
