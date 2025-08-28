import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { Project } from "~backend/project/create";

interface EditProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditProjectDialog({ project, open, onOpenChange }: EditProjectDialogProps) {
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

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        productServiceName: project.productServiceName || "",
        companyName: project.companyName || "",
        idealClientProfile: project.idealClientProfile || "",
        productServiceDescription: project.productServiceDescription || "",
        segment: project.segment || "",
        problemSolved: project.problemSolved || "",
        valueProposition: project.valueProposition || "",
        competitiveAdvantages: project.competitiveAdvantages || "",
        expectedObjections: project.expectedObjections || "",
      });
    }
  }, [project]);

  const updateProjectMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      try {
        return await backend.project.update({
          id: project.id,
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
        console.error("Error updating project:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["recent-projects"] });
      toast({
        title: "Projeto atualizado",
        description: "O projeto foi atualizado com sucesso.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o projeto.",
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

    updateProjectMutation.mutate({
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
          <DialogTitle>Editar Projeto</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome do Projeto *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Digite o nome do projeto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-companyName">Nome da Empresa</Label>
                <Input
                  id="edit-companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Digite o nome da empresa"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-productServiceName">Nome do Produto/Serviço</Label>
                <Input
                  id="edit-productServiceName"
                  value={formData.productServiceName}
                  onChange={(e) => handleInputChange("productServiceName", e.target.value)}
                  placeholder="Digite o nome do produto/serviço"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-segment">Segmento</Label>
                <Input
                  id="edit-segment"
                  value={formData.segment}
                  onChange={(e) => handleInputChange("segment", e.target.value)}
                  placeholder="Ex: Tecnologia, Saúde, Educação"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição do Projeto</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva o projeto (opcional)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-productServiceDescription">Descrição do Produto/Serviço</Label>
              <Textarea
                id="edit-productServiceDescription"
                value={formData.productServiceDescription}
                onChange={(e) => handleInputChange("productServiceDescription", e.target.value)}
                placeholder="Descreva detalhadamente o produto ou serviço"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-idealClientProfile">Perfil Ideal de Cliente</Label>
              <Textarea
                id="edit-idealClientProfile"
                value={formData.idealClientProfile}
                onChange={(e) => handleInputChange("idealClientProfile", e.target.value)}
                placeholder="Descreva o perfil do cliente ideal (cargo, empresa, necessidades, etc.)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-problemSolved">Problema que Resolve</Label>
              <Textarea
                id="edit-problemSolved"
                value={formData.problemSolved}
                onChange={(e) => handleInputChange("problemSolved", e.target.value)}
                placeholder="Qual problema principal seu produto/serviço resolve?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-valueProposition">Proposta de Valor</Label>
              <Textarea
                id="edit-valueProposition"
                value={formData.valueProposition}
                onChange={(e) => handleInputChange("valueProposition", e.target.value)}
                placeholder="Qual é a proposta de valor única do seu produto/serviço?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-competitiveAdvantages">Diferenciais Competitivos</Label>
              <Textarea
                id="edit-competitiveAdvantages"
                value={formData.competitiveAdvantages}
                onChange={(e) => handleInputChange("competitiveAdvantages", e.target.value)}
                placeholder="Quais são os principais diferenciais em relação à concorrência?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-expectedObjections">Objeções Esperadas</Label>
              <Textarea
                id="edit-expectedObjections"
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
                disabled={!formData.name.trim() || updateProjectMutation.isPending}
              >
                {updateProjectMutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default EditProjectDialog;
