import React, { useState } from 'react';
import { Search, Filter, Eye, Download, Calendar, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useConversations } from '../contexts/ConversationContext';
import { useProjects } from '../contexts/ProjectContext';
import { useToast } from '@/components/ui/use-toast';
import { Conversation } from '../types/conversation';

export default function Conversations() {
  const { conversations } = useConversations();
  const { projects } = useProjects();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const filteredConversations = conversations.filter(conversation => {
    const project = projects.find(p => p.id === conversation.projectId);
    const matchesSearch = 
      conversation.leadContext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.leadContext.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || conversation.status === statusFilter;
    const matchesProject = projectFilter === 'all' || conversation.projectId === projectFilter;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  const handleExportCSV = () => {
    const csvData = filteredConversations.map(conversation => {
      const project = projects.find(p => p.id === conversation.projectId);
      return {
        'Lead Name': conversation.leadContext.name,
        'Company': conversation.leadContext.company,
        'Project': project?.name || 'Unknown',
        'Status': conversation.status,
        'Source': conversation.leadContext.source,
        'Messages': conversation.messages.length,
        'Created': new Date(conversation.createdAt).toLocaleDateString(),
        'Updated': new Date(conversation.updatedAt).toLocaleDateString(),
      };
    });

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: 'Conversations have been exported to CSV.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Conversations</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and review all your sales conversations
          </p>
        </div>
        <Button onClick={handleExportCSV} disabled={filteredConversations.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Conversations List */}
      {filteredConversations.length > 0 ? (
        <div className="space-y-4">
          {filteredConversations.map((conversation) => {
            const project = projects.find(p => p.id === conversation.projectId);
            return (
              <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {conversation.leadContext.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {conversation.leadContext.company}
                          </span>
                        </div>
                        <Badge 
                          variant={conversation.status === 'open' ? 'default' : 'secondary'}
                        >
                          {conversation.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                        <span>Project: {project?.name || 'Unknown'}</span>
                        <span>Messages: {conversation.messages.length}</span>
                        {conversation.leadContext.source && (
                          <span>Source: {conversation.leadContext.source}</span>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(conversation.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {conversation.leadContext.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                          {conversation.leadContext.notes}
                        </p>
                      )}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Conversation with {conversation.leadContext.name}
                          </DialogTitle>
                          <DialogDescription>
                            {conversation.leadContext.company} • {project?.name || 'Unknown Project'}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Lead Context */}
                          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Lead Name</p>
                              <p className="text-gray-900 dark:text-white">{conversation.leadContext.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</p>
                              <p className="text-gray-900 dark:text-white">{conversation.leadContext.company}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Source</p>
                              <p className="text-gray-900 dark:text-white">{conversation.leadContext.source || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</p>
                              <Badge variant={conversation.status === 'open' ? 'default' : 'secondary'}>
                                {conversation.status}
                              </Badge>
                            </div>
                            {conversation.leadContext.notes && (
                              <div className="col-span-2">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</p>
                                <p className="text-gray-900 dark:text-white">{conversation.leadContext.notes}</p>
                              </div>
                            )}
                          </div>

                          {/* Messages */}
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                              Conversation History ({conversation.messages.length} messages)
                            </h4>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {conversation.messages.map((message) => (
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
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                    <p className={`text-xs mt-1 ${
                                      message.type === 'user' 
                                        ? 'text-blue-100' 
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                      {new Date(message.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No conversations found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              {searchTerm || statusFilter !== 'all' || projectFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start your first conversation to see it here'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
