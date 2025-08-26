import { api } from "encore.dev/api";
import { sdrDB } from "../database/db";
import { DashboardResponse, DashboardStats } from "./types";

// Retrieves dashboard statistics.
export const getDashboard = api<void, DashboardResponse>(
  { expose: true, method: "GET", path: "/analytics/dashboard" },
  async () => {
    const stats = await sdrDB.queryRow<DashboardStats>`
      SELECT 
        COUNT(DISTINCT p.id) as total_projects,
        COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END) as active_projects,
        COUNT(DISTINCT c.id) as total_conversations,
        COUNT(DISTINCT CASE WHEN c.status = 'open' THEN c.id END) as open_conversations,
        COUNT(DISTINCT CASE WHEN c.status = 'closed' THEN c.id END) as closed_conversations,
        COALESCE(AVG(ca.total_messages)::DOUBLE PRECISION, 0) as avg_messages_per_conversation,
        COUNT(DISTINCT m.id) as total_messages,
        COUNT(DISTINCT CASE WHEN m.message_type = 'user' THEN m.id END) as total_user_messages,
        COUNT(DISTINCT CASE WHEN m.message_type = 'ai' THEN m.id END) as total_ai_messages
      FROM projects p
      LEFT JOIN conversations c ON p.id = c.project_id
      LEFT JOIN conversation_analytics ca ON c.id = ca.conversation_id
      LEFT JOIN messages m ON c.id = m.conversation_id
    `;

    if (!stats) {
      throw new Error("Failed to retrieve dashboard stats");
    }

    return {
      stats: {
        totalProjects: Number(stats.total_projects) || 0,
        activeProjects: Number(stats.active_projects) || 0,
        totalConversations: Number(stats.total_conversations) || 0,
        openConversations: Number(stats.open_conversations) || 0,
        closedConversations: Number(stats.closed_conversations) || 0,
        avgMessagesPerConversation: Number(stats.avg_messages_per_conversation) || 0,
        totalMessages: Number(stats.total_messages) || 0,
        totalUserMessages: Number(stats.total_user_messages) || 0,
        totalAiMessages: Number(stats.total_ai_messages) || 0,
      }
    };
  }
);
