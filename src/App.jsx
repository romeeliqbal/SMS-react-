import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { LayoutProvider } from './context/LayoutProvider';
import { appRoutes } from './router/AppRouter';
import { ensureSeeded } from './utils/seedInitializer';
import { readStorage, STORAGE_KEYS } from './utils/storage';
import { applyAccentTheme, applyCompactMode } from './utils/theme';
import './App.css';

export default function App() {
  const routes = useRoutes(appRoutes);

  useEffect(() => {
    ensureSeeded();
    const settings = readStorage(STORAGE_KEYS.settings, null);
    if (settings) {
      applyAccentTheme(settings.accentColor);
      applyCompactMode(settings.compactMode);
    }
  }, []);

  return (
    <LayoutProvider>
      <div className="app">{routes}</div>
    </LayoutProvider>
  );
}
