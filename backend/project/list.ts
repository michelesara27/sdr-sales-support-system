import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { projectDB } from "./db";
import type { Project } from "./create";

export interface ListProjectsRequest {
  search?: Query<string>;
  limit?: Query<number>;
}

export interface ListProjectsResponse {
  projects: Project[];
}

// Retrieves all projects, optionally filtered by search term.
export const list = api<ListProjectsRequest, ListProjectsResponse>(
  { expose: true, method: "GET", path: "/projects" },
  async (req) => {
    const limit = req.limit || 50;
    const search = req.search?.trim();

    let query = `
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
    `;
    const params: any[] = [];

    if (search) {
      query += ` WHERE name ILIKE $1 OR description ILIKE $1 OR company_name ILIKE $1 OR product_service_name ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const rows = await projectDB.rawQueryAll<{
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
    }>(query, ...params);

    const projects: Project[] = rows.map(row => ({
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
    }));

    return { projects };
  }
);
