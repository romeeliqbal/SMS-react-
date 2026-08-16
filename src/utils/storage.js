const PREFIX = 'edupulse:';

export const STORAGE_KEYS = {
  students: `${PREFIX}students`,
  teachers: `${PREFIX}teachers`,
  parents: `${PREFIX}parents`,
  staff: `${PREFIX}staff`,
  departments: `${PREFIX}departments`,
  classes: `${PREFIX}classes`,
  subjects: `${PREFIX}subjects`,
  attendance: `${PREFIX}attendance`,
  teacherAttendance: `${PREFIX}teacher_attendance`,
  exams: `${PREFIX}exams`,
  marks: `${PREFIX}marks`,
  assignments: `${PREFIX}assignments`,
  fees: `${PREFIX}fees`,
  payments: `${PREFIX}payments`,
  announcements: `${PREFIX}announcements`,
  events: `${PREFIX}events`,
  admissions: `${PREFIX}admissions`,
  libraryBooks: `${PREFIX}library_books`,
  inventory: `${PREFIX}inventory`,
  facilities: `${PREFIX}facilities`,
  transport: `${PREFIX}transport`,
  hostel: `${PREFIX}hostel`,
  complaints: `${PREFIX}complaints`,
  discipline: `${PREFIX}discipline`,
  auditLogs: `${PREFIX}audit_logs`,
  settings: `${PREFIX}settings`,
  activeRole: `${PREFIX}active_role`,
  authProfile: `${PREFIX}auth_profile`,
  notifications: `${PREFIX}notifications`,
  timetable: `${PREFIX}timetable`,
  seeded: `${PREFIX}seeded_v2`,
};

export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode, quota exceeded, etc.) - fail silently.
  }
}

export function clearAllStorage() {
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
}
