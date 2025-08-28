import { api } from "encore.dev/api";

export interface GenerateResponseRequest {
  messages: Array<{
    role: "user" | "assistant" | "system";
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

export interface GenerateResponseResponse {
  content: string;
}

// Generates an AI response using a mock implementation.
export const generateResponse = api<GenerateResponseRequest, GenerateResponseResponse>(
  { expose: true, method: "POST", path: "/ai/generate" },
  async (req) => {
    // Mock AI response based on context
    let response = "Olá! Obrigado pelo seu interesse. ";

    if (req.context?.projectData?.companyName) {
      response += `Vejo que você está interessado em soluções para ${req.context.projectData.companyName}. `;
    }

    if (req.context?.projectData?.valueProposition) {
      response += `Nossa proposta de valor é: ${req.context.projectData.valueProposition}. `;
    }

    if (req.context?.projectData?.problemSolved) {
      response += `Ajudamos a resolver: ${req.context.projectData.problemSolved}. `;
    }

    response += "Gostaria de agendar uma conversa para entender melhor suas necessidades específicas?";

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { content: response };
  }
);
