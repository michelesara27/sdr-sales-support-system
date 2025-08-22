CREATE TABLE user_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  preference_key TEXT NOT NULL,
  preference_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_key ON user_preferences(preference_key);
CREATE UNIQUE INDEX idx_user_preferences_unique ON user_preferences(user_id, preference_key);
