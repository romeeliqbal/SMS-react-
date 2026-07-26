import { STORAGE_KEYS, readStorage, writeStorage } from './storage';
import {
  SEED_COURSES,
  generateSeedActivity,
  generateSeedAttendance,
  generateSeedGrades,
  generateSeedStudents,
} from '../data/seedData';

export function ensureSeeded() {
  const alreadySeeded = readStorage(STORAGE_KEYS.seeded, false);
  if (alreadySeeded) {
    return;
  }

  const students = generateSeedStudents();
  const attendance = generateSeedAttendance(students);
  const grades = generateSeedGrades(students);
  const activity = generateSeedActivity();

  writeStorage(STORAGE_KEYS.students, students);
  writeStorage(STORAGE_KEYS.courses, SEED_COURSES);
  writeStorage(STORAGE_KEYS.attendance, attendance);
  writeStorage(STORAGE_KEYS.grades, grades);
  writeStorage(STORAGE_KEYS.activity, activity);
  writeStorage(STORAGE_KEYS.settings, {
    accentColor: 'indigo',
    compactMode: false,
    sidebarCollapsedDefault: false,
  });
  writeStorage(STORAGE_KEYS.seeded, true);
}

export function restoreSampleData() {
  writeStorage(STORAGE_KEYS.seeded, false);
  ensureSeeded();
}
