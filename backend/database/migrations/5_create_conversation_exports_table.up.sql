CREATE TABLE conversation_exports (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL CHECK (export_type IN ('pipedream', 'csv', 'manual')),
  export_data JSONB,
  exported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversation_exports_conversation_id ON conversation_exports(conversation_id);
CREATE INDEX idx_conversation_exports_type ON conversation_exports(export_type);
CREATE INDEX idx_conversation_exports_exported_at ON conversation_exports(exported_at);
