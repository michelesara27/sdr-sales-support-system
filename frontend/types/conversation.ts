export interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

export interface LeadContext {
  name: string;
  company: string;
  source: string;
  notes: string;
}

export interface Conversation {
  id: string;
  projectId: string;
  leadContext: LeadContext;
  status: 'open' | 'closed';
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConversationData {
  projectId: string;
  leadContext: LeadContext;
}
