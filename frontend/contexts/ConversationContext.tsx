import React, { createContext, useContext, useState, useEffect } from 'react';
import { Conversation, CreateConversationData, Message } from '../types/conversation';
import { mockConversations } from '../data/mockData';

interface ConversationContextType {
  conversations: Conversation[];
  createConversation: (data: CreateConversationData) => string;
  updateConversation: (id: string, data: Partial<Conversation>) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  getConversation: (id: string) => Conversation | undefined;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('conversations');
    return saved ? JSON.parse(saved) : mockConversations;
  });

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  const createConversation = (data: CreateConversationData): string => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      ...data,
      status: 'open',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [...prev, newConversation]);
    return newConversation.id;
  };

  const updateConversation = (id: string, data: Partial<Conversation>) => {
    setConversations(prev => prev.map(conversation => 
      conversation.id === id 
        ? { ...conversation, ...data, updatedAt: new Date() }
        : conversation
    ));
  };

  const addMessage = (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...message,
    };

    setConversations(prev => prev.map(conversation => 
      conversation.id === conversationId 
        ? { 
            ...conversation, 
            messages: [...conversation.messages, newMessage],
            updatedAt: new Date()
          }
        : conversation
    ));
  };

  const getConversation = (id: string) => {
    return conversations.find(conversation => conversation.id === id);
  };

  return (
    <ConversationContext.Provider value={{
      conversations,
      createConversation,
      updateConversation,
      addMessage,
      getConversation,
    }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversations must be used within a ConversationProvider');
  }
  return context;
}
