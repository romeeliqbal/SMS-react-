import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserCog,
  Building2,
  School,
  BookOpen,
  Calendar,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Award,
  PenLine,
  Megaphone,
  PartyPopper,
  Shield,
  MessageSquare,
  Wallet,
  CreditCard,
  BarChart3,
  UserPlus,
  Library,
  Package,
  Building,
  Bus,
  BedDouble,
  PieChart,
  Settings,
  ScrollText,
  Clock,
} from 'lucide-react';
import { ROLES } from './roleConfigs';

const ALL_STAFF = [
  ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGEMENT, ROLES.HOD,
  ROLES.TEACHER, ROLES.EXAM_OFFICER, ROLES.ADMISSION_STAFF, ROLES.LIBRARIAN, ROLES.ACCOUNTANT,
];

export const navigationGroups = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/',
        icon: LayoutDashboard,
        description: 'Role-adaptive institutional overview and KPIs.',
        roles: Object.values(ROLES),
      },
    ],
  },
  {
    id: 'people',
    label: 'People',
    items: [
      { id: 'students', label: 'Students', path: '/people/students', icon: Users, description: 'Student records, profiles, and enrollment.', roles: [...ALL_STAFF, ROLES.STUDENT, ROLES.PARENT] },
      { id: 'teachers', label: 'Teachers', path: '/people/teachers', icon: UserCheck, description: 'Faculty directory and workload.', roles: [...ALL_STAFF] },
      { id: 'parents', label: 'Parents', path: '/people/parents', icon: Users, description: 'Guardian management and linked children.', roles: [ROLES.ADMIN, ROLES.MANAGEMENT, ROLES.ADMISSION_STAFF] },
      { id: 'staff', label: 'Staff', path: '/people/staff', icon: UserCog, description: 'Administrative and non-teaching staff.', roles: [ROLES.ADMIN, ROLES.MANAGEMENT] },
    ],
  },
  {
    id: 'academics',
    label: 'Academics',
    items: [
      { id: 'departments', label: 'Departments', path: '/academics/departments', icon: Building2, description: 'Science, Arts, Commerce departments.', roles: [ROLES.ADMIN, ROLES.MANAGEMENT, ROLES.HOD] },
      { id: 'classes', label: 'Classes', path: '/academics/classes', icon: School, description: 'Grade sections and class teachers.', roles: [...ALL_STAFF, ROLES.STUDENT, ROLES.PARENT] },
      { id: 'subjects', label: 'Subjects', path: '/academics/subjects', icon: BookOpen, description: 'Subject catalogue and teacher allocation.', roles: [...ALL_STAFF, ROLES.STUDENT] },
      { id: 'timetable', label: 'Timetable', path: '/academics/timetable', icon: Clock, description: 'Weekly class schedule grid.', roles: [...ALL_STAFF, ROLES.STUDENT, ROLES.PARENT] },
      { id: 'calendar', label: 'Academic Calendar', path: '/academics/calendar', icon: CalendarDays, description: 'Terms, holidays, and exam dates.', roles: Object.values(ROLES) },
    ],
  },
  {
    id: 'attendance',
    label: 'Attendance',
    items: [
      { id: 'student-attendance', label: 'Student Attendance', path: '/attendance/students', icon: ClipboardCheck, description: 'Class-wise daily attendance marking.', roles: [...ALL_STAFF, ROLES.STUDENT, ROLES.PARENT] },
      { id: 'teacher-attendance', label: 'Teacher Attendance', path: '/attendance/teachers', icon: UserCheck, description: 'Staff check-in and leave tracking.', roles: [ROLES.ADMIN, ROLES.MANAGEMENT] },
      { id: 'attendance-reports', label: 'Attendance Reports', path: '/attendance/reports', icon: ClipboardList, description: 'Shortage alerts and class statistics.', roles: [...ALL_STAFF] },
    ],
  },
  {
    id: 'examination',
    label: 'Examination',
    items: [
      { id: 'exams', label: 'Exams', path: '/examination/exams', icon: FileText, description: 'Midterm, Final, and practical exams.', roles: [...ALL_STAFF, ROLES.STUDENT, ROLES.PARENT] },
      { id: 'exam-schedule', label: 'Exam Schedule', path: '/examination/schedule', icon: Calendar, description: 'Date sheets and room allocations.', roles: [...ALL_STAFF, ROLES.STUDENT, ROLES.PARENT] },
      { id: 'marks-entry', label: 'Marks Entry', path: '/examination/marks', icon: PenLine, description: 'Subject-wise marks entry and grading.', roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.EXAM_OFFICER, ROLES.HOD] },
      { id: 'report-cards', label: 'Report Cards', path: '/examination/report-cards', icon: Award, description: 'Generate Pakistani board-style report cards.', roles: [...ALL_STAFF, ROLES.STUDENT, ROLES.PARENT] },
    ],
  },
  {
    id: 'student-life',
    label: 'Student Life',
    items: [
      { id: 'assignments', label: 'Assignments', path: '/student-life/assignments', icon: PenLine, description: 'Homework creation and submission tracking.', roles: [...ALL_STAFF, ROLES.STUDENT, ROLES.PARENT] },
      { id: 'announcements', label: 'Announcements', path: '/student-life/announcements', icon: Megaphone, description: 'Notices for students, parents, and staff.', roles: Object.values(ROLES) },
      { id: 'events', label: 'Events', path: '/student-life/events', icon: PartyPopper, description: 'Sports gala, exhibitions, and PTM.', roles: Object.values(ROLES) },
      { id: 'discipline', label: 'Discipline', path: '/student-life/discipline', icon: Shield, description: 'Incident log and committee actions.', roles: [ROLES.ADMIN, ROLES.MANAGEMENT, ROLES.TEACHER, ROLES.HOD] },
      { id: 'complaints', label: 'Complaints', path: '/student-life/complaints', icon: MessageSquare, description: 'Support tickets and facility issues.', roles: Object.values(ROLES) },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    items: [
      { id: 'fees', label: 'Fees', path: '/finance/fees', icon: Wallet, description: 'Fee structure and challan generation.', roles: [ROLES.ADMIN, ROLES.MANAGEMENT, ROLES.ACCOUNTANT, ROLES.PARENT, ROLES.STUDENT] },
      { id: 'payments', label: 'Payments', path: '/finance/payments', icon: CreditCard, description: 'Record payments and receipts.', roles: [ROLES.ADMIN, ROLES.ACCOUNTANT] },
      { id: 'financial-reports', label: 'Financial Reports', path: '/finance/reports', icon: BarChart3, description: 'Collection summary and defaulters.', roles: [ROLES.ADMIN, ROLES.MANAGEMENT, ROLES.ACCOUNTANT] },
    ],
  },
  {
    id: 'admissions',
    label: 'Admissions',
    items: [
      { id: 'admissions', label: 'Admissions Pipeline', path: '/admissions', icon: UserPlus, description: 'Application to enrollment workflow.', roles: [ROLES.ADMIN, ROLES.MANAGEMENT, ROLES.ADMISSION_STAFF] },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    items: [
      { id: 'library', label: 'Library', path: '/resources/library', icon: Library, description: 'Book catalog and issue/return.', roles: [ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.TEACHER, ROLES.STUDENT] },
      { id: 'inventory', label: 'Inventory', path: '/resources/inventory', icon: Package, description: 'Lab apparatus and IT equipment.', roles: [ROLES.ADMIN, ROLES.MANAGEMENT] },
      { id: 'facilities', label: 'Facilities', path: '/resources/facilities', icon: Building, description: 'Classrooms, labs, and auditoriums.', roles: [ROLES.ADMIN, ROLES.MANAGEMENT] },
      { id: 'transport', label: 'Transport', path: '/resources/transport', icon: Bus, description: 'Bus routes and student allocation.', roles: [ROLES.ADMIN, ROLES.MANAGEMENT, ROLES.PARENT] },
      { id: 'hostel', label: 'Hostel', path: '/resources/hostel', icon: BedDouble, description: 'Hostel rooms and bed allotment.', roles: [ROLES.ADMIN, ROLES.MANAGEMENT] },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    items: [
      { id: 'reports', label: 'Reports', path: '/analytics/reports', icon: PieChart, description: 'Pass rates, attendance trends, fee recovery.', roles: [ROLES.ADMIN, ROLES.MANAGEMENT, ROLES.HOD, ROLES.EXAM_OFFICER] },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    items: [
      { id: 'users-roles', label: 'Users & Roles', path: '/administration/users', icon: UserCog, description: 'User accounts and role assignments.', roles: [ROLES.ADMIN] },
      { id: 'audit-log', label: 'Audit Log', path: '/administration/audit-log', icon: ScrollText, description: 'System action history.', roles: [ROLES.ADMIN, ROLES.MANAGEMENT] },
      { id: 'settings', label: 'Settings', path: '/settings', icon: Settings, description: 'Institution config, grading scale, themes.', roles: Object.values(ROLES) },
    ],
  },
];

export const flatNavigationItems = navigationGroups.flatMap((g) => g.items);

export function getNavigationForRole(roleId) {
  return navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(roleId)),
    }))
    .filter((group) => group.items.length > 0);
}

export function getNavigationItemByPath(path) {
  return flatNavigationItems.find((item) => item.path === path);
}

export function canRoleAccessPath(roleId, path) {
  const item = flatNavigationItems.find((i) => i.path === path);
  if (!item) return path === '/';
  return item.roles.includes(roleId);
}
