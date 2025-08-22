import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBackend } from '../hooks/useBackend';
import { useToast } from '@/components/ui/use-toast';
import type { 
  ConversationResponse, 
  CreateConversationRequest, 
  UpdateConversationRequest,
  AddMessageRequest,
  MessageResponse
} from '~backend/conversations/types';

interface ConversationContextType {
  conversations: ConversationResponse[];
  isLoading: boolean;
  error: Error | null;
  createConversation: (data: CreateConversationRequest) => Promise<number>;
  updateConversation: (id: number, data: UpdateConversationRequest) => Promise<void>;
  addMessage: (conversationId: number, message: AddMessageRequest) => Promise<MessageResponse>;
  getConversation: (id: number) => ConversationResponse | undefined;
  deleteConversation: (id: number) => Promise<void>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const backend = useBackend();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: conversationsData, isLoading, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      try {
        return await backend.conversations.list();
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        throw error;
      }
    },
  });

  const createConversationMutation = useMutation({
    mutationFn: async (data: CreateConversationRequest) => {
      try {
        return await backend.conversations.create(data);
      } catch (error) {
        console.error('Failed to create conversation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create conversation. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const updateConversationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateConversationRequest }) => {
      try {
        await backend.conversations.update({ id, ...data });
      } catch (error) {
        console.error('Failed to update conversation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update conversation. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const addMessageMutation = useMutation({
    mutationFn: async ({ conversationId, message }: { conversationId: number; message: AddMessageRequest }) => {
      try {
        return await backend.conversations.addMessage({ id: conversationId, ...message });
      } catch (error) {
        console.error('Failed to add message:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add message. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        await backend.conversations.deleteConversation({ id });
      } catch (error) {
        console.error('Failed to delete conversation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: 'Conversation deleted',
        description: 'The conversation has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete conversation. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const conversations = conversationsData?.conversations || [];

  const createConversation = async (data: CreateConversationRequest): Promise<number> => {
    const result = await createConversationMutation.mutateAsync(data);
    return result.id;
  };

  const updateConversation = async (id: number, data: UpdateConversationRequest) => {
    await updateConversationMutation.mutateAsync({ id, data });
  };

  const addMessage = async (conversationId: number, message: AddMessageRequest): Promise<MessageResponse> => {
    return await addMessageMutation.mutateAsync({ conversationId, message });
  };

  const getConversation = (id: number) => {
    return conversations.find(conversation => conversation.id === id);
  };

  const deleteConversation = async (id: number) => {
    await deleteConversationMutation.mutateAsync(id);
  };

  return (
    <ConversationContext.Provider value={{
      conversations,
      isLoading,
      error,
      createConversation,
      updateConversation,
      addMessage,
      getConversation,
      deleteConversation,
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
