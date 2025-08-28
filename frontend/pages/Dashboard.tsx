import { useQuery } from "@tanstack/react-query";
import { Plus, FolderOpen, MessageSquare, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import backend from "~backend/client";

function Dashboard() {
  const { data: projectStats } = useQuery({
    queryKey: ["project-stats"],
    queryFn: async () => {
      try {
        return await backend.project.getStats();
      } catch (error) {
        console.error("Error fetching project stats:", error);
        return { totalProjects: 0, recentProjects: 0 };
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  const { data: conversationStats } = useQuery({
    queryKey: ["conversation-stats"],
    queryFn: async () => {
      try {
        return await backend.conversation.getStats();
      } catch (error) {
        console.error("Error fetching conversation stats:", error);
        return { openConversations: 0 };
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  const { data: recentProjects } = useQuery({
    queryKey: ["recent-projects"],
    queryFn: async () => {
      try {
        return await backend.project.list({ limit: 5 });
      } catch (error) {
        console.error("Error fetching recent projects:", error);
        return { projects: [] };
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Link to="/projects">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats?.totalProjects || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total de projetos no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversações Abertas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversationStats?.openConversations || 0}</div>
            <p className="text-xs text-muted-foreground">
              Conversas em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Recentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats?.recentProjects || 0}</div>
            <p className="text-xs text-muted-foreground">
              Criados nos últimos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Projetos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentProjects?.projects.length ? (
            <div className="space-y-3">
              {recentProjects.projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">{project.description}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Criado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Link to="/projects">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <FolderOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Nenhum projeto encontrado</p>
              <Link to="/projects">
                <Button className="mt-4">
                  Criar Primeiro Projeto
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
