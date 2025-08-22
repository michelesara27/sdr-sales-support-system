import { api, APIError } from "encore.dev/api";
import { sdrDB } from "../database/db";
import { UpdateConversationRequest, ConversationResponse, MessageResponse } from "./types";

interface UpdateConversationParams {
  id: number;
}

// Updates an existing conversation.
export const update = api<UpdateConversationParams & UpdateConversationRequest, ConversationResponse>(
  { expose: true, method: "PUT", path: "/conversations/:id" },
  async ({ id, ...req }) => {
    // Check if conversation exists
    const existingConversation = await sdrDB.queryRow<{ id: number }>`
      SELECT id FROM conversations WHERE id = ${id}
    `;

    if (!existingConversation) {
      throw APIError.notFound("conversation not found");
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (req.status !== undefined) {
      updates.push(`status = $${values.length + 1}`);
      values.push(req.status);
    }
    if (req.leadName !== undefined) {
      updates.push(`lead_name = $${values.length + 1}`);
      values.push(req.leadName);
    }
    if (req.leadCompany !== undefined) {
      updates.push(`lead_company = $${values.length + 1}`);
      values.push(req.leadCompany);
    }
    if (req.leadSource !== undefined) {
      updates.push(`lead_source = $${values.length + 1}`);
      values.push(req.leadSource);
    }
    if (req.leadNotes !== undefined) {
      updates.push(`lead_notes = $${values.length + 1}`);
      values.push(req.leadNotes);
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("no fields to update");
    }

    // Update conversation
    const query = `UPDATE conversations SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${values.length + 1} RETURNING *`;
    values.push(id);

    const updatedConversation = await sdrDB.rawQueryRow<{
      id: number;
      project_id: number;
      lead_name: string;
      lead_company: string;
      lead_source: string | null;
      lead_notes: string | null;
      status: string;
      created_at: Date;
      updated_at: Date;
    }>(query, ...values);

    if (!updatedConversation) {
      throw APIError.internal("failed to update conversation");
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
      id: updatedConversation.id,
      projectId: updatedConversation.project_id,
      leadName: updatedConversation.lead_name,
      leadCompany: updatedConversation.lead_company,
      leadSource: updatedConversation.lead_source,
      leadNotes: updatedConversation.lead_notes,
      status: updatedConversation.status as 'open' | 'closed',
      messages: messageResponses,
      createdAt: updatedConversation.created_at,
      updatedAt: updatedConversation.updated_at,
    };
  }
);
