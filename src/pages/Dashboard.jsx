import React, { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, MessageSquare, Briefcase } from 'lucide-react';

const Dashboard = () => {
  const { executeQuery } = useDatabase();
  const [stats, setStats] = useState({
    activeProjects: 0,
    openConversations: 0,
    recentProjects: []
  });

  useEffect(() => {
    const fetchStats = () => {
      // Projetos ativos
      const projectsResult = executeQuery("SELECT COUNT(*) as count FROM projects");
      const activeProjects = projectsResult && projectsResult[0] && projectsResult[0].values ? 
        projectsResult[0].values[0][0] : 0;

      // Conversações abertas
      const convResult = executeQuery("SELECT COUNT(*) as count FROM conversations");
      const openConversations = convResult && convResult[0] && convResult[0].values ? 
        convResult[0].values[0][0] : 0;

      // Projetos recentes
      const recentResult = executeQuery("SELECT * FROM projects ORDER BY created_at DESC LIMIT 3");
      let recentProjects = [];
      if (recentResult && recentResult[0] && recentResult[0].values) {
        recentProjects = recentResult[0].values.map(row => ({
          id: row[0],
          name: row[1],
          description: row[2]
        }));
      }

      setStats({
        activeProjects,
        openConversations,
        recentProjects
      });
    };

    fetchStats();
  }, [executeQuery]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">Total de projetos no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversações</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openConversations}</div>
            <p className="text-xs text-muted-foreground">Conversas em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">Crescimento mensal</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Projetos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentProjects && stats.recentProjects.length > 0 ? (
              stats.recentProjects.map(project => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum projeto recente</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
