import { api } from "encore.dev/api";

export interface GenerateSuggestionRequest {
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  context?: {
    leadName: string;
    conversationLocation: string;
    projectName?: string;
    projectData?: {
      companyName?: string;
      productServiceName?: string;
      idealClientProfile?: string;
      productServiceDescription?: string;
      segment?: string;
      problemSolved?: string;
      valueProposition?: string;
      competitiveAdvantages?: string;
      expectedObjections?: string;
    };
  };
}

export interface GenerateSuggestionResponse {
  suggestion: string;
}

// Generates a suggestion for the next message in the conversation.
export const generateSuggestion = api<GenerateSuggestionRequest, GenerateSuggestionResponse>(
  { expose: true, method: "POST", path: "/ai/suggest" },
  async (req) => {
    const suggestions = [
      "Obrigado pelo seu interesse! Gostaria de agendar uma conversa rápida para entender melhor suas necessidades?",
      "Que tal marcarmos uma demonstração para você ver nossa solução em ação?",
      "Posso enviar mais informações sobre como podemos ajudar sua empresa?",
      "Você gostaria de conhecer alguns casos de sucesso de clientes similares?",
      "Qual seria o melhor horário para conversarmos com mais detalhes?",
      "Tem alguma dúvida específica que posso esclarecer agora?",
    ];

    // Select suggestion based on conversation length
    const historyLength = req.conversationHistory.length;
    const suggestionIndex = historyLength % suggestions.length;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return { suggestion: suggestions[suggestionIndex] };
  }
);
