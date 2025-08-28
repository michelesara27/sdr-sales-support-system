import React, { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';

const Dashboard = () => {
  const { executeQuery } = useDatabase();
  const [stats, setStats] = useState({
    activeProjects: 0,
    openConversations: 0,
    recentProjects: []
  });

  useEffect(() => {
    const fetchStats = () => {
      try {
        // Projetos ativos
        const projectsResult = executeQuery("SELECT COUNT(*) as count FROM projects");
        const activeProjects = projectsResult ? projectsResult[0]?.values[0][0] : 0;

        // Conversações abertas
        const convResult = executeQuery("SELECT COUNT(*) as count FROM conversations");
        const openConversations = convResult ? convResult[0]?.values[0][0] : 0;

        // Projetos recentes
        const recentResult = executeQuery("SELECT * FROM projects ORDER BY created_at DESC LIMIT 3");
        const recentProjects = recentResult ? recentResult[0]?.values.map(row => ({
          id: row[0],
          name: row[1],
          description: row[2]
        })) : [];

        setStats({
          activeProjects,
          openConversations,
          recentProjects
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        // Define valores padrão em caso de erro
        setStats({
          activeProjects: 0,
          openConversations: 0,
          recentProjects: []
        });
      }
    };

    fetchStats();
  }, [executeQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-2">Projetos Ativos</h2>
          <p className="text-2xl font-bold">{stats.activeProjects}</p>
          <p className="text-sm text-muted-foreground">Total de projetos no sistema</p>
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-2">Conversações</h2>
          <p className="text-2xl font-bold">{stats.openConversations}</p>
          <p className="text-sm text-muted-foreground">Conversas em andamento</p>
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-2">Performance</h2>
          <p className="text-2xl font-bold">+12.5%</p>
          <p className="text-sm text-muted-foreground">Crescimento mensal</p>
        </div>
      </div>

      {/* Projetos Recentes */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Projetos Recentes</h2>
        <div className="space-y-4">
          {stats.recentProjects.length > 0 ? (
            stats.recentProjects.map(project => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">Nenhum projeto encontrado</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
