import { api } from "encore.dev/api";
import { conversationDB } from "./db";

export interface CreateConversationRequest {
  projectId: number;
  leadName: string;
  leadEmail?: string;
  conversationLocation: string;
}

export interface Conversation {
  id: number;
  projectId: number;
  leadName: string;
  leadEmail?: string;
  conversationLocation: string;
  createdAt: Date;
  updatedAt: Date;
}

// Creates a new conversation and returns the initial AI response.
export const create = api<CreateConversationRequest, Conversation>(
  { expose: true, method: "POST", path: "/conversations" },
  async (req) => {
    const row = await conversationDB.queryRow<{
      id: number;
      project_id: number;
      lead_name: string;
      lead_email: string | null;
      conversation_location: string;
      created_at: Date;
      updated_at: Date;
    }>`
      INSERT INTO conversations (project_id, lead_name, lead_email, conversation_location)
      VALUES (${req.projectId}, ${req.leadName}, ${req.leadEmail || null}, ${req.conversationLocation})
      RETURNING id, project_id, lead_name, lead_email, conversation_location, created_at, updated_at
    `;

    if (!row) {
      throw new Error("Failed to create conversation");
    }

    return {
      id: row.id,
      projectId: row.project_id,
      leadName: row.lead_name,
      leadEmail: row.lead_email || undefined,
      conversationLocation: row.conversation_location,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);
