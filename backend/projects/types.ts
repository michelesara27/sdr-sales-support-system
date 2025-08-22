export interface Project {
  id: number;
  name: string;
  description: string;
  product_details: string;
  target_audience: string;
  value_arguments: string;
  approach_guide: string;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface Objection {
  id: number;
  project_id: number;
  objection_text: string;
  created_at: Date;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  productDetails: string;
  targetAudience: string;
  objections: string[];
  valueArguments: string;
  approachGuide: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  productDetails?: string;
  targetAudience?: string;
  objections?: string[];
  valueArguments?: string;
  approachGuide?: string;
  status?: 'active' | 'inactive';
}

export interface ProjectResponse {
  id: number;
  name: string;
  description: string;
  productDetails: string;
  targetAudience: string;
  objections: string[];
  valueArguments: string;
  approachGuide: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectListResponse {
  projects: ProjectResponse[];
}
