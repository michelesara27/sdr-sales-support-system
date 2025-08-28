// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Interface para o objeto retornado pelo Supabase
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          product_service: string;
          main_features: string;
          company_name: string;
          target_audience: string;
          segment: string;
          problems_solved: string;
          value_propositions: string;
          competitive_advantages: string;
          expected_objections: string;
          response_strategies: string;
          status: "active" | "completed" | "planned";
          created_at: string;
        };
        Insert: {
          id?: string;
          product_service: string;
          main_features?: string;
          company_name?: string;
          target_audience?: string;
          segment?: string;
          problems_solved?: string;
          value_propositions?: string;
          competitive_advantages?: string;
          expected_objections?: string;
          response_strategies?: string;
          status?: "active" | "completed" | "planned";
          created_at?: string;
        };
        Update: {
          id?: string;
          product_service?: string;
          main_features?: string;
          company_name?: string;
          target_audience?: string;
          segment?: string;
          problems_solved?: string;
          value_propositions?: string;
          competitive_advantages?: string;
          expected_objections?: string;
          response_strategies?: string;
          status?: "active" | "completed" | "planned";
          created_at?: string;
        };
      };
    };
  };
}

// Configuração do Supabase - use suas próprias credenciais
// Em ambiente de desenvolvimento, você pode usar valores padrão
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

// Verificar se as variáveis de ambiente estão configuradas
if (
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_ANON_KEY
) {
  console.warn(
    "Variáveis de ambiente do Supabase não configuradas. " +
      "O aplicativo funcionará, mas não se conectará ao banco de dados real. " +
      "Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env"
  );
}

// Criar e exportar o cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Funções auxiliares para operações com projetos
export const projectsApi = {
  // Buscar todos os projetos
  fetchAll: async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Criar um novo projeto
  create: async (
    project: Database["public"]["Tables"]["projects"]["Insert"]
  ) => {
    const { data, error } = await supabase
      .from("projects")
      .insert([project])
      .select();

    if (error) throw error;
    return data?.[0];
  },

  // Excluir um projeto
  delete: async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) throw error;
  },
};
