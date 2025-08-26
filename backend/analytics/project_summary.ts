import { api } from "encore.dev/api";
import { sdrDB } from "../database/db";
import { ProjectSummaryResponse, ProjectSummary } from "./types";

// Retrieves project summary with analytics.
export const getProjectSummary = api<void, ProjectSummaryResponse>(
  { expose: true, method: "GET", path: "/analytics/projects" },
  async () => {
    const projects = await sdrDB.queryAll<ProjectSummary>`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.status,
        p.created_at,
        p.updated_at,
        COUNT(DISTINCT c.id) as total_conversations,
        COUNT(DISTINCT CASE WHEN c.status = 'open' THEN c.id END) as open_conversations,
        COUNT(DISTINCT CASE WHEN c.status = 'closed' THEN c.id END) as closed_conversations,
        COUNT(DISTINCT o.id) as total_objections,
        COALESCE(AVG(ca.total_messages)::DOUBLE PRECISION, 0) as avg_messages_per_conversation,
        MAX(c.updated_at) as last_conversation_activity
      FROM projects p
      LEFT JOIN conversations c ON p.id = c.project_id
      LEFT JOIN objections o ON p.id = o.project_id
      LEFT JOIN conversation_analytics ca ON c.id = ca.conversation_id
      GROUP BY p.id, p.name, p.description, p.status, p.created_at, p.updated_at
      ORDER BY p.created_at DESC
    `;

    const projectSummaries: ProjectSummary[] = projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      totalConversations: Number(project.total_conversations) || 0,
      openConversations: Number(project.open_conversations) || 0,
      closedConversations: Number(project.closed_conversations) || 0,
      totalObjections: Number(project.total_objections) || 0,
      avgMessagesPerConversation: Number(project.avg_messages_per_conversation) || 0,
      lastConversationActivity: project.last_conversation_activity,
    }));

    return { projects: projectSummaries };
  }
);
