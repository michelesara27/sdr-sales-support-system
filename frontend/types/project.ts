export interface Project {
  id: string;
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

export interface CreateProjectData {
  name: string;
  description: string;
  productDetails: string;
  targetAudience: string;
  objections: string[];
  valueArguments: string;
  approachGuide: string;
}
