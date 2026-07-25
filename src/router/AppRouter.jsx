import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';

export const appRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'students',
        element: <></>,
      },
      {
        path: 'courses',
        element: <></>,
      },
      {
        path: 'attendance',
        element: <></>,
      },
      {
        path: 'grades',
        element: <></>,
      },
      {
        path: 'settings',
        element: <></>,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
];
