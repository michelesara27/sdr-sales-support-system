import { api, APIError } from "encore.dev/api";
import { conversationDB } from "./db";

export interface AddMessageRequest {
  conversationId: number;
  role: "user" | "assistant";
  content: string;
}

export interface Message {
  id: number;
  conversationId: number;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

// Adds a message to an existing conversation.
export const addMessage = api<AddMessageRequest, Message>(
  { expose: true, method: "POST", path: "/conversations/:conversationId/messages" },
  async (req) => {
    const row = await conversationDB.queryRow<{
      id: number;
      conversation_id: number;
      role: string;
      content: string;
      created_at: Date;
    }>`
      INSERT INTO conversation_messages (conversation_id, role, content)
      VALUES (${req.conversationId}, ${req.role}, ${req.content})
      RETURNING id, conversation_id, role, content, created_at
    `;

    if (!row) {
      throw new Error("Failed to add message");
    }

    return {
      id: row.id,
      conversationId: row.conversation_id,
      role: row.role as "user" | "assistant",
      content: row.content,
      createdAt: row.created_at,
    };
  }
);
