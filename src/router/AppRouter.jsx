import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Courses from '../pages/Courses';
import Attendance from '../pages/Attendance';
import Grades from '../pages/Grades';
import Settings from '../pages/Settings';

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
        element: <Students />,
      },
      {
        path: 'courses',
        element: <Courses />,
      },
      {
        path: 'attendance',
        element: <Attendance />,
      },
      {
        path: 'grades',
        element: <Grades />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
];
