import { useEffect, useMemo, useState } from 'react';
import { LayoutContext } from './layoutContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { readStorage, STORAGE_KEYS } from '../utils/storage';

export function LayoutProvider({ children }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const settings = readStorage(STORAGE_KEYS.settings, null);
    return settings?.sidebarCollapsedDefault || false;
  });

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setSidebarCollapsed(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const value = useMemo(
    () => ({
      isMobile,
      sidebarOpen,
      sidebarCollapsed,
      setSidebarOpen,
      setSidebarCollapsed,
      toggleSidebar: () => setSidebarOpen((prev) => !prev),
      toggleSidebarCollapse: () => setSidebarCollapsed((prev) => !prev),
      closeSidebar: () => setSidebarOpen(false),
    }),
    [isMobile, sidebarOpen, sidebarCollapsed],
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}
