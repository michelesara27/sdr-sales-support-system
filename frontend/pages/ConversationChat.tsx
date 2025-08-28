import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Lightbulb, User, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";

function ConversationChat() {
  const { id } = useParams<{ id: string }>();
  const conversationId = parseInt(id || "0");
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messagesData, error: messagesError } = useQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: async () => {
      try {
        return await backend.conversation.getMessages({ conversationId });
      } catch (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }
    },
    enabled: !!conversationId,
    retry: 3,
    retryDelay: 1000,
  });

  const { data: conversationsData, error: conversationsError } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      try {
        return await backend.conversation.list();
      } catch (error) {
        console.error("Error fetching conversations:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  const conversation = conversationsData?.conversations.find(c => c.id === conversationId);

  const { data: projectData } = useQuery({
    queryKey: ["project", conversation?.projectId],
    queryFn: async () => {
      if (!conversation?.projectId) return null;
      try {
        return await backend.project.getById({ id: conversation.projectId });
      } catch (error) {
        console.error("Error fetching project:", error);
        return null;
      }
    },
    enabled: !!conversation?.projectId,
    retry: 3,
    retryDelay: 1000,
  });

  const addMessageMutation = useMutation({
    mutationFn: async (data: { role: "user" | "assistant"; content: string }) => {
      try {
        return await backend.conversation.addMessage({
          conversationId,
          role: data.role,
          content: data.content,
        });
      } catch (error) {
        console.error("Error adding message:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation-messages", conversationId] });
    },
    onError: (error) => {
      console.error("Error adding message:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
    },
  });

  const generateResponseMutation = useMutation({
    mutationFn: async (messages: Array<{ role: "user" | "assistant" | "system"; content: string }>) => {
      try {
        return await backend.ai.generateResponse({
          messages,
          context: conversation ? {
            leadName: conversation.leadName,
            conversationLocation: conversation.conversationLocation,
            projectName: projectData?.name,
            projectData: projectData ? {
              companyName: projectData.companyName,
              productServiceName: projectData.productServiceName,
              idealClientProfile: projectData.idealClientProfile,
              productServiceDescription: projectData.productServiceDescription,
              segment: projectData.segment,
              problemSolved: projectData.problemSolved,
              valueProposition: projectData.valueProposition,
              competitiveAdvantages: projectData.competitiveAdvantages,
              expectedObjections: projectData.expectedObjections,
            } : undefined,
          } : undefined,
        });
      } catch (error) {
        console.error("Error generating response:", error);
        throw error;
      }
    },
  });

  const generateSuggestionMutation = useMutation({
    mutationFn: async () => {
      try {
        return await backend.ai.generateSuggestion({
          conversationHistory: messagesData?.messages.map(m => ({
            role: m.role,
            content: m.content,
          })) || [],
          context: conversation ? {
            leadName: conversation.leadName,
            conversationLocation: conversation.conversationLocation,
            projectName: projectData?.name,
            projectData: projectData ? {
              companyName: projectData.companyName,
              productServiceName: projectData.productServiceName,
              idealClientProfile: projectData.idealClientProfile,
              productServiceDescription: projectData.productServiceDescription,
              segment: projectData.segment,
              problemSolved: projectData.problemSolved,
              valueProposition: projectData.valueProposition,
              competitiveAdvantages: projectData.competitiveAdvantages,
              expectedObjections: projectData.expectedObjections,
            } : undefined,
          } : undefined,
        });
      } catch (error) {
        console.error("Error generating suggestion:", error);
        throw error;
      }
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesData?.messages]);

  // Generate initial AI response if no messages exist
  useEffect(() => {
    if (conversation && messagesData?.messages.length === 0 && !isGenerating) {
      setIsGenerating(true);
      generateResponseMutation.mutate(
        [{ role: "user", content: "Olá, gostaria de iniciar uma conversa sobre nossos serviços." }],
        {
          onSuccess: (response) => {
            addMessageMutation.mutate({
              role: "assistant",
              content: response.content,
            });
            setIsGenerating(false);
          },
          onError: (error) => {
            console.error("Error generating initial response:", error);
            toast({
              title: "Erro",
              description: "Não foi possível gerar a resposta inicial da IA.",
              variant: "destructive",
            });
            setIsGenerating(false);
          },
        }
      );
    }
  }, [conversation, messagesData?.messages.length]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");

    try {
      // Add user message
      await addMessageMutation.mutateAsync({
        role: "user",
        content: userMessage,
      });

      // Generate AI response
      const allMessages = [
        ...(messagesData?.messages || []),
        { role: "user" as const, content: userMessage },
      ];

      const response = await generateResponseMutation.mutateAsync(
        allMessages.map(m => ({ role: m.role, content: m.content }))
      );

      await addMessageMutation.mutateAsync({
        role: "assistant",
        content: response.content,
      });
    } catch (error) {
      console.error("Error in message flow:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar a mensagem.",
        variant: "destructive",
      });
    }
  };

  const handleGetSuggestion = async () => {
    try {
      const response = await generateSuggestionMutation.mutateAsync();
      setMessage(response.suggestion);
    } catch (error) {
      console.error("Error generating suggestion:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar uma sugestão.",
        variant: "destructive",
      });
    }
  };

  if (conversationsError || messagesError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">Erro ao carregar a conversa.</p>
        <Button onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300">Conversa não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Conversation Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Conversa com {conversation.leadName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Local:</span> {conversation.conversationLocation}
            </div>
            {conversation.leadEmail && (
              <div>
                <span className="font-medium">Email:</span> {conversation.leadEmail}
              </div>
            )}
            {projectData && (
              <>
                <div>
                  <span className="font-medium">Projeto:</span> {projectData.name}
                </div>
                {projectData.companyName && (
                  <div>
                    <span className="font-medium">Empresa:</span> {projectData.companyName}
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="h-96">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isGenerating && messagesData?.messages.length === 0 && (
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <Bot className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-xs">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-300"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Gerando resposta...</span>
                  </div>
                </div>
              </div>
            )}

            {messagesData?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    msg.role === "user"
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-blue-100 dark:bg-blue-900"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4 text-green-600 dark:text-green-300" />
                  ) : (
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
                    msg.role === "user"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {(generateResponseMutation.isPending || addMessageMutation.isPending) && (
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <Bot className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-xs">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-300"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Gerando resposta...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <div className="flex gap-2">
              <Textarea
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 min-h-[60px] resize-none"
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || addMessageMutation.isPending}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleGetSuggestion}
                  disabled={generateSuggestionMutation.isPending}
                  variant="outline"
                  size="icon"
                  title="Solicitar Sugestão da IA"
                >
                  <Lightbulb className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ConversationChat;
