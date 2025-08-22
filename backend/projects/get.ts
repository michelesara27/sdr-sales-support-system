import { api, APIError } from "encore.dev/api";
import { sdrDB } from "../database/db";
import { ProjectResponse } from "./types";

interface GetProjectParams {
  id: number;
}

// Retrieves a specific project by ID.
export const get = api<GetProjectParams, ProjectResponse>(
  { expose: true, method: "GET", path: "/projects/:id" },
  async ({ id }) => {
    // Get project
    const project = await sdrDB.queryRow<{
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
      SELECT * FROM projects WHERE id = ${id}
    `;

    if (!project) {
      throw APIError.notFound("project not found");
    }

    // Get objections for this project
    const objections = await sdrDB.queryAll<{
      objection_text: string;
    }>`
      SELECT objection_text FROM objections 
      WHERE project_id = ${id}
      ORDER BY created_at ASC
    `;

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      productDetails: project.product_details,
      targetAudience: project.target_audience,
      objections: objections.map(o => o.objection_text),
      valueArguments: project.value_arguments,
      approachGuide: project.approach_guide,
      status: project.status as 'active' | 'inactive',
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    };
  }
);
