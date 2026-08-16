import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LayoutProvider } from './context/LayoutProvider';
import { ToastProvider, useToast } from './context/ToastContext';
import ToastContainer from './components/common/Toast';
import { appRoutes } from './router/AppRouter';
import { ensureSeeded } from './utils/seedInitializer';
import { readStorage, STORAGE_KEYS } from './utils/storage';
import { applyAccentTheme, applyCompactMode } from './utils/theme';
import './App.css';

function AppRoutes() {
  const routes = useRoutes(appRoutes);
  const { toasts } = useToast();
  return (
    <>
      {routes}
      <ToastContainer toasts={toasts} />
    </>
  );
}

export default function App() {
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
      <AuthProvider>
        <DataProvider>
          <ToastProvider>
            <div className="app">
              <AppRoutes />
            </div>
          </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </LayoutProvider>
  );
}
