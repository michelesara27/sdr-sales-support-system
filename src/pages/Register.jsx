import React, { useState, useEffect } from "react";
import { useDatabase } from "../contexts/DatabaseContext";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

const Register = () => {
  const { executeQuery } = useDatabase();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [invitationData, setInvitationData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (token) {
      validateInvitationToken();
    }
  }, [token]);

  const validateInvitationToken = () => {
    const result = executeQuery(
      `
      SELECT il.*, c.fantasy_name 
      FROM invitation_links il 
      LEFT JOIN companies c ON il.company_id = c.id 
      WHERE il.token = ? AND il.expires_at > datetime('now') AND il.is_used = 0
    `,
      [token]
    );

    if (result && result[0] && result[0].values[0]) {
      const row = result[0].values[0];
      setInvitationData({
        company_id: row[1],
        company_name: row[6],
        expires_at: row[3],
      });
    } else {
      toast.error("Link de convite inválido ou expirado");
    }
  };

  const handleRegister = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Preencha todos os campos");
      return;
    }

    // Registrar colaborador
    const result = executeQuery(
      `
      INSERT INTO collaborators (name, email, password, company_id, is_active) 
      VALUES (?, ?, ?, ?, 1)
    `,
      [
        formData.name,
        formData.email,
        formData.password,
        invitationData.company_id,
      ]
    );

    if (result) {
      // Marcar link como usado
      executeQuery("UPDATE invitation_links SET is_used = 1 WHERE token = ?", [
        token,
      ]);

      toast.success("Cadastro realizado com sucesso!");
      // Redirecionar para login
      setTimeout(() => (window.location.href = "/login"), 2000);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p>Link de convite inválido</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p>Validando link de convite...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            Bem-vindo à {invitationData.company_name}
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Você foi convidado para participar da empresa
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome Completo</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label className="text-sm font-medium">E-mail</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Senha</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Crie uma senha"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Confirmar Senha</label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Confirme sua senha"
            />
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleRegister}
          >
            Finalizar Cadastro
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
