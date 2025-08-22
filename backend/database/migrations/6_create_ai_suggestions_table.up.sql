CREATE TABLE ai_suggestions (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  ai_response_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  processing_time_ms INTEGER,
  model_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_suggestions_conversation_id ON ai_suggestions(conversation_id);
CREATE INDEX idx_ai_suggestions_user_message_id ON ai_suggestions(user_message_id);
CREATE INDEX idx_ai_suggestions_ai_response_id ON ai_suggestions(ai_response_id);
CREATE INDEX idx_ai_suggestions_created_at ON ai_suggestions(created_at);
