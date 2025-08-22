import { api, APIError } from "encore.dev/api";
import { sdrDB } from "../database/db";
import { CreateConversationRequest, ConversationResponse } from "./types";

// Creates a new conversation.
export const create = api<CreateConversationRequest, ConversationResponse>(
  { expose: true, method: "POST", path: "/conversations" },
  async (req) => {
    // Check if project exists
    const project = await sdrDB.queryRow<{ id: number }>`
      SELECT id FROM projects WHERE id = ${req.projectId}
    `;

    if (!project) {
      throw APIError.notFound("project not found");
    }

    // Create conversation
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
      INSERT INTO conversations (
        project_id, lead_name, lead_company, lead_source, lead_notes, status
      ) VALUES (
        ${req.projectId}, ${req.leadName}, ${req.leadCompany}, 
        ${req.leadSource || null}, ${req.leadNotes || null}, 'open'
      )
      RETURNING *
    `;

    if (!conversation) {
      throw new Error("Failed to create conversation");
    }

    return {
      id: conversation.id,
      projectId: conversation.project_id,
      leadName: conversation.lead_name,
      leadCompany: conversation.lead_company,
      leadSource: conversation.lead_source,
      leadNotes: conversation.lead_notes,
      status: conversation.status as 'open' | 'closed',
      messages: [],
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
    };
  }
);
