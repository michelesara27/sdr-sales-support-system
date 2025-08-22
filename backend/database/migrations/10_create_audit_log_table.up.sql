CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id BIGINT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_resource_type ON audit_log(resource_type);
CREATE INDEX idx_audit_log_resource_id ON audit_log(resource_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
