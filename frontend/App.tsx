import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { ConversationProvider } from './contexts/ConversationContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectForm from './pages/ProjectForm';
import Conversations from './pages/Conversations';
import ConversationArea from './pages/ConversationArea';

const queryClient = new QueryClient();

function AppInner() {
  return (
    <Router>
      <ThemeProvider>
        <ProjectProvider>
          <ConversationProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/new" element={<ProjectForm />} />
                <Route path="/projects/:id/edit" element={<ProjectForm />} />
                <Route path="/conversation" element={<ConversationArea />} />
                <Route path="/conversations" element={<Conversations />} />
              </Routes>
            </Layout>
            <Toaster />
          </ConversationProvider>
        </ProjectProvider>
      </ThemeProvider>
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
