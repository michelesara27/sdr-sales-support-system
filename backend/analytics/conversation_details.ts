import { api } from "encore.dev/api";
import { sdrDB } from "../database/db";
import { ConversationDetailsResponse, ConversationDetail } from "./types";

// Retrieves conversation details with analytics.
export const getConversationDetails = api<void, ConversationDetailsResponse>(
  { expose: true, method: "GET", path: "/analytics/conversations" },
  async () => {
    const conversations = await sdrDB.queryAll<ConversationDetail>`
      SELECT 
        c.id,
        c.project_id,
        p.name as project_name,
        c.lead_name,
        c.lead_company,
        c.lead_source,
        c.lead_notes,
        c.status,
        c.created_at,
        c.updated_at,
        COALESCE(ca.total_messages, 0) as total_messages,
        COALESCE(ca.user_messages, 0) as user_messages,
        COALESCE(ca.ai_messages, 0) as ai_messages,
        ca.conversation_duration_minutes,
        ca.first_response_time_minutes,
        ca.last_activity_at
      FROM conversations c
      JOIN projects p ON c.project_id = p.id
      LEFT JOIN conversation_analytics ca ON c.id = ca.conversation_id
      ORDER BY c.updated_at DESC
    `;

    const conversationDetails: ConversationDetail[] = conversations.map(conversation => ({
      id: conversation.id,
      projectId: conversation.project_id,
      projectName: conversation.project_name,
      leadName: conversation.lead_name,
      leadCompany: conversation.lead_company,
      leadSource: conversation.lead_source,
      leadNotes: conversation.lead_notes,
      status: conversation.status,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
      totalMessages: Number(conversation.total_messages) || 0,
      userMessages: Number(conversation.user_messages) || 0,
      aiMessages: Number(conversation.ai_messages) || 0,
      conversationDurationMinutes: conversation.conversation_duration_minutes,
      firstResponseTimeMinutes: conversation.first_response_time_minutes,
      lastActivityAt: conversation.last_activity_at,
    }));

    return { conversations: conversationDetails };
  }
);
