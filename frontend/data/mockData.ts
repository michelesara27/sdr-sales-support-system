import { Project } from '../types/project';
import { Conversation } from '../types/conversation';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'CRM Software Sales',
    description: 'Enterprise CRM solution for mid-market companies',
    productDetails: 'Our CRM platform offers comprehensive customer relationship management with advanced analytics, automation workflows, and seamless integrations.',
    targetAudience: 'Sales directors and VPs at companies with 50-500 employees in B2B sectors',
    objections: [
      'Too expensive compared to current solution',
      'Integration concerns with existing systems',
      'Team adoption and training time',
      'Data migration complexity'
    ],
    valueArguments: 'Increase sales productivity by 35%, reduce manual tasks by 60%, and improve customer retention through better insights.',
    approachGuide: 'Professional yet friendly tone. Focus on ROI and efficiency gains. Use specific metrics and case studies.',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Marketing Automation Platform',
    description: 'All-in-one marketing automation for growing businesses',
    productDetails: 'Complete marketing automation suite including email campaigns, lead scoring, social media management, and detailed analytics.',
    targetAudience: 'Marketing managers and CMOs at growing companies with 20-200 employees',
    objections: [
      'Already using multiple tools',
      'Learning curve for the team',
      'Budget constraints',
      'Uncertain about ROI'
    ],
    valueArguments: 'Consolidate 5+ tools into one platform, reduce marketing costs by 40%, and increase qualified leads by 50%.',
    approachGuide: 'Consultative approach. Ask about current pain points. Demonstrate quick wins and long-term value.',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    name: 'Cybersecurity Solution',
    description: 'Enterprise-grade cybersecurity for small to medium businesses',
    productDetails: 'Comprehensive cybersecurity platform with threat detection, incident response, and compliance management.',
    targetAudience: 'IT directors and security officers at companies with 25-250 employees',
    objections: [
      'Current security seems adequate',
      'Complex implementation process',
      'High upfront costs',
      'Lack of internal expertise'
    ],
    valueArguments: 'Prevent costly data breaches, ensure compliance, and provide 24/7 monitoring with expert support.',
    approachGuide: 'Security-focused messaging. Use fear of breach consequences. Emphasize peace of mind and expert support.',
    status: 'inactive',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
  },
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    projectId: '1',
    leadContext: {
      name: 'John Smith',
      company: 'TechCorp Inc.',
      source: 'LinkedIn',
      notes: 'Interested in CRM solutions, currently using Salesforce but looking for alternatives'
    },
    status: 'open',
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'Hi John, I noticed you\'re using Salesforce. What challenges are you facing with your current CRM?',
        timestamp: new Date('2024-01-20T10:00:00'),
      },
      {
        id: '2',
        type: 'ai',
        content: 'Great opening! Here are some follow-up suggestions:\n\n• "Many of our clients switched from Salesforce due to complexity and cost"\n• "What specific features are most important to your sales team?"\n• "How much time does your team spend on manual data entry?"',
        timestamp: new Date('2024-01-20T10:01:00'),
      },
    ],
    createdAt: new Date('2024-01-20T09:30:00'),
    updatedAt: new Date('2024-01-20T10:01:00'),
  },
  {
    id: '2',
    projectId: '2',
    leadContext: {
      name: 'Sarah Johnson',
      company: 'GrowthCo',
      source: 'Cold Email',
      notes: 'Marketing manager looking to consolidate tools'
    },
    status: 'closed',
    messages: [
      {
        id: '3',
        type: 'user',
        content: 'Hi Sarah, I see you\'re managing multiple marketing tools. How much time does your team spend switching between platforms?',
        timestamp: new Date('2024-01-19T14:00:00'),
      },
      {
        id: '4',
        type: 'ai',
        content: 'Excellent question! Consider these follow-ups:\n\n• "What\'s the biggest challenge with your current tool stack?"\n• "How do you currently track ROI across different platforms?"\n• "Would you be interested in seeing how we helped similar companies reduce their tool count by 60%?"',
        timestamp: new Date('2024-01-19T14:01:00'),
      },
    ],
    createdAt: new Date('2024-01-19T13:45:00'),
    updatedAt: new Date('2024-01-19T14:30:00'),
  },
];
