import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentTeamId: string | null;
  setCurrentTeamId: (id: string | null) => void;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  currentTeamId: null,
  setCurrentTeamId: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        currentTeamId,
        setCurrentTeamId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
