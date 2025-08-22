import { api, APIError } from "encore.dev/api";
import { sdrDB } from "../database/db";
import { AddMessageRequest, MessageResponse } from "./types";

interface AddMessageParams {
  id: number;
}

// Adds a message to an existing conversation.
export const addMessage = api<AddMessageParams & AddMessageRequest, MessageResponse>(
  { expose: true, method: "POST", path: "/conversations/:id/messages" },
  async ({ id, type, content }) => {
    // Check if conversation exists
    const conversation = await sdrDB.queryRow<{ id: number }>`
      SELECT id FROM conversations WHERE id = ${id}
    `;

    if (!conversation) {
      throw APIError.notFound("conversation not found");
    }

    // Add message
    const message = await sdrDB.queryRow<{
      id: number;
      message_type: string;
      content: string;
      created_at: Date;
    }>`
      INSERT INTO messages (conversation_id, message_type, content)
      VALUES (${id}, ${type}, ${content})
      RETURNING id, message_type, content, created_at
    `;

    if (!message) {
      throw new Error("Failed to add message");
    }

    return {
      id: message.id,
      type: message.message_type as 'user' | 'ai' | 'system',
      content: message.content,
      timestamp: message.created_at,
    };
  }
);
