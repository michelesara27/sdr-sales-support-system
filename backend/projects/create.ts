import { api } from "encore.dev/api";
import { sdrDB } from "../database/db";
import { CreateProjectRequest, ProjectResponse } from "./types";

// Creates a new project.
export const create = api<CreateProjectRequest, ProjectResponse>(
  { expose: true, method: "POST", path: "/projects" },
  async (req) => {
    // Insert project
    const projectRow = await sdrDB.queryRow<{
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
      INSERT INTO projects (
        name, description, product_details, target_audience, 
        value_arguments, approach_guide, status
      ) VALUES (
        ${req.name}, ${req.description}, ${req.productDetails}, 
        ${req.targetAudience}, ${req.valueArguments}, ${req.approachGuide}, 'active'
      )
      RETURNING *
    `;

    if (!projectRow) {
      throw new Error("Failed to create project");
    }

    // Insert objections
    if (req.objections.length > 0) {
      for (const objection of req.objections) {
        await sdrDB.exec`
          INSERT INTO objections (project_id, objection_text)
          VALUES (${projectRow.id}, ${objection})
        `;
      }
    }

    return {
      id: projectRow.id,
      name: projectRow.name,
      description: projectRow.description,
      productDetails: projectRow.product_details,
      targetAudience: projectRow.target_audience,
      objections: req.objections,
      valueArguments: projectRow.value_arguments,
      approachGuide: projectRow.approach_guide,
      status: projectRow.status as 'active' | 'inactive',
      createdAt: projectRow.created_at,
      updatedAt: projectRow.updated_at,
    };
  }
);
