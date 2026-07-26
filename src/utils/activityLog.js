import { readStorage, writeStorage, STORAGE_KEYS } from './storage';

const MAX_ACTIVITY_ITEMS = 20;

export function logActivity(action, detail) {
  const existing = readStorage(STORAGE_KEYS.activity, []);
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    action,
    detail,
    timestamp: new Date().toISOString(),
  };
  const next = [entry, ...existing].slice(0, MAX_ACTIVITY_ITEMS);
  writeStorage(STORAGE_KEYS.activity, next);
  return next;
}

export function getActivity() {
  return readStorage(STORAGE_KEYS.activity, []);
}

export function formatRelativeTime(isoString) {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = Math.max(0, now - then);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes === 1 ? '' : 's'} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Date(isoString).toLocaleDateString();
}
