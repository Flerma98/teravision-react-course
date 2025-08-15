'use client';
import React, { createContext, useContext, useState } from 'react';

export type ProjectModel = {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt?: string | null;
};

type ProjectContextType = {
  editingProject: ProjectModel | null;
  setEditingProject: (project: ProjectModel | null) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [editingProject, setEditingProject] = useState<ProjectModel | null>(null);

  return (
    <ProjectContext.Provider value={{ editingProject, setEditingProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within ProjectProvider');
  return context;
};
