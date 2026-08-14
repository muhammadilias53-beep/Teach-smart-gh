import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleCollapse: () => {},
  setIsCollapsed: () => {},
});

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsedState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('teachsmart_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsedState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('teachsmart_sidebar_collapsed', String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const setIsCollapsed = (collapsed: boolean) => {
    setIsCollapsedState(collapsed);
    try {
      localStorage.setItem('teachsmart_sidebar_collapsed', String(collapsed));
    } catch (e) {
      // ignore
    }
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
