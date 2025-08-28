// src/components/ProjectDashboard.tsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Folder,
  FolderOpen,
  X,
} from "lucide-react";
import { supabase, projectsApi, Database } from "../lib/supabase";

// Definir o tipo Project baseado na definição do Supabase
type Project = Database["public"]["Tables"]["projects"]["Row"];

const Projects: React.FC = () => {
  // Estado para armazenar a lista de projetos
  const [projects, setProjects] = useState<Project[]>([]);
  // Estado para controlar o termo de pesquisa
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para controlar se o modal de novo projeto está aberto
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  // Estado para o novo projeto sendo criado
  const [newProject, setNewProject] = useState<Partial<Project>>({
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
    status: "planned",
  });
  // Estado para carregamento
  const [loading, setLoading] = useState(false);
  // Estado para mensagens de erro
  const [error, setError] = useState<string | null>(null);

  // Carregar projetos do Supabase
  useEffect(() => {
    fetchProjects();
  }, []);

  // Função para buscar projetos do Supabase
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsApi.fetchAll();
      setProjects(data || []);
    } catch (err) {
      console.error("Erro ao carregar projetos:", err);
      setError(
        "Erro ao carregar projetos. Verifique o console para mais detalhes."
      );

      // Dados mock para desenvolvimento quando o Supabase não está disponível
      if (
        !import.meta.env.VITE_SUPABASE_URL ||
        !import.meta.env.VITE_SUPABASE_ANON_KEY
      ) {
        console.log("Usando dados mock para desenvolvimento");
        setProjects([
          {
            id: "1",
            product_service: "Site Corporativo",
            main_features: "Design responsivo, CMS integrado, Blog",
            company_name: "ABC Tecnologia",
            target_audience: "Empresas de médio porte",
            segment: "Tecnologia",
            problems_solved:
              "Baixa visibilidade online, falta de presença digital",
            value_propositions:
              "Aumento de visibilidade e leads através de um site profissional",
            competitive_advantages:
              "Design exclusivo, suporte 24/7, preços competitivos",
            expected_objections: "Custo muito alto, não preciso de site agora",
            response_strategies:
              "Mostrar ROI, cases de sucesso, planos de pagamento",
            status: "active",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            product_service: "App Mobile",
            main_features: "Login social, notificações push, offline mode",
            company_name: "XYZ Startup",
            target_audience: "Jovens entre 18-30 anos",
            segment: "Entretenimento",
            problems_solved: "Falta de engajamento com o público jovem",
            value_propositions:
              "App divertido e viciante para aumentar o tempo de uso",
            competitive_advantages:
              "Algoritmo exclusivo, interface intuitiva, sem anúncios",
            expected_objections: "Já tenho muitos apps, não preciso de outro",
            response_strategies:
              "Destaque os diferenciais, ofereça teste gratuito",
            status: "planned",
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrar projetos com base no termo de pesquisa
  const filteredProjects = projects.filter(
    (project) =>
      project.product_service
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      project.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.segment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para criar um novo projeto
  const handleCreateProject = async () => {
    if (!newProject.product_service?.trim()) {
      setError("O campo Produto/Serviço é obrigatório");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const projectData = {
        product_service: newProject.product_service || "",
        main_features: newProject.main_features || "",
        company_name: newProject.company_name || "",
        target_audience: newProject.target_audience || "",
        segment: newProject.segment || "",
        problems_solved: newProject.problems_solved || "",
        value_propositions: newProject.value_propositions || "",
        competitive_advantages: newProject.competitive_advantages || "",
        expected_objections: newProject.expected_objections || "",
        response_strategies: newProject.response_strategies || "",
        status: newProject.status || "planned",
      };

      // Verificar se estamos conectados ao Supabase
      if (
        import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_ANON_KEY
      ) {
        const createdProject = await projectsApi.create(projectData);
        setProjects([createdProject, ...projects]);
      } else {
        // Modo offline - adicionar localmente
        const mockProject: Project = {
          ...projectData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        setProjects([mockProject, ...projects]);
      }

      // Resetar formulário
      setNewProject({
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
        status: "planned",
      });
      setIsNewProjectModalOpen(false);
    } catch (err) {
      console.error("Erro ao criar projeto:", err);
      setError(
        "Erro ao criar projeto. Verifique o console para mais detalhes."
      );
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir um projeto
  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este projeto?")) {
      return;
    }

    try {
      setError(null);

      // Verificar se estamos conectados ao Supabase
      if (
        import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_ANON_KEY
      ) {
        await projectsApi.delete(id);
      }

      // Remover da lista local em qualquer caso
      setProjects(projects.filter((project) => project.id !== id));
    } catch (err) {
      console.error("Erro ao excluir projeto:", err);
      setError(
        "Erro ao excluir projeto. Verifique o console para mais detalhes."
      );
    }
  };

  // Função para obter ícone com base no status
  const getStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return <FolderOpen className="text-blue-500" size={20} />;
      case "completed":
        return <Folder className="text-green-500" size={20} />;
      case "planned":
        return <Folder className="text-gray-500" size={20} />;
      default:
        return <Folder className="text-gray-500" size={20} />;
    }
  };

  // Função para obter classe de cor com base no status
  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "planned":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard de Projetos
          </h1>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            disabled={loading}
          >
            <Plus size={20} className="mr-2" />
            Novo Projeto
          </button>
        </div>

        {/* Exibir mensagem de erro */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 right-0 p-3"
              onClick={() => setError(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Barra de Pesquisa */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Pesquisar projetos por produto, empresa ou segmento..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de Projetos */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-500">Carregando projetos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        {getStatusIcon(project.status)}
                        <span
                          className={`ml-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status === "active"
                            ? "Em Andamento"
                            : project.status === "completed"
                            ? "Concluído"
                            : "Planejado"}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-blue-600 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          onClick={() => handleDeleteProject(project.id)}
                          disabled={loading}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {project.product_service}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Empresa:</strong> {project.company_name}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Segmento:</strong> {project.segment}
                    </p>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {project.value_propositions}
                    </p>
                    <div className="text-xs text-gray-500">
                      Criado em:{" "}
                      {new Date(project.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <Folder className="mx-auto text-gray-400" size={48} />
                <p className="mt-4 text-gray-500">
                  {searchTerm
                    ? "Nenhum projeto encontrado para sua pesquisa."
                    : "Nenhum projeto cadastrado ainda."}
                </p>
              </div>
            )}
          </div>
        )}
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
                <button
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Produto/Serviço *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newProject.product_service || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
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
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newProject.company_name || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        company_name: e.target.value,
                      })
                    }
                    placeholder="Nome da empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segmento
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newProject.segment || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, segment: e.target.value })
                    }
                    placeholder="Segmento de atuação"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Público-Alvo Ideal (ICP)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newProject.target_audience || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={newProject.main_features || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={newProject.problems_solved || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={newProject.value_propositions || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={newProject.competitive_advantages || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={newProject.expected_objections || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={newProject.response_strategies || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        response_strategies: e.target.value,
                      })
                    }
                    placeholder="Como você responderá a essas objeções?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newProject.status || "planned"}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        status: e.target.value as Project["status"],
                      })
                    }
                  >
                    <option value="planned">Planejado</option>
                    <option value="active">Em Andamento</option>
                    <option value="completed">Concluído</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg border border-gray-300"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center"
                  onClick={handleCreateProject}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    "Criar Projeto"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
