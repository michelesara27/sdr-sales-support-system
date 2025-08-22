CREATE TABLE conversation_analytics (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  total_messages INTEGER NOT NULL DEFAULT 0,
  user_messages INTEGER NOT NULL DEFAULT 0,
  ai_messages INTEGER NOT NULL DEFAULT 0,
  conversation_duration_minutes INTEGER,
  first_response_time_minutes INTEGER,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversation_analytics_conversation_id ON conversation_analytics(conversation_id);
CREATE INDEX idx_conversation_analytics_last_activity ON conversation_analytics(last_activity_at);
CREATE UNIQUE INDEX idx_conversation_analytics_unique ON conversation_analytics(conversation_id);
