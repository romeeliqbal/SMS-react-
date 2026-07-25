import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Settings,
} from 'lucide-react';

export const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    description: 'Overview of your student management system.',
  },
  {
    id: 'students',
    label: 'Students',
    path: '/students',
    icon: Users,
    description: 'Manage student records, profiles, and enrollment.',
  },
  {
    id: 'courses',
    label: 'Courses',
    path: '/courses',
    icon: BookOpen,
    description: 'Organize courses, schedules, and curriculum.',
  },
  {
    id: 'attendance',
    label: 'Attendance',
    path: '/attendance',
    icon: ClipboardCheck,
    description: 'Track and monitor student attendance records.',
  },
  {
    id: 'grades',
    label: 'Grades',
    path: '/grades',
    icon: GraduationCap,
    description: 'Review academic performance and grade reports.',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    description: 'Configure system preferences and account settings.',
  },
];

export function getNavigationItemByPath(path) {
  return navigationItems.find((item) => item.path === path);
}
