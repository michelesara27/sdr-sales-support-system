import React, { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

const Admin = () => {
  const { executeQuery } = useDatabase();
  const [companySettings, setCompanySettings] = useState({
    name: '',
    settings: {}
  });
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    fetchCompanySettings();
    fetchCollaborators();
  }, [executeQuery]);

  const fetchCompanySettings = () => {
    const result = executeQuery("SELECT * FROM company_settings LIMIT 1");
    if (result && result[0] && result[0].values[0]) {
      const row = result[0].values[0];
      setCompanySettings({
        name: row[1],
        settings: JSON.parse(row[2] || '{}')
      });
    }
  };

  const fetchCollaborators = () => {
    const result = executeQuery("SELECT * FROM collaborators ORDER BY created_at DESC");
    if (result && result[0]) {
      setCollaborators(result[0].values.map(row => ({
        id: row[0],
        name: row[1],
        email: row[2],
        created_at: row[3]
      })));
    }
  };

  const handleAddCollaborator = () => {
    if (newCollaborator.name && newCollaborator.email) {
      executeQuery(
        "INSERT INTO collaborators (name, email) VALUES (?, ?)",
        [newCollaborator.name, newCollaborator.email]
      );
      setNewCollaborator({ name: '', email: '' });
      fetchCollaborators();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Administração</h1>

      {/* Configurações da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome da Empresa</label>
            <Input
              value={companySettings.name}
              onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
              placeholder="Nome da sua empresa"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      {/* Colaboradores */}
      <Card>
        <CardHeader>
          <CardTitle>Colaboradores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input
                  value={newCollaborator.name}
                  onChange={(e) => setNewCollaborator({...newCollaborator, name: e.target.value})}
                  placeholder="Nome do colaborador"
                />
              </div>
              <div>
                <label className="text-sm font-medium">E-mail</label>
                <Input
                  type="email"
                  value={newCollaborator.email}
                  onChange={(e) => setNewCollaborator({...newCollaborator, email: e.target.value})}
                  placeholder="email@empresa.com"
                />
              </div>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddCollaborator}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Colaborador
            </Button>

            <div className="mt-6 space-y-3">
              {collaborators.map(collaborator => (
                <div key={collaborator.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{collaborator.name}</h3>
                    <p className="text-sm text-gray-600">{collaborator.email}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
