CREATE TABLE project_analytics (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value DOUBLE PRECISION NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_analytics_project_id ON project_analytics(project_id);
CREATE INDEX idx_project_analytics_metric_name ON project_analytics(metric_name);
CREATE INDEX idx_project_analytics_metric_date ON project_analytics(metric_date);
CREATE UNIQUE INDEX idx_project_analytics_unique ON project_analytics(project_id, metric_name, metric_date);
