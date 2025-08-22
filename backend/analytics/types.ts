export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalConversations: number;
  openConversations: number;
  closedConversations: number;
  avgMessagesPerConversation: number;
  totalMessages: number;
  totalUserMessages: number;
  totalAiMessages: number;
}

export interface ProjectSummary {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  totalConversations: number;
  openConversations: number;
  closedConversations: number;
  totalObjections: number;
  avgMessagesPerConversation: number;
  lastConversationActivity: Date | null;
}

export interface ConversationDetail {
  id: number;
  projectId: number;
  projectName: string;
  leadName: string;
  leadCompany: string;
  leadSource: string | null;
  leadNotes: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  totalMessages: number;
  userMessages: number;
  aiMessages: number;
  conversationDurationMinutes: number | null;
  firstResponseTimeMinutes: number | null;
  lastActivityAt: Date | null;
}

export interface RecentActivity {
  activityType: string;
  resourceId: number;
  title: string;
  subtitle: string | null;
  projectName: string;
  status: string;
  activityDate: Date;
}

export interface DashboardResponse {
  stats: DashboardStats;
}

export interface ProjectSummaryResponse {
  projects: ProjectSummary[];
}

export interface ConversationDetailsResponse {
  conversations: ConversationDetail[];
}

export interface RecentActivityResponse {
  activities: RecentActivity[];
}
