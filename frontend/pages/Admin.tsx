import { Settings, Users, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Admin() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Administração</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Configurações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input
                id="company-name"
                placeholder="Digite o nome da empresa"
                defaultValue="Minha Empresa"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">Email Corporativo</Label>
              <Input
                id="company-email"
                type="email"
                placeholder="contato@empresa.com"
                defaultValue="contato@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone">Telefone</Label>
              <Input
                id="company-phone"
                placeholder="(11) 99999-9999"
                defaultValue="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                placeholder="https://empresa.com"
                defaultValue="https://empresa.com"
              />
            </div>
            <Button className="w-full">Salvar Configurações</Button>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Colaboradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Sample team members */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">João Silva</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">SDR Senior</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">joao@empresa.com</p>
                </div>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Maria Santos</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">SDR</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">maria@empresa.com</p>
                </div>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Pedro Costa</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Gerente de Vendas</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">pedro@empresa.com</p>
                </div>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>

              <Button variant="outline" className="w-full">
                Adicionar Colaborador
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Integrações</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Assistente IA Interno</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Sistema de IA integrado para conversas</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">Ativo</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Preferências</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Notificações por Email</Label>
                    <input
                      type="checkbox"
                      id="notifications"
                      className="rounded"
                      defaultChecked
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-save">Salvamento Automático</Label>
                    <input
                      type="checkbox"
                      id="auto-save"
                      className="rounded"
                      defaultChecked
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Tema Escuro</Label>
                    <input
                      type="checkbox"
                      id="dark-mode"
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Admin;
