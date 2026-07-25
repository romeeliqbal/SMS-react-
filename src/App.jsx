import { useRoutes } from 'react-router-dom';
import { LayoutProvider } from './context/LayoutProvider';
import { appRoutes } from './router/AppRouter';
import './App.css';

export default function App() {
  const routes = useRoutes(appRoutes);

  return (
    <LayoutProvider>
      <div className="app">{routes}</div>
    </LayoutProvider>
  );
}
