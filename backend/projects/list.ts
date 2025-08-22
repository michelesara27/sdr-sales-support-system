import { api } from "encore.dev/api";
import { sdrDB } from "../database/db";
import { ProjectListResponse, ProjectResponse } from "./types";

// Retrieves all projects with their objections.
export const list = api<void, ProjectListResponse>(
  { expose: true, method: "GET", path: "/projects" },
  async () => {
    // Get all projects
    const projects = await sdrDB.queryAll<{
      id: number;
      name: string;
      description: string;
      product_details: string;
      target_audience: string;
      value_arguments: string;
      approach_guide: string;
      status: string;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT * FROM projects ORDER BY created_at DESC
    `;

    // Get all objections for these projects
    const objections = await sdrDB.queryAll<{
      project_id: number;
      objection_text: string;
    }>`
      SELECT project_id, objection_text FROM objections
      WHERE project_id = ANY(${projects.map(p => p.id)})
      ORDER BY created_at ASC
    `;

    // Group objections by project
    const objectionsByProject = objections.reduce((acc, obj) => {
      if (!acc[obj.project_id]) {
        acc[obj.project_id] = [];
      }
      acc[obj.project_id].push(obj.objection_text);
      return acc;
    }, {} as Record<number, string[]>);

    const projectResponses: ProjectResponse[] = projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      productDetails: project.product_details,
      targetAudience: project.target_audience,
      objections: objectionsByProject[project.id] || [],
      valueArguments: project.value_arguments,
      approachGuide: project.approach_guide,
      status: project.status as 'active' | 'inactive',
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    }));

    return { projects: projectResponses };
  }
);
