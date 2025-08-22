import { api, APIError } from "encore.dev/api";
import { sdrDB } from "../database/db";

interface DeleteProjectParams {
  id: number;
}

// Deletes a project and all its related data.
export const deleteProject = api<DeleteProjectParams, void>(
  { expose: true, method: "DELETE", path: "/projects/:id" },
  async ({ id }) => {
    // Check if project exists
    const existingProject = await sdrDB.queryRow<{ id: number }>`
      SELECT id FROM projects WHERE id = ${id}
    `;

    if (!existingProject) {
      throw APIError.notFound("project not found");
    }

    // Delete project (cascading deletes will handle related data)
    await sdrDB.exec`DELETE FROM projects WHERE id = ${id}`;
  }
);
