import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBackend } from '../hooks/useBackend';
import { useToast } from '@/components/ui/use-toast';
import type { ProjectResponse, CreateProjectRequest, UpdateProjectRequest } from '~backend/projects/types';

interface ProjectContextType {
  projects: ProjectResponse[];
  isLoading: boolean;
  error: Error | null;
  createProject: (data: CreateProjectRequest) => Promise<void>;
  updateProject: (id: number, data: UpdateProjectRequest) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  getProject: (id: number) => ProjectResponse | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const backend = useBackend();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projectsData, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        return await backend.projects.list();
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        throw error;
      }
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: CreateProjectRequest) => {
      try {
        await backend.projects.create(data);
      } catch (error) {
        console.error('Failed to create project:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project created',
        description: 'Your new project has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateProjectRequest }) => {
      try {
        await backend.projects.update({ id, ...data });
      } catch (error) {
        console.error('Failed to update project:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project updated',
        description: 'Your project has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update project. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        await backend.projects.deleteProject({ id });
      } catch (error) {
        console.error('Failed to delete project:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project deleted',
        description: 'The project has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete project. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const projects = projectsData?.projects || [];

  const createProject = async (data: CreateProjectRequest) => {
    await createProjectMutation.mutateAsync(data);
  };

  const updateProject = async (id: number, data: UpdateProjectRequest) => {
    await updateProjectMutation.mutateAsync({ id, data });
  };

  const deleteProject = async (id: number) => {
    await deleteProjectMutation.mutateAsync(id);
  };

  const getProject = (id: number) => {
    return projects.find(project => project.id === id);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      isLoading,
      error,
      createProject,
      updateProject,
      deleteProject,
      getProject,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
