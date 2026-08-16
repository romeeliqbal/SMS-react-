import { ROLES } from '../data/roleConfigs';
import {
  SEED_ADMISSIONS,
  SEED_ANNOUNCEMENTS,
  SEED_ASSIGNMENTS,
  SEED_AUDIT_LOGS,
  SEED_CLASSES,
  SEED_COMPLAINTS,
  SEED_DEPARTMENTS,
  SEED_DISCIPLINE,
  SEED_EVENTS,
  SEED_EXAMS,
  SEED_FACILITIES,
  SEED_FEES,
  SEED_HOSTEL,
  SEED_INVENTORY,
  SEED_LIBRARY_BOOKS,
  SEED_NOTIFICATIONS,
  SEED_PAYMENTS,
  SEED_STAFF,
  SEED_SUBJECTS,
  SEED_TEACHERS,
  SEED_TEACHER_ATTENDANCE,
  SEED_TIMETABLE,
  SEED_TRANSPORT,
  generateSeedAttendance,
  generateSeedMarks,
  generateSeedParents,
  generateSeedStudents,
  getDefaultSettings,
} from '../data/seedData';
import { getRoleDefinition } from '../data/roleConfigs';
import { STORAGE_KEYS, readStorage, writeStorage } from './storage';

export function ensureSeeded() {
  const alreadySeeded = readStorage(STORAGE_KEYS.seeded, false);
  if (alreadySeeded) {
    return;
  }

  const students = generateSeedStudents();
  const parents = generateSeedParents(students);
  const attendance = generateSeedAttendance(students);
  const marks = generateSeedMarks(students);

  writeStorage(STORAGE_KEYS.students, students);
  writeStorage(STORAGE_KEYS.teachers, SEED_TEACHERS);
  writeStorage(STORAGE_KEYS.parents, parents);
  writeStorage(STORAGE_KEYS.staff, SEED_STAFF);
  writeStorage(STORAGE_KEYS.departments, SEED_DEPARTMENTS);
  writeStorage(STORAGE_KEYS.classes, SEED_CLASSES);
  writeStorage(STORAGE_KEYS.subjects, SEED_SUBJECTS);
  writeStorage(STORAGE_KEYS.attendance, attendance);
  writeStorage(STORAGE_KEYS.teacherAttendance, SEED_TEACHER_ATTENDANCE);
  writeStorage(STORAGE_KEYS.exams, SEED_EXAMS);
  writeStorage(STORAGE_KEYS.marks, marks);
  writeStorage(STORAGE_KEYS.assignments, SEED_ASSIGNMENTS);
  writeStorage(STORAGE_KEYS.fees, SEED_FEES);
  writeStorage(STORAGE_KEYS.payments, SEED_PAYMENTS);
  writeStorage(STORAGE_KEYS.announcements, SEED_ANNOUNCEMENTS);
  writeStorage(STORAGE_KEYS.events, SEED_EVENTS);
  writeStorage(STORAGE_KEYS.admissions, SEED_ADMISSIONS);
  writeStorage(STORAGE_KEYS.libraryBooks, SEED_LIBRARY_BOOKS);
  writeStorage(STORAGE_KEYS.inventory, SEED_INVENTORY);
  writeStorage(STORAGE_KEYS.facilities, SEED_FACILITIES);
  writeStorage(STORAGE_KEYS.transport, SEED_TRANSPORT);
  writeStorage(STORAGE_KEYS.hostel, SEED_HOSTEL);
  writeStorage(STORAGE_KEYS.complaints, SEED_COMPLAINTS);
  writeStorage(STORAGE_KEYS.discipline, SEED_DISCIPLINE);
  writeStorage(STORAGE_KEYS.auditLogs, SEED_AUDIT_LOGS);
  writeStorage(STORAGE_KEYS.settings, getDefaultSettings());
  writeStorage(STORAGE_KEYS.notifications, SEED_NOTIFICATIONS);
  writeStorage(STORAGE_KEYS.timetable, SEED_TIMETABLE);

  const adminRole = getRoleDefinition(ROLES.ADMIN);
  writeStorage(STORAGE_KEYS.activeRole, ROLES.ADMIN);
  writeStorage(STORAGE_KEYS.authProfile, adminRole.defaultUser);

  writeStorage(STORAGE_KEYS.seeded, true);
}

export function restoreSampleData() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    if (key !== STORAGE_KEYS.seeded) {
      window.localStorage.removeItem(key);
    }
  });
  writeStorage(STORAGE_KEYS.seeded, false);
  ensureSeeded();
}
