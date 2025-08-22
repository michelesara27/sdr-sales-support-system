-- Insert sample projects
INSERT INTO projects (name, description, product_details, target_audience, value_arguments, approach_guide, status) VALUES
(
  'CRM Software Sales',
  'Enterprise CRM solution for mid-market companies',
  'Our CRM platform offers comprehensive customer relationship management with advanced analytics, automation workflows, and seamless integrations.',
  'Sales directors and VPs at companies with 50-500 employees in B2B sectors',
  'Increase sales productivity by 35%, reduce manual tasks by 60%, and improve customer retention through better insights.',
  'Professional yet friendly tone. Focus on ROI and efficiency gains. Use specific metrics and case studies.',
  'active'
),
(
  'Marketing Automation Platform',
  'All-in-one marketing automation for growing businesses',
  'Complete marketing automation suite including email campaigns, lead scoring, social media management, and detailed analytics.',
  'Marketing managers and CMOs at growing companies with 20-200 employees',
  'Consolidate 5+ tools into one platform, reduce marketing costs by 40%, and increase qualified leads by 50%.',
  'Consultative approach. Ask about current pain points. Demonstrate quick wins and long-term value.',
  'active'
),
(
  'Cybersecurity Solution',
  'Enterprise-grade cybersecurity for small to medium businesses',
  'Comprehensive cybersecurity platform with threat detection, incident response, and compliance management.',
  'IT directors and security officers at companies with 25-250 employees',
  'Prevent costly data breaches, ensure compliance, and provide 24/7 monitoring with expert support.',
  'Security-focused messaging. Use fear of breach consequences. Emphasize peace of mind and expert support.',
  'inactive'
);

-- Insert sample objections for CRM project (id = 1)
INSERT INTO objections (project_id, objection_text) VALUES
(1, 'Too expensive compared to current solution'),
(1, 'Integration concerns with existing systems'),
(1, 'Team adoption and training time'),
(1, 'Data migration complexity');

-- Insert sample objections for Marketing Automation project (id = 2)
INSERT INTO objections (project_id, objection_text) VALUES
(2, 'Already using multiple tools'),
(2, 'Learning curve for the team'),
(2, 'Budget constraints'),
(2, 'Uncertain about ROI');

-- Insert sample objections for Cybersecurity project (id = 3)
INSERT INTO objections (project_id, objection_text) VALUES
(3, 'Current security seems adequate'),
(3, 'Complex implementation process'),
(3, 'High upfront costs'),
(3, 'Lack of internal expertise');

-- Insert sample conversations
INSERT INTO conversations (project_id, lead_name, lead_company, lead_source, lead_notes, status) VALUES
(
  1,
  'John Smith',
  'TechCorp Inc.',
  'LinkedIn',
  'Interested in CRM solutions, currently using Salesforce but looking for alternatives',
  'open'
),
(
  2,
  'Sarah Johnson',
  'GrowthCo',
  'Cold Email',
  'Marketing manager looking to consolidate tools',
  'closed'
);

-- Insert sample messages for conversation 1
INSERT INTO messages (conversation_id, message_type, content) VALUES
(
  1,
  'user',
  'Hi John, I noticed you''re using Salesforce. What challenges are you facing with your current CRM?'
),
(
  1,
  'ai',
  'Great opening! Here are some follow-up suggestions:

• "Many of our clients switched from Salesforce due to complexity and cost"
• "What specific features are most important to your sales team?"
• "How much time does your team spend on manual data entry?"'
);

-- Insert sample messages for conversation 2
INSERT INTO messages (conversation_id, message_type, content) VALUES
(
  2,
  'user',
  'Hi Sarah, I see you''re managing multiple marketing tools. How much time does your team spend switching between platforms?'
),
(
  2,
  'ai',
  'Excellent question! Consider these follow-ups:

• "What''s the biggest challenge with your current tool stack?"
• "How do you currently track ROI across different platforms?"
• "Would you be interested in seeing how we helped similar companies reduce their tool count by 60%?"'
);

-- Insert sample analytics data
INSERT INTO project_analytics (project_id, metric_name, metric_value, metric_date) VALUES
(1, 'conversion_rate', 24.5, CURRENT_DATE - INTERVAL '1 day'),
(1, 'active_leads', 142, CURRENT_DATE),
(1, 'conversations_started', 15, CURRENT_DATE),
(2, 'conversion_rate', 18.2, CURRENT_DATE - INTERVAL '1 day'),
(2, 'active_leads', 89, CURRENT_DATE),
(2, 'conversations_started', 8, CURRENT_DATE);

-- Insert conversation analytics
INSERT INTO conversation_analytics (conversation_id, total_messages, user_messages, ai_messages, last_activity_at) VALUES
(1, 2, 1, 1, NOW() - INTERVAL '1 hour'),
(2, 2, 1, 1, NOW() - INTERVAL '1 day');
