import { readStorage, writeStorage, STORAGE_KEYS } from './storage';

const MAX_LOG_ITEMS = 50;

export function logActivity(action, detail, options = {}) {
  const existing = readStorage(STORAGE_KEYS.auditLogs, []);
  const entry = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    user: options.user || 'System',
    role: options.role || 'System',
    action,
    module: options.module || 'General',
    detail,
    timestamp: new Date().toISOString(),
  };
  const next = [entry, ...existing].slice(0, MAX_LOG_ITEMS);
  writeStorage(STORAGE_KEYS.auditLogs, next);
  return next;
}

export function getActivity() {
  return readStorage(STORAGE_KEYS.auditLogs, []);
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
