import { api, APIError } from "encore.dev/api";
import { projectDB } from "./db";
import type { Project } from "./create";

export interface GetProjectRequest {
  id: number;
}

// Retrieves a project by ID.
export const getById = api<GetProjectRequest, Project>(
  { expose: true, method: "GET", path: "/projects/:id" },
  async (req) => {
    const row = await projectDB.queryRow<{
      id: number;
      name: string;
      description: string | null;
      product_service_name: string | null;
      company_name: string | null;
      ideal_client_profile: string | null;
      product_service_description: string | null;
      segment: string | null;
      problem_solved: string | null;
      value_proposition: string | null;
      competitive_advantages: string | null;
      expected_objections: string | null;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT 
        id, 
        name, 
        description, 
        product_service_name, 
        company_name, 
        ideal_client_profile, 
        product_service_description, 
        segment, 
        problem_solved, 
        value_proposition, 
        competitive_advantages, 
        expected_objections, 
        created_at, 
        updated_at
      FROM projects 
      WHERE id = ${req.id}
    `;

    if (!row) {
      throw APIError.notFound("Project not found");
    }

    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      productServiceName: row.product_service_name || undefined,
      companyName: row.company_name || undefined,
      idealClientProfile: row.ideal_client_profile || undefined,
      productServiceDescription: row.product_service_description || undefined,
      segment: row.segment || undefined,
      problemSolved: row.problem_solved || undefined,
      valueProposition: row.value_proposition || undefined,
      competitiveAdvantages: row.competitive_advantages || undefined,
      expectedObjections: row.expected_objections || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);
