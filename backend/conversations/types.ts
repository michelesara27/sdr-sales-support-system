export interface Conversation {
  id: number;
  project_id: number;
  lead_name: string;
  lead_company: string;
  lead_source: string | null;
  lead_notes: string | null;
  status: 'open' | 'closed';
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: number;
  conversation_id: number;
  message_type: 'user' | 'ai' | 'system';
  content: string;
  created_at: Date;
}

export interface CreateConversationRequest {
  projectId: number;
  leadName: string;
  leadCompany: string;
  leadSource?: string;
  leadNotes?: string;
}

export interface AddMessageRequest {
  type: 'user' | 'ai' | 'system';
  content: string;
}

export interface ConversationResponse {
  id: number;
  projectId: number;
  leadName: string;
  leadCompany: string;
  leadSource: string | null;
  leadNotes: string | null;
  status: 'open' | 'closed';
  messages: MessageResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageResponse {
  id: number;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

export interface ConversationListResponse {
  conversations: ConversationResponse[];
}

export interface UpdateConversationRequest {
  status?: 'open' | 'closed';
  leadName?: string;
  leadCompany?: string;
  leadSource?: string;
  leadNotes?: string;
}
