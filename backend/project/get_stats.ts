import { api } from "encore.dev/api";
import { projectDB } from "./db";

export interface ProjectStatsResponse {
  totalProjects: number;
  recentProjects: number;
}

// Retrieves project statistics for the dashboard.
export const getStats = api<void, ProjectStatsResponse>(
  { expose: true, method: "GET", path: "/projects/stats" },
  async () => {
    const totalRow = await projectDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM projects
    `;

    const recentRow = await projectDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count 
      FROM projects 
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `;

    return {
      totalProjects: totalRow?.count || 0,
      recentProjects: recentRow?.count || 0,
    };
  }
);
