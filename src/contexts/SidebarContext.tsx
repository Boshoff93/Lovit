import React, { createContext, useContext, useState, useCallback } from 'react';

// Sidebar dimensions (must match Layout.tsx)
export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

interface SidebarContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  sidebarWidth: number;
}

const SidebarContext = createContext<SidebarContextType>({
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  sidebarWidth: SIDEBAR_WIDTH,
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(false);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
  }, []);

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <SidebarContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed, sidebarWidth }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContext;
