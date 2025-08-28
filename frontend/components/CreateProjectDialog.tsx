import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    productServiceName: "",
    companyName: "",
    idealClientProfile: "",
    productServiceDescription: "",
    segment: "",
    problemSolved: "",
    valueProposition: "",
    competitiveAdvantages: "",
    expectedObjections: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      try {
        return await backend.project.create({
          name: data.name,
          description: data.description || undefined,
          productServiceName: data.productServiceName || undefined,
          companyName: data.companyName || undefined,
          idealClientProfile: data.idealClientProfile || undefined,
          productServiceDescription: data.productServiceDescription || undefined,
          segment: data.segment || undefined,
          problemSolved: data.problemSolved || undefined,
          valueProposition: data.valueProposition || undefined,
          competitiveAdvantages: data.competitiveAdvantages || undefined,
          expectedObjections: data.expectedObjections || undefined,
        });
      } catch (error) {
        console.error("Error creating project:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-stats"] });
      queryClient.invalidateQueries({ queryKey: ["recent-projects"] });
      toast({
        title: "Projeto criado",
        description: "O projeto foi criado com sucesso.",
      });
      onOpenChange(false);
      setFormData({
        name: "",
        description: "",
        productServiceName: "",
        companyName: "",
        idealClientProfile: "",
        productServiceDescription: "",
        segment: "",
        problemSolved: "",
        valueProposition: "",
        competitiveAdvantages: "",
        expectedObjections: "",
      });
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o projeto.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    createProjectMutation.mutate({
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      productServiceName: formData.productServiceName.trim(),
      companyName: formData.companyName.trim(),
      idealClientProfile: formData.idealClientProfile.trim(),
      productServiceDescription: formData.productServiceDescription.trim(),
      segment: formData.segment.trim(),
      problemSolved: formData.problemSolved.trim(),
      valueProposition: formData.valueProposition.trim(),
      competitiveAdvantages: formData.competitiveAdvantages.trim(),
      expectedObjections: formData.expectedObjections.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Projeto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Digite o nome do projeto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Digite o nome da empresa"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productServiceName">Nome do Produto/Serviço</Label>
                <Input
                  id="productServiceName"
                  value={formData.productServiceName}
                  onChange={(e) => handleInputChange("productServiceName", e.target.value)}
                  placeholder="Digite o nome do produto/serviço"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="segment">Segmento</Label>
                <Input
                  id="segment"
                  value={formData.segment}
                  onChange={(e) => handleInputChange("segment", e.target.value)}
                  placeholder="Ex: Tecnologia, Saúde, Educação"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Projeto</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva o projeto (opcional)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productServiceDescription">Descrição do Produto/Serviço</Label>
              <Textarea
                id="productServiceDescription"
                value={formData.productServiceDescription}
                onChange={(e) => handleInputChange("productServiceDescription", e.target.value)}
                placeholder="Descreva detalhadamente o produto ou serviço"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idealClientProfile">Perfil Ideal de Cliente</Label>
              <Textarea
                id="idealClientProfile"
                value={formData.idealClientProfile}
                onChange={(e) => handleInputChange("idealClientProfile", e.target.value)}
                placeholder="Descreva o perfil do cliente ideal (cargo, empresa, necessidades, etc.)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemSolved">Problema que Resolve</Label>
              <Textarea
                id="problemSolved"
                value={formData.problemSolved}
                onChange={(e) => handleInputChange("problemSolved", e.target.value)}
                placeholder="Qual problema principal seu produto/serviço resolve?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valueProposition">Proposta de Valor</Label>
              <Textarea
                id="valueProposition"
                value={formData.valueProposition}
                onChange={(e) => handleInputChange("valueProposition", e.target.value)}
                placeholder="Qual é a proposta de valor única do seu produto/serviço?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competitiveAdvantages">Diferenciais Competitivos</Label>
              <Textarea
                id="competitiveAdvantages"
                value={formData.competitiveAdvantages}
                onChange={(e) => handleInputChange("competitiveAdvantages", e.target.value)}
                placeholder="Quais são os principais diferenciais em relação à concorrência?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedObjections">Objeções Esperadas</Label>
              <Textarea
                id="expectedObjections"
                value={formData.expectedObjections}
                onChange={(e) => handleInputChange("expectedObjections", e.target.value)}
                placeholder="Quais objeções os clientes costumam ter? Como respondê-las?"
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!formData.name.trim() || createProjectMutation.isPending}
              >
                {createProjectMutation.isPending ? "Criando..." : "Criar Projeto"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProjectDialog;
