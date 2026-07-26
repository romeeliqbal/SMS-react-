const PREFIX = 'edupulse:';

export const STORAGE_KEYS = {
  students: `${PREFIX}students`,
  courses: `${PREFIX}courses`,
  attendance: `${PREFIX}attendance`,
  grades: `${PREFIX}grades`,
  activity: `${PREFIX}activity`,
  settings: `${PREFIX}settings`,
  seeded: `${PREFIX}seeded`,
};

export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
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
