CREATE TABLE objections (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  objection_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_objections_project_id ON objections(project_id);
