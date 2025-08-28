import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";

interface CreateConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateConversationDialog({ open, onOpenChange }: CreateConversationDialogProps) {
  const [projectId, setProjectId] = useState<string>("");
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [conversationLocation, setConversationLocation] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        return await backend.project.list();
      } catch (error) {
        console.error("Error fetching projects:", error);
        return { projects: [] };
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  const createConversationMutation = useMutation({
    mutationFn: async (data: {
      projectId: number;
      leadName: string;
      leadEmail?: string;
      conversationLocation: string;
    }) => {
      try {
        return await backend.conversation.create(data);
      } catch (error) {
        console.error("Error creating conversation:", error);
        throw error;
      }
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation-stats"] });
      toast({
        title: "Conversa iniciada",
        description: "A conversa foi criada com sucesso.",
      });
      onOpenChange(false);
      navigate(`/conversations/${conversation.id}`);
      // Reset form
      setProjectId("");
      setLeadName("");
      setLeadEmail("");
      setConversationLocation("");
    },
    onError: (error) => {
      console.error("Error creating conversation:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a conversa.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !leadName.trim() || !conversationLocation.trim()) return;

    createConversationMutation.mutate({
      projectId: parseInt(projectId),
      leadName: leadName.trim(),
      leadEmail: leadEmail.trim() || undefined,
      conversationLocation: conversationLocation.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Iniciar Nova Conversa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">Projeto *</Label>
            <Select value={projectId} onValueChange={setProjectId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um projeto" />
              </SelectTrigger>
              <SelectContent>
                {projectsData?.projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-name">Nome do Lead *</Label>
            <Input
              id="lead-name"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              placeholder="Digite o nome do lead"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-email">Email do Lead</Label>
            <Input
              id="lead-email"
              type="email"
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              placeholder="email@exemplo.com (opcional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local da Conversa *</Label>
            <Input
              id="location"
              value={conversationLocation}
              onChange={(e) => setConversationLocation(e.target.value)}
              placeholder="Ex: LinkedIn, WhatsApp, Email, etc."
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                !projectId ||
                !leadName.trim() ||
                !conversationLocation.trim() ||
                createConversationMutation.isPending
              }
            >
              {createConversationMutation.isPending ? "Iniciando..." : "Iniciar Conversa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateConversationDialog;
