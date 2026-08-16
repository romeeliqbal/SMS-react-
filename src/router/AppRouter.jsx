import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';

// People
import Students from '../pages/Students';
import StudentProfile from '../pages/people/StudentProfile';
import Teachers from '../pages/people/Teachers';
import Parents from '../pages/people/Parents';
import Staff from '../pages/people/Staff';

// Academics
import Departments from '../pages/academics/Departments';
import Classes from '../pages/academics/Classes';
import Subjects from '../pages/academics/Subjects';
import Timetable from '../pages/academics/Timetable';
import AcademicCalendar from '../pages/academics/AcademicCalendar';

// Attendance
import StudentAttendance from '../pages/attendance/StudentAttendance';
import TeacherAttendance from '../pages/attendance/TeacherAttendance';
import AttendanceReports from '../pages/attendance/AttendanceReports';

// Examination
import Exams from '../pages/examination/Exams';
import ExamSchedule from '../pages/examination/ExamSchedule';
import MarksEntry from '../pages/examination/MarksEntry';
import ReportCards from '../pages/examination/ReportCards';

// Student Life
import Assignments from '../pages/student-life/Assignments';
import Announcements from '../pages/student-life/Announcements';
import Events from '../pages/student-life/Events';
import Discipline from '../pages/student-life/Discipline';
import Complaints from '../pages/student-life/Complaints';

// Finance
import Fees from '../pages/finance/Fees';
import Payments from '../pages/finance/Payments';
import FinancialReports from '../pages/finance/FinancialReports';

// Admissions
import Admissions from '../pages/admissions/Admissions';

// Resources
import Library from '../pages/resources/Library';
import Inventory from '../pages/resources/Inventory';
import Facilities from '../pages/resources/Facilities';
import Transport from '../pages/resources/Transport';
import Hostel from '../pages/resources/Hostel';

// Analytics & Admin
import AnalyticsReports from '../pages/analytics/AnalyticsReports';
import UsersRoles from '../pages/administration/UsersRoles';
import AuditLog from '../pages/administration/AuditLog';
import Settings from '../pages/Settings';

export const appRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },

      // People
      { path: 'people/students', element: <Students /> },
      { path: 'people/students/:id', element: <StudentProfile /> },
      { path: 'people/teachers', element: <Teachers /> },
      { path: 'people/parents', element: <Parents /> },
      { path: 'people/staff', element: <Staff /> },

      // Academics
      { path: 'academics/departments', element: <Departments /> },
      { path: 'academics/classes', element: <Classes /> },
      { path: 'academics/subjects', element: <Subjects /> },
      { path: 'academics/timetable', element: <Timetable /> },
      { path: 'academics/calendar', element: <AcademicCalendar /> },

      // Attendance
      { path: 'attendance/students', element: <StudentAttendance /> },
      { path: 'attendance/teachers', element: <TeacherAttendance /> },
      { path: 'attendance/reports', element: <AttendanceReports /> },

      // Examination
      { path: 'examination/exams', element: <Exams /> },
      { path: 'examination/schedule', element: <ExamSchedule /> },
      { path: 'examination/marks', element: <MarksEntry /> },
      { path: 'examination/report-cards', element: <ReportCards /> },

      // Student Life
      { path: 'student-life/assignments', element: <Assignments /> },
      { path: 'student-life/announcements', element: <Announcements /> },
      { path: 'student-life/events', element: <Events /> },
      { path: 'student-life/discipline', element: <Discipline /> },
      { path: 'student-life/complaints', element: <Complaints /> },

      // Finance
      { path: 'finance/fees', element: <Fees /> },
      { path: 'finance/payments', element: <Payments /> },
      { path: 'finance/reports', element: <FinancialReports /> },

      // Admissions
      { path: 'admissions', element: <Admissions /> },

      // Resources
      { path: 'resources/library', element: <Library /> },
      { path: 'resources/inventory', element: <Inventory /> },
      { path: 'resources/facilities', element: <Facilities /> },
      { path: 'resources/transport', element: <Transport /> },
      { path: 'resources/hostel', element: <Hostel /> },

      // Analytics & Administration
      { path: 'analytics/reports', element: <AnalyticsReports /> },
      { path: 'administration/users', element: <UsersRoles /> },
      { path: 'administration/audit-log', element: <AuditLog /> },
      { path: 'settings', element: <Settings /> },

      // Legacy Aliases
      { path: 'students', element: <Navigate to="/people/students" replace /> },
      { path: 'courses', element: <Navigate to="/academics/subjects" replace /> },
      { path: 'attendance', element: <Navigate to="/attendance/students" replace /> },
      { path: 'grades', element: <Navigate to="/examination/marks" replace /> },

      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];
