'use client';

import React, { createContext, useContext, useState } from 'react';

interface ClassContextType {
  selectedClassId: string | null;
  setSelectedClassId: (id: string | null) => void;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  return (
    <ClassContext.Provider value={{ selectedClassId, setSelectedClassId }}>
      {children}
    </ClassContext.Provider>
  );
};

export const useClass = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error('useClass deve ser utilizado dentro de um ClassProvider');
  }
  return context;
};
