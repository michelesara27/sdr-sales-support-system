import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import backend from "~backend/client";
import CreateConversationDialog from "../components/CreateConversationDialog";

function Conversations() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: conversationsData, isLoading, error } = useQuery({
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Conversações</h1>
          <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Conversa
          </Button>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <div className="text-red-400 mb-4">
              <MessageSquare className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Erro ao carregar conversas
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Não foi possível conectar com o servidor. Verifique sua conexão e tente novamente.
            </p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>

        <CreateConversationDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Conversações</h1>
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Conversa
        </Button>
      </div>

      {/* Conversations List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : conversationsData?.conversations.length ? (
        <div className="space-y-4">
          {conversationsData.conversations.map((conversation) => (
            <Card key={conversation.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {conversation.leadName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Local:</span> {conversation.conversationLocation}
                  </p>
                  {conversation.leadEmail && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Email:</span> {conversation.leadEmail}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Iniciada em {new Date(conversation.createdAt).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(conversation.createdAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="mt-4">
                  <Link to={`/conversations/${conversation.id}`}>
                    <Button variant="outline" size="sm">
                      Continuar Conversa
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <MessageSquare className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma conversa encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Comece criando sua primeira conversa com um lead
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              Iniciar Conversa
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateConversationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}

export default Conversations;
