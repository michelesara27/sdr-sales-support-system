import { api } from "encore.dev/api";
import { conversationDB } from "./db";
import type { Conversation } from "./create";

export interface ListConversationsResponse {
  conversations: Conversation[];
}

// Retrieves all conversations, ordered by creation date.
export const list = api<void, ListConversationsResponse>(
  { expose: true, method: "GET", path: "/conversations" },
  async () => {
    const rows = await conversationDB.queryAll<{
      id: number;
      project_id: number;
      lead_name: string;
      lead_email: string | null;
      conversation_location: string;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, project_id, lead_name, lead_email, conversation_location, created_at, updated_at
      FROM conversations
      ORDER BY created_at DESC
    `;

    const conversations: Conversation[] = rows.map(row => ({
      id: row.id,
      projectId: row.project_id,
      leadName: row.lead_name,
      leadEmail: row.lead_email || undefined,
      conversationLocation: row.conversation_location,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { conversations };
  }
);
