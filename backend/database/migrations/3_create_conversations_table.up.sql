CREATE TABLE conversations (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lead_name TEXT NOT NULL,
  lead_company TEXT NOT NULL,
  lead_source TEXT,
  lead_notes TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_project_id ON conversations(project_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
CREATE INDEX idx_conversations_lead_name ON conversations(lead_name);
CREATE INDEX idx_conversations_lead_company ON conversations(lead_company);
