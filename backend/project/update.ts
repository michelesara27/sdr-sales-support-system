import { api, APIError } from "encore.dev/api";
import { projectDB } from "./db";
import type { Project } from "./create";

export interface UpdateProjectRequest {
  id: number;
  name?: string;
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

// Updates an existing project.
export const update = api<UpdateProjectRequest, Project>(
  { expose: true, method: "PUT", path: "/projects/:id" },
  async (req) => {
    const setParts: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (req.name !== undefined) {
      setParts.push(`name = $${paramIndex++}`);
      params.push(req.name);
    }

    if (req.description !== undefined) {
      setParts.push(`description = $${paramIndex++}`);
      params.push(req.description || null);
    }

    if (req.productServiceName !== undefined) {
      setParts.push(`product_service_name = $${paramIndex++}`);
      params.push(req.productServiceName || null);
    }

    if (req.companyName !== undefined) {
      setParts.push(`company_name = $${paramIndex++}`);
      params.push(req.companyName || null);
    }

    if (req.idealClientProfile !== undefined) {
      setParts.push(`ideal_client_profile = $${paramIndex++}`);
      params.push(req.idealClientProfile || null);
    }

    if (req.productServiceDescription !== undefined) {
      setParts.push(`product_service_description = $${paramIndex++}`);
      params.push(req.productServiceDescription || null);
    }

    if (req.segment !== undefined) {
      setParts.push(`segment = $${paramIndex++}`);
      params.push(req.segment || null);
    }

    if (req.problemSolved !== undefined) {
      setParts.push(`problem_solved = $${paramIndex++}`);
      params.push(req.problemSolved || null);
    }

    if (req.valueProposition !== undefined) {
      setParts.push(`value_proposition = $${paramIndex++}`);
      params.push(req.valueProposition || null);
    }

    if (req.competitiveAdvantages !== undefined) {
      setParts.push(`competitive_advantages = $${paramIndex++}`);
      params.push(req.competitiveAdvantages || null);
    }

    if (req.expectedObjections !== undefined) {
      setParts.push(`expected_objections = $${paramIndex++}`);
      params.push(req.expectedObjections || null);
    }

    if (setParts.length === 0) {
      throw APIError.invalidArgument("At least one field must be provided for update");
    }

    setParts.push(`updated_at = NOW()`);
    params.push(req.id);

    const query = `
      UPDATE projects
      SET ${setParts.join(', ')}
      WHERE id = $${paramIndex}
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

    const row = await projectDB.rawQueryRow<{
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
