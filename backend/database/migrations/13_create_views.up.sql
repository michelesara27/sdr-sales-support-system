-- View for project summary with analytics
CREATE VIEW project_summary AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.status,
    p.created_at,
    p.updated_at,
    COUNT(DISTINCT c.id) as total_conversations,
    COUNT(DISTINCT CASE WHEN c.status = 'open' THEN c.id END) as open_conversations,
    COUNT(DISTINCT CASE WHEN c.status = 'closed' THEN c.id END) as closed_conversations,
    COUNT(DISTINCT o.id) as total_objections,
    COALESCE(AVG(ca.total_messages)::DOUBLE PRECISION, 0) as avg_messages_per_conversation,
    MAX(c.updated_at) as last_conversation_activity
FROM projects p
LEFT JOIN conversations c ON p.id = c.project_id
LEFT JOIN objections o ON p.id = o.project_id
LEFT JOIN conversation_analytics ca ON c.id = ca.conversation_id
GROUP BY p.id, p.name, p.description, p.status, p.created_at, p.updated_at;

-- View for conversation details with analytics
CREATE VIEW conversation_details AS
SELECT 
    c.id,
    c.project_id,
    p.name as project_name,
    c.lead_name,
    c.lead_company,
    c.lead_source,
    c.lead_notes,
    c.status,
    c.created_at,
    c.updated_at,
    COALESCE(ca.total_messages, 0) as total_messages,
    COALESCE(ca.user_messages, 0) as user_messages,
    COALESCE(ca.ai_messages, 0) as ai_messages,
    ca.conversation_duration_minutes,
    ca.first_response_time_minutes,
    ca.last_activity_at
FROM conversations c
JOIN projects p ON c.project_id = p.id
LEFT JOIN conversation_analytics ca ON c.id = ca.conversation_id;

-- View for recent activity dashboard
CREATE VIEW recent_activity AS
SELECT 
    'conversation' as activity_type,
    c.id as resource_id,
    c.lead_name as title,
    c.lead_company as subtitle,
    p.name as project_name,
    c.status,
    c.updated_at as activity_date
FROM conversations c
JOIN projects p ON c.project_id = p.id
UNION ALL
SELECT 
    'project' as activity_type,
    p.id as resource_id,
    p.name as title,
    p.description as subtitle,
    p.name as project_name,
    p.status,
    p.updated_at as activity_date
FROM projects p
ORDER BY activity_date DESC;

-- View for analytics dashboard
CREATE VIEW analytics_dashboard AS
SELECT 
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END) as active_projects,
    COUNT(DISTINCT c.id) as total_conversations,
    COUNT(DISTINCT CASE WHEN c.status = 'open' THEN c.id END) as open_conversations,
    COUNT(DISTINCT CASE WHEN c.status = 'closed' THEN c.id END) as closed_conversations,
    COALESCE(AVG(ca.total_messages)::DOUBLE PRECISION, 0) as avg_messages_per_conversation,
    COUNT(DISTINCT m.id) as total_messages,
    COUNT(DISTINCT CASE WHEN m.message_type = 'user' THEN m.id END) as total_user_messages,
    COUNT(DISTINCT CASE WHEN m.message_type = 'ai' THEN m.id END) as total_ai_messages
FROM projects p
LEFT JOIN conversations c ON p.id = c.project_id
LEFT JOIN conversation_analytics ca ON c.id = ca.conversation_id
LEFT JOIN messages m ON c.id = m.conversation_id;
