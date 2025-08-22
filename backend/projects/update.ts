import { api, APIError } from "encore.dev/api";
import { sdrDB } from "../database/db";
import { UpdateProjectRequest, ProjectResponse } from "./types";

interface UpdateProjectParams {
  id: number;
}

// Updates an existing project.
export const update = api<UpdateProjectParams & UpdateProjectRequest, ProjectResponse>(
  { expose: true, method: "PUT", path: "/projects/:id" },
  async ({ id, ...req }) => {
    // Check if project exists
    const existingProject = await sdrDB.queryRow<{ id: number }>`
      SELECT id FROM projects WHERE id = ${id}
    `;

    if (!existingProject) {
      throw APIError.notFound("project not found");
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (req.name !== undefined) {
      updates.push(`name = $${values.length + 1}`);
      values.push(req.name);
    }
    if (req.description !== undefined) {
      updates.push(`description = $${values.length + 1}`);
      values.push(req.description);
    }
    if (req.productDetails !== undefined) {
      updates.push(`product_details = $${values.length + 1}`);
      values.push(req.productDetails);
    }
    if (req.targetAudience !== undefined) {
      updates.push(`target_audience = $${values.length + 1}`);
      values.push(req.targetAudience);
    }
    if (req.valueArguments !== undefined) {
      updates.push(`value_arguments = $${values.length + 1}`);
      values.push(req.valueArguments);
    }
    if (req.approachGuide !== undefined) {
      updates.push(`approach_guide = $${values.length + 1}`);
      values.push(req.approachGuide);
    }
    if (req.status !== undefined) {
      updates.push(`status = $${values.length + 1}`);
      values.push(req.status);
    }

    if (updates.length === 0 && !req.objections) {
      throw APIError.invalidArgument("no fields to update");
    }

    // Update project if there are field updates
    if (updates.length > 0) {
      const query = `UPDATE projects SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${values.length + 1} RETURNING *`;
      values.push(id);

      await sdrDB.rawExec(query, ...values);
    }

    // Update objections if provided
    if (req.objections !== undefined) {
      // Delete existing objections
      await sdrDB.exec`DELETE FROM objections WHERE project_id = ${id}`;

      // Insert new objections
      for (const objection of req.objections) {
        await sdrDB.exec`
          INSERT INTO objections (project_id, objection_text)
          VALUES (${id}, ${objection})
        `;
      }
    }

    // Get updated project
    const updatedProject = await sdrDB.queryRow<{
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

    if (!updatedProject) {
      throw APIError.internal("failed to retrieve updated project");
    }

    // Get objections
    const objections = await sdrDB.queryAll<{
      objection_text: string;
    }>`
      SELECT objection_text FROM objections 
      WHERE project_id = ${id}
      ORDER BY created_at ASC
    `;

    return {
      id: updatedProject.id,
      name: updatedProject.name,
      description: updatedProject.description,
      productDetails: updatedProject.product_details,
      targetAudience: updatedProject.target_audience,
      objections: objections.map(o => o.objection_text),
      valueArguments: updatedProject.value_arguments,
      approachGuide: updatedProject.approach_guide,
      status: updatedProject.status as 'active' | 'inactive',
      createdAt: updatedProject.created_at,
      updatedAt: updatedProject.updated_at,
    };
  }
);
