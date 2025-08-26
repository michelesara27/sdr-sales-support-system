import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { sdrDB } from "../database/db";
import { ConversationListResponse, ConversationResponse, MessageResponse } from "./types";

interface ListConversationsParams {
  projectId?: Query<number>;
  status?: Query<'open' | 'closed'>;
}

// Retrieves all conversations with optional filtering.
export const list = api<ListConversationsParams, ConversationListResponse>(
  { expose: true, method: "GET", path: "/conversations" },
  async (params = {}) => {
    // Safely extract parameters with default empty object
    const projectId = params?.projectId;
    const status = params?.status;
    
    // Build WHERE clause
    const conditions: string[] = [];
    const values: any[] = [];

    if (projectId !== undefined && projectId !== null) {
      conditions.push(`c.project_id = $${values.length + 1}`);
      values.push(projectId);
    }

    if (status !== undefined && status !== null) {
      conditions.push(`c.status = $${values.length + 1}`);
      values.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get conversations
    const conversations = await sdrDB.rawQueryAll<{
      id: number;
      project_id: number;
      lead_name: string;
      lead_company: string;
      lead_source: string | null;
      lead_notes: string | null;
      status: string;
      created_at: Date;
      updated_at: Date;
    }>(
      `SELECT * FROM conversations c ${whereClause} ORDER BY c.updated_at DESC`,
      ...values
    );

    // Get all messages for these conversations
    const conversationIds = conversations.map(c => c.id);
    let messages: {
      id: number;
      conversation_id: number;
      message_type: string;
      content: string;
      created_at: Date;
    }[] = [];

    if (conversationIds.length > 0) {
      messages = await sdrDB.rawQueryAll<{
        id: number;
        conversation_id: number;
        message_type: string;
        content: string;
        created_at: Date;
      }>(
        `SELECT * FROM messages WHERE conversation_id = ANY($1) ORDER BY created_at ASC`,
        conversationIds
      );
    }

    // Group messages by conversation
    const messagesByConversation = messages.reduce((acc, msg) => {
      if (!acc[msg.conversation_id]) {
        acc[msg.conversation_id] = [];
      }
      acc[msg.conversation_id].push({
        id: msg.id,
        type: msg.message_type as 'user' | 'ai' | 'system',
        content: msg.content,
        timestamp: msg.created_at,
      });
      return acc;
    }, {} as Record<number, MessageResponse[]>);

    const conversationResponses: ConversationResponse[] = conversations.map(conversation => ({
      id: conversation.id,
      projectId: conversation.project_id,
      leadName: conversation.lead_name,
      leadCompany: conversation.lead_company,
      leadSource: conversation.lead_source,
      leadNotes: conversation.lead_notes,
      status: conversation.status as 'open' | 'closed',
      messages: messagesByConversation[conversation.id] || [],
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
    }));

    return { conversations: conversationResponses };
  }
);
