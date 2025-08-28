import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Ajuste o caminho conforme sua estrutura
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit, Copy, Clock } from "lucide-react";

const Admin = () => {
  const [companyData, setCompanyData] = useState({
    trade_name: "",
    email: "",
    phone: "",
    cnpj: "",
    address: "",
    neighborhood: "",
    zip_code: "",
    city: "",
    state: "",
    password: "",
  });
  const [collaborators, setCollaborators] = useState([]);
  const [activeInvitations, setActiveInvitations] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanyData();
    fetchCollaborators();
    fetchActiveInvitations();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("company")
        .select("*")
        .limit(1)
        .single();

      if (error) {
        console.error("Erro ao buscar dados da empresa:", error);
        return;
      }

      if (data) {
        console.log("Dados da empresa:", data);
        setCompanyData({
          trade_name: data.trade_name || "",
          email: data.email || "",
          phone: data.phone || "",
          cnpj: data.cnpj || "",
          address: data.address || "",
          neighborhood: data.neighborhood || "",
          zip_code: data.zip_code || "",
          city: data.city || "",
          state: data.state || "",
          password: data.password || "",
        });
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollaborators = async () => {
    try {
      const { data, error } = await supabase
        .from("collaborators")
        .select(
          `
          *,
          company (trade_name)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar colaboradores:", error);
        return;
      }

      if (data) {
        setCollaborators(
          data.map((collab) => ({
            id: collab.id,
            name: collab.name,
            email: collab.email,
            company_name: collab.company?.trade_name || "",
            created_at: collab.created_at,
            is_active: collab.is_active,
          }))
        );
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const fetchActiveInvitations = async () => {
    try {
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from("invitation_links")
        .select(
          `
          *,
          company (trade_name)
        `
        )
        .gt("expires_at", now)
        .eq("is_used", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar convites:", error);
        return;
      }

      if (data) {
        setActiveInvitations(data);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const generateInvitationLink = async () => {
    try {
      // Primeiro, precisamos obter o ID da empresa
      const { data: companyData, error: companyError } = await supabase
        .from("company")
        .select("id")
        .limit(1)
        .single();

      if (companyError || !companyData) {
        console.error("Erro ao obter ID da empresa:", companyError);
        alert("❌ Erro ao obter dados da empresa");
        return;
      }

      // Gerar token único
      const token =
        Math.random().toString(36).substring(2) + Date.now().toString(36);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

      // Inserir no Supabase
      const { error } = await supabase.from("invitation_links").insert([
        {
          company_id: companyData.id,
          token: token,
          expires_at: expiresAt.toISOString(),
          is_used: false,
        },
      ]);

      if (error) {
        console.error("Erro ao gerar link:", error);
        alert("❌ Erro ao gerar link de convite");
        return;
      }

      const invitationLink = `${window.location.origin}/register?token=${token}`;

      // Copiar para área de transferência
      navigator.clipboard.writeText(invitationLink);
      alert(
        "✅ Link de convite copiado! Válido por 5 minutos.\n\n" + invitationLink
      );

      fetchActiveInvitations();
    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro ao gerar link de convite");
    }
  };

  const updateCompanyData = async () => {
    try {
      if (!companyData.trade_name || !companyData.email) {
        alert("❌ Nome fantasia e e-mail são obrigatórios");
        return;
      }

      // Primeiro, precisamos obter o ID da empresa
      const { data: existingCompany, error: fetchError } = await supabase
        .from("company")
        .select("id")
        .limit(1)
        .single();

      let result;

      if (fetchError || !existingCompany) {
        // Se não existir, criar
        const { data, error } = await supabase
          .from("company")
          .insert([
            {
              trade_name: companyData.trade_name,
              email: companyData.email,
              phone: companyData.phone,
              cnpj: companyData.cnpj,
              address: companyData.address,
              neighborhood: companyData.neighborhood,
              zip_code: companyData.zip_code,
              city: companyData.city,
              state: companyData.state,
              password: companyData.password,
              updated_at: new Date().toISOString(),
            },
          ])
          .select();

        result = { data, error };
      } else {
        // Se existir, atualizar
        const { data, error } = await supabase
          .from("company")
          .update({
            trade_name: companyData.trade_name,
            email: companyData.email,
            phone: companyData.phone,
            cnpj: companyData.cnpj,
            address: companyData.address,
            neighborhood: companyData.neighborhood,
            zip_code: companyData.zip_code,
            city: companyData.city,
            state: companyData.state,
            password: companyData.password,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingCompany.id)
          .select();

        result = { data, error };
      }

      if (result.error) {
        console.error("Erro ao salvar:", result.error);
        alert("❌ Erro ao salvar dados da empresa");
        return;
      }

      alert("✅ Dados da empresa salvos com sucesso!");
      setShowEditModal(false);
    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro ao salvar dados da empresa");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("✅ Link copiado para área de transferência!");
  };

  const deleteCollaborator = async (id, name) => {
    if (confirm(`Tem certeza que deseja remover o colaborador "${name}"?`)) {
      try {
        const { error } = await supabase
          .from("collaborators")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Erro ao deletar:", error);
          alert("❌ Erro ao remover colaborador");
          return;
        }

        alert("✅ Colaborador removido com sucesso!");
        fetchCollaborators();
      } catch (error) {
        console.error("Erro:", error);
        alert("❌ Erro ao remover colaborador");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Administração</h1>

      {/* Card de Acesso Rápido */}
      <Card>
        <CardHeader>
          <CardTitle>Acesso Rápido</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowEditModal(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Dados da Empresa
          </Button>

          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={generateInvitationLink}
          >
            <Plus className="w-4 h-4 mr-2" />
            Gerar Link de Convite
          </Button>
        </CardContent>
      </Card>

      {/* Links de Convite Ativos */}
      {activeInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Links de Convite Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeInvitations.map((invitation) => {
                const link = `${window.location.origin}/register?token=${invitation.token}`;
                const expires = new Date(invitation.expires_at);
                const timeLeft = Math.max(0, expires - new Date());
                const minutesLeft = Math.floor(timeLeft / 60000);
                const secondsLeft = Math.floor((timeLeft % 60000) / 1000);

                return (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium">{link}</p>
                        <p className="text-xs text-gray-500">
                          Expira em {minutesLeft}m {secondsLeft}s •{" "}
                          {invitation.company?.trade_name}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(link)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Colaboradores */}
      <Card>
        <CardHeader>
          <CardTitle>Colaboradores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-6 space-y-3">
            {collaborators.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum colaborador cadastrado
              </p>
            ) : (
              collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{collaborator.name}</h3>
                    <p className="text-sm text-gray-600">
                      {collaborator.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {collaborator.company_name} •
                      {collaborator.is_active ? " ✅ Ativo" : " ⏳ Pendente"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      deleteCollaborator(collaborator.id, collaborator.name)
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição da Empresa */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Editar Dados da Empresa</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Nome Fantasia *</label>
                <Input
                  value={companyData.trade_name}
                  onChange={(e) =>
                    setCompanyData({
                      ...companyData,
                      trade_name: e.target.value,
                    })
                  }
                  placeholder="Nome da empresa"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">E-mail *</label>
                <Input
                  type="email"
                  value={companyData.email}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, email: e.target.value })
                  }
                  placeholder="empresa@email.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Telefone</label>
                <Input
                  value={companyData.phone}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, phone: e.target.value })
                  }
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="text-sm font-medium">CNPJ</label>
                <Input
                  value={companyData.cnpj}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, cnpj: e.target.value })
                  }
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Endereço</label>
                <Input
                  value={companyData.address}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, address: e.target.value })
                  }
                  placeholder="Rua, número"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Bairro</label>
                <Input
                  value={companyData.neighborhood}
                  onChange={(e) =>
                    setCompanyData({
                      ...companyData,
                      neighborhood: e.target.value,
                    })
                  }
                  placeholder="Bairro"
                />
              </div>

              <div>
                <label className="text-sm font-medium">CEP</label>
                <Input
                  value={companyData.zip_code}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, zip_code: e.target.value })
                  }
                  placeholder="00000-000"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Cidade</label>
                <Input
                  value={companyData.city}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, city: e.target.value })
                  }
                  placeholder="Cidade"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Estado</label>
                <Input
                  value={companyData.state}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, state: e.target.value })
                  }
                  placeholder="SP"
                  maxLength={2}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Senha</label>
                <Input
                  type="password"
                  value={companyData.password}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, password: e.target.value })
                  }
                  placeholder="Senha de acesso"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={updateCompanyData}
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
