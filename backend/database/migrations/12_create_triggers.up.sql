-- Trigger to update updated_at timestamp on projects
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON conversations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_analytics_updated_at 
    BEFORE UPDATE ON conversation_analytics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update conversation analytics when messages are added
CREATE OR REPLACE FUNCTION update_conversation_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or insert conversation analytics
    INSERT INTO conversation_analytics (
        conversation_id, 
        total_messages, 
        user_messages, 
        ai_messages, 
        last_activity_at
    )
    SELECT 
        NEW.conversation_id,
        COUNT(*),
        COUNT(*) FILTER (WHERE message_type = 'user'),
        COUNT(*) FILTER (WHERE message_type = 'ai'),
        MAX(created_at)
    FROM messages 
    WHERE conversation_id = NEW.conversation_id
    GROUP BY conversation_id
    ON CONFLICT (conversation_id) 
    DO UPDATE SET
        total_messages = EXCLUDED.total_messages,
        user_messages = EXCLUDED.user_messages,
        ai_messages = EXCLUDED.ai_messages,
        last_activity_at = EXCLUDED.last_activity_at,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversation_analytics_on_message_insert
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_analytics();
