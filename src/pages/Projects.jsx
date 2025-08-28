// src/pages/Projects.jsx
import React, { useState, useEffect } from "react";
import { useDatabase } from "../contexts/DatabaseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, X, Save, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

const Projects = () => {
  const { executeQuery } = useDatabase();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_service: "",
    main_features: "",
    company_name: "",
    target_audience: "",
    segment: "",
    problems_solved: "",
    value_propositions: "",
    competitive_advantages: "",
    expected_objections: "",
    response_strategies: "",
  });

  useEffect(() => {
    fetchProjects();
  }, [executeQuery]);

  const fetchProjects = () => {
    // Primeiro tenta buscar do Supabase
    fetchProjectsFromSupabase();

    // Também busca do SQLite local como fallback
    const result = executeQuery(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );
    if (result && result[0]) {
      setProjects((prev) => {
        const sqliteProjects = result[0].values.map((row) => ({
          id: row[0],
          name: row[1],
          description: row[2],
          created_at: row[3],
        }));

        // Combinar projetos do Supabase e SQLite, removendo duplicatas
        return [...prev, ...sqliteProjects].filter(
          (project, index, self) =>
            index === self.findIndex((p) => p.id === project.id)
        );
      });
    }
  };

  const fetchProjectsFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar projetos do Supabase:", error);
        return;
      }

      if (data) {
        const supabaseProjects = data.map((project) => ({
          id: project.id,
          name: project.product_service || project.name,
          description: project.value_propositions || project.description,
          created_at: project.created_at,
          ...project,
        }));

        setProjects((prev) => {
          // Combinar projetos do Supabase e SQLite, removendo duplicatas
          return [...supabaseProjects, ...prev].filter(
            (project, index, self) =>
              index === self.findIndex((p) => p.id === project.id)
          );
        });
      }
    } catch (error) {
      console.error("Erro ao conectar com Supabase:", error);
    }
  };

  const handleCreateProject = async () => {
    if (!formData.product_service.trim()) {
      alert("O campo Produto/Serviço é obrigatório!");
      return;
    }

    setLoading(true);

    try {
      // Primeiro tenta salvar no Supabase
      const { data, error } = await supabase
        .from("projects")
        .insert([formData])
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const newProject = data[0];
        setProjects((prev) => [
          {
            id: newProject.id,
            name: newProject.product_service,
            description: newProject.value_propositions,
            created_at: newProject.created_at,
            ...newProject,
          },
          ...prev,
        ]);

        // Também salva localmente no SQLite como fallback
        try {
          executeQuery(
            `INSERT INTO projects (id, name, description, created_at) 
             VALUES (?, ?, ?, ?)`,
            [
              newProject.id,
              newProject.product_service,
              newProject.value_propositions,
              newProject.created_at,
            ]
          );
        } catch (sqlError) {
          console.warn("Não foi possível salvar no banco local:", sqlError);
        }
      }

      // Fechar modal e limpar formulário
      setIsNewProjectModalOpen(false);
      setFormData({
        product_service: "",
        main_features: "",
        company_name: "",
        target_audience: "",
        segment: "",
        problems_solved: "",
        value_propositions: "",
        competitive_advantages: "",
        expected_objections: "",
        response_strategies: "",
      });
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      alert("Erro ao criar projeto. Verifique o console para mais detalhes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Tem certeza que deseja excluir este projeto?")) {
      return;
    }

    try {
      // Tenta excluir do Supabase
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) {
        throw error;
      }

      // Excluir localmente também
      try {
        executeQuery("DELETE FROM projects WHERE id = ?", [projectId]);
      } catch (sqlError) {
        console.warn("Não foi possível excluir do banco local:", sqlError);
      }

      // Atualizar lista de projetos
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
      alert("Erro ao excluir projeto. Verifique o console para mais detalhes.");
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsNewProjectModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar Projetos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {new Date(project.created_at).toLocaleDateString("pt-BR")}
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Novo Projeto */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Cadastrar Novo Projeto
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsNewProjectModalOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Produto/Serviço *
                  </label>
                  <Input
                    value={formData.product_service}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        product_service: e.target.value,
                      })
                    }
                    placeholder="Nome do produto ou serviço"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Empresa
                  </label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData({ ...formData, company_name: e.target.value })
                    }
                    placeholder="Nome da empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segmento
                  </label>
                  <Input
                    value={formData.segment}
                    onChange={(e) =>
                      setFormData({ ...formData, segment: e.target.value })
                    }
                    placeholder="Segmento de atuação"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Público-Alvo Ideal (ICP)
                  </label>
                  <Input
                    value={formData.target_audience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        target_audience: e.target.value,
                      })
                    }
                    placeholder="Público-alvo ideal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funcionalidades Principais
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={formData.main_features}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        main_features: e.target.value,
                      })
                    }
                    placeholder="Liste as funcionalidades principais"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Problemas que o Produto Resolve
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={formData.problems_solved}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        problems_solved: e.target.value,
                      })
                    }
                    placeholder="Quais problemas seu produto/serviço resolve?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Propostas de Valor
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={formData.value_propositions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        value_propositions: e.target.value,
                      })
                    }
                    placeholder="Quais são as propostas de valor principais?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diferenciais Competitivos
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={formData.competitive_advantages}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        competitive_advantages: e.target.value,
                      })
                    }
                    placeholder="O que diferencia seu produto da concorrência?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Objeções Esperadas
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={formData.expected_objections}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expected_objections: e.target.value,
                      })
                    }
                    placeholder="Quais objeções você espera dos clientes?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estratégias de Resposta
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={formData.response_strategies}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        response_strategies: e.target.value,
                      })
                    }
                    placeholder="Como você responderá a essas objeções?"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleCreateProject}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Criar Projeto
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
