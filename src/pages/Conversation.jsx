import React, { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles } from 'lucide-react';

const Conversation = () => {
  const { executeQuery } = useDatabase();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [conversation, setConversation] = useState({
    leadName: '',
    leadEmail: '',
    location: ''
  });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [executeQuery]);

  const fetchProjects = () => {
    const result = executeQuery("SELECT * FROM projects");
    if (result && result[0]) {
      setProjects(result[0].values.map(row => ({
        id: row[0],
        name: row[1]
      })));
    }
  };

  const handleStartConversation = () => {
    // Lógica para iniciar conversa
    const aiResponse = "Olá! Sou o assistente virtual da empresa. Como posso ajudar você hoje?";
    setMessages([{ content: aiResponse, isAI: true }]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Adicionar mensagem do usuário
      setMessages(prev => [...prev, { content: newMessage, isAI: false }]);
      
      // Simular resposta da IA
      setTimeout(() => {
        const aiResponses = [
          "Entendi sua solicitação. Posso ajudar com mais alguma coisa?",
          "Excelente pergunta! Deixe-me verificar isso para você.",
          "Obrigado pelo contato. Como posso auxiliar melhor?",
          "Compreendo sua necessidade. Vou direcionar para o time especializado."
        ];
        const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        setMessages(prev => [...prev, { content: response, isAI: true }]);
      }, 1000);

      setNewMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Conversação</h1>

      {/* Formulário de início */}
      <Card>
        <CardHeader>
          <CardTitle>Iniciar Nova Conversa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Projeto</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">Selecione um projeto</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Local da Conversa</label>
              <Input
                placeholder="Ex: LinkedIn, Email, WhatsApp"
                value={conversation.location}
                onChange={(e) => setConversation({...conversation, location: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome do Lead *</label>
              <Input
                placeholder="Nome completo"
                value={conversation.leadName}
                onChange={(e) => setConversation({...conversation, leadName: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">E-mail do Lead</label>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={conversation.leadEmail}
                onChange={(e) => setConversation({...conversation, leadEmail: e.target.value})}
              />
            </div>
          </div>

          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleStartConversation}
            disabled={!conversation.leadName || !conversation.location}
          >
            Iniciar Conversa
          </Button>
        </CardContent>
      </Card>

      {/* Área de conversação */}
      {messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conversa com {conversation.leadName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md p-4 rounded-lg ${
                      message.isAI
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <Textarea
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSendMessage}
              >
                <Send className="w-4 h-4" />
              </Button>
              <Button variant="outline">
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Conversation;
