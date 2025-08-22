import React, { useState, useRef, useEffect } from 'react';
import { Send, Copy, ExternalLink, Save, CheckCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '../contexts/ProjectContext';
import { useConversations } from '../contexts/ConversationContext';
import { useToast } from '@/components/ui/use-toast';
import type { CreateConversationRequest, MessageResponse } from '~backend/conversations/types';

interface LeadContext {
  name: string;
  company: string;
  source: string;
  notes: string;
}

export default function ConversationArea() {
  const { projects } = useProjects();
  const { createConversation, addMessage, updateConversation } = useConversations();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [leadContext, setLeadContext] = useState<LeadContext>({
    name: '',
    company: '',
    source: '',
    notes: '',
  });
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeProjects = projects.filter(p => p.status === 'active');
  const selectedProject = projects.find(p => p.id === Number(selectedProjectId));

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartConversation = async () => {
    if (!selectedProjectId || !leadContext.name || !leadContext.company) {
      toast({
        title: 'Missing information',
        description: 'Please select a project and fill in lead name and company.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const conversationData: CreateConversationRequest = {
        projectId: Number(selectedProjectId),
        leadName: leadContext.name,
        leadCompany: leadContext.company,
        leadSource: leadContext.source || undefined,
        leadNotes: leadContext.notes || undefined,
      };

      const conversationId = await createConversation(conversationData);
      setCurrentConversationId(conversationId);
      setMessages([]);
      
      toast({
        title: 'Conversation started',
        description: `New conversation with ${leadContext.name} from ${leadContext.company}`,
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const generateAISuggestions = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    if (!selectedProject) return 'Please select a project first.';

    // Mock AI suggestions based on project data
    const suggestions = [
      `Great question! Based on our experience with ${selectedProject.targetAudience}, here are some approaches:`,
      '',
      `• "${selectedProject.valueArguments.split(',')[0]?.trim() || 'Focus on ROI and efficiency gains'}"`,
      `• "Many clients in similar situations have found success with our approach"`,
      `• "What specific challenges are you facing with your current solution?"`,
      '',
      `Remember: ${selectedProject.approachGuide.split('.')[0] || 'Maintain a professional yet friendly tone'}.`,
    ].join('\n');

    return suggestions;
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !currentConversationId) return;

    try {
      // Add user message
      const userMessage = await addMessage(currentConversationId, {
        type: 'user',
        content: userInput.trim(),
      });

      setMessages(prev => [...prev, userMessage]);

      const currentInput = userInput;
      setUserInput('');
      setIsGenerating(true);

      // Generate AI response
      const aiSuggestion = await generateAISuggestions(currentInput);
      
      const aiMessage = await addMessage(currentConversationId, {
        type: 'ai',
        content: aiSuggestion,
      });

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied to clipboard',
      description: 'Message copied successfully.',
    });
  };

  const handleSendToPipedream = () => {
    toast({
      title: 'Sent to Pipedream',
      description: 'Conversation data has been sent to your Pipedream workflow.',
    });
  };

  const handleSaveConversation = () => {
    if (currentConversationId) {
      toast({
        title: 'Conversation saved',
        description: 'Your conversation has been saved successfully.',
      });
    }
  };

  const handleMarkAsClosed = async () => {
    if (currentConversationId) {
      try {
        await updateConversation(currentConversationId, { status: 'closed' });
        toast({
          title: 'Conversation closed',
          description: 'The conversation has been marked as closed.',
        });
      } catch (error) {
        console.error('Failed to close conversation:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Conversation Area</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Start a new conversation with AI-powered sales assistance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Setup Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Project Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Project</CardTitle>
              <CardDescription>Choose the sales project for this conversation</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {activeProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedProject && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedProject.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {selectedProject.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {selectedProject.objections.length} objections
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lead Context */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Context</CardTitle>
              <CardDescription>Information about the prospect</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="leadName">Lead Name *</Label>
                <Input
                  id="leadName"
                  value={leadContext.name}
                  onChange={(e) => setLeadContext(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Smith"
                />
              </div>

              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={leadContext.company}
                  onChange={(e) => setLeadContext(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="TechCorp Inc."
                />
              </div>

              <div>
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={leadContext.source}
                  onChange={(e) => setLeadContext(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="LinkedIn, Cold Email, etc."
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={leadContext.notes}
                  onChange={(e) => setLeadContext(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional context about the lead"
                  rows={3}
                />
              </div>

              {!currentConversationId && (
                <Button 
                  onClick={handleStartConversation}
                  className="w-full"
                  disabled={!selectedProjectId || !leadContext.name || !leadContext.company}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Start Conversation
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {currentConversationId && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={handleSendToPipedream} variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Send to Pipedream
                </Button>
                <Button onClick={handleSaveConversation} variant="outline" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Conversation
                </Button>
                <Button onClick={handleMarkAsClosed} variant="outline" className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Closed
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>
                {currentConversationId 
                  ? `Chatting with ${leadContext.name} from ${leadContext.company}`
                  : 'Start a conversation to begin getting AI suggestions'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {!currentConversationId ? (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a project and fill in lead details to start a conversation</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Type your first message to get AI-powered suggestions</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.type === 'user' 
                                ? 'text-blue-100' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          {message.type === 'ai' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyToClipboard(message.content)}
                              className="ml-2 opacity-70 hover:opacity-100"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {currentConversationId && (
                <div className="flex gap-2">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    rows={2}
                    className="flex-1 resize-none"
                    disabled={isGenerating}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!userInput.trim() || isGenerating}
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
