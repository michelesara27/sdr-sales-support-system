CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  product_details TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  value_arguments TEXT NOT NULL,
  approach_guide TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_projects_name ON projects(name);
