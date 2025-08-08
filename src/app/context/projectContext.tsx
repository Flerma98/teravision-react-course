'use client';
import React, { createContext, useContext, useState } from 'react';

type Project = {
  id: number;
  title: string;
  description: string;
};

type ProjectContextType = {
  editingProject: Project | null;
  setEditingProject: (project: Project | null) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);

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
