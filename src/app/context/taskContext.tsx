'use client';
import React, { createContext, useContext, useState } from 'react';

export type TaskModel = {
    id: number;
    projectId: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt?: string | null;
};

type TaskContextType = {
  editingTask: TaskModel | null;
  setEditingTask: (task: TaskModel | null) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [editingTask, setEditingTask] = useState<TaskModel | null>(null);

  return (
    <TaskContext.Provider value={{ editingTask, setEditingTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask must be used within TaskProvider');
  return context;
};
