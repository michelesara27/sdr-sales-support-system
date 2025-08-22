import { api, APIError } from "encore.dev/api";
import { sdrDB } from "../database/db";
import { ConversationResponse, MessageResponse } from "./types";

interface GetConversationParams {
  id: number;
}

// Retrieves a specific conversation by ID.
export const get = api<GetConversationParams, ConversationResponse>(
  { expose: true, method: "GET", path: "/conversations/:id" },
  async ({ id }) => {
    // Get conversation
    const conversation = await sdrDB.queryRow<{
      id: number;
      project_id: number;
      lead_name: string;
      lead_company: string;
      lead_source: string | null;
      lead_notes: string | null;
      status: string;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT * FROM conversations WHERE id = ${id}
    `;

    if (!conversation) {
      throw APIError.notFound("conversation not found");
    }

    // Get messages for this conversation
    const messages = await sdrDB.queryAll<{
      id: number;
      message_type: string;
      content: string;
      created_at: Date;
    }>`
      SELECT id, message_type, content, created_at 
      FROM messages 
      WHERE conversation_id = ${id}
      ORDER BY created_at ASC
    `;

    const messageResponses: MessageResponse[] = messages.map(msg => ({
      id: msg.id,
      type: msg.message_type as 'user' | 'ai' | 'system',
      content: msg.content,
      timestamp: msg.created_at,
    }));

    return {
      id: conversation.id,
      projectId: conversation.project_id,
      leadName: conversation.lead_name,
      leadCompany: conversation.lead_company,
      leadSource: conversation.lead_source,
      leadNotes: conversation.lead_notes,
      status: conversation.status as 'open' | 'closed',
      messages: messageResponses,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
    };
  }
);
