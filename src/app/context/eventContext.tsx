'use client';
import React, { createContext, useContext, useState } from 'react';

export type EventModel = {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt?: string | null;
};

type EventContextType = {
  editingEvent: EventModel | null;
  setEditingEvent: (event: EventModel | null) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [editingEvent, setEditingEvent] = useState<EventModel | null>(null);

  return (
    <EventContext.Provider value={{ editingEvent, setEditingEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvent must be used within EventProvider');
  return context;
};
