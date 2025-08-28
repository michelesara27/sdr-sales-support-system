import { api, APIError } from "encore.dev/api";
import { projectDB } from "./db";

export interface DeleteProjectRequest {
  id: number;
}

// Deletes a project.
export const deleteProject = api<DeleteProjectRequest, void>(
  { expose: true, method: "DELETE", path: "/projects/:id" },
  async (req) => {
    const result = await projectDB.exec`
      DELETE FROM projects WHERE id = ${req.id}
    `;

    // Note: PostgreSQL doesn't return affected rows count in this context
    // We'll assume the delete was successful if no error was thrown
  }
);
