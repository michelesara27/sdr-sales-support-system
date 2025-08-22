import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { sdrDB } from "../database/db";
import { RecentActivityResponse, RecentActivity } from "./types";

interface RecentActivityParams {
  limit?: Query<number>;
}

// Retrieves recent activity across the system.
export const getRecentActivity = api<RecentActivityParams, RecentActivityResponse>(
  { expose: true, method: "GET", path: "/analytics/recent-activity" },
  async ({ limit = 20 }) => {
    const activities = await sdrDB.queryAll<RecentActivity>`
      SELECT 
        'conversation' as activity_type,
        c.id as resource_id,
        c.lead_name as title,
        c.lead_company as subtitle,
        p.name as project_name,
        c.status,
        c.updated_at as activity_date
      FROM conversations c
      JOIN projects p ON c.project_id = p.id
      UNION ALL
      SELECT 
        'project' as activity_type,
        p.id as resource_id,
        p.name as title,
        p.description as subtitle,
        p.name as project_name,
        p.status,
        p.updated_at as activity_date
      FROM projects p
      ORDER BY activity_date DESC
      LIMIT ${limit}
    `;

    const recentActivities: RecentActivity[] = activities.map(activity => ({
      activityType: activity.activity_type,
      resourceId: activity.resource_id,
      title: activity.title,
      subtitle: activity.subtitle,
      projectName: activity.project_name,
      status: activity.status,
      activityDate: activity.activity_date,
    }));

    return { activities: recentActivities };
  }
);
