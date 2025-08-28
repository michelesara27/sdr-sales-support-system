import { api } from "encore.dev/api";
import { projectDB } from "./db";

export interface CreateProjectRequest {
  name: string;
  description?: string;
  productServiceName?: string;
  companyName?: string;
  idealClientProfile?: string;
  productServiceDescription?: string;
  segment?: string;
  problemSolved?: string;
  valueProposition?: string;
  competitiveAdvantages?: string;
  expectedObjections?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  productServiceName?: string;
  companyName?: string;
  idealClientProfile?: string;
  productServiceDescription?: string;
  segment?: string;
  problemSolved?: string;
  valueProposition?: string;
  competitiveAdvantages?: string;
  expectedObjections?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Creates a new project.
export const create = api<CreateProjectRequest, Project>(
  { expose: true, method: "POST", path: "/projects" },
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
      INSERT INTO projects (
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
        expected_objections
      )
      VALUES (
        ${req.name}, 
        ${req.description || null}, 
        ${req.productServiceName || null}, 
        ${req.companyName || null}, 
        ${req.idealClientProfile || null}, 
        ${req.productServiceDescription || null}, 
        ${req.segment || null}, 
        ${req.problemSolved || null}, 
        ${req.valueProposition || null}, 
        ${req.competitiveAdvantages || null}, 
        ${req.expectedObjections || null}
      )
      RETURNING 
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
    `;

    if (!row) {
      throw new Error("Failed to create project");
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
