export function generateId(prefix = 'id') {
  const random = Math.random().toString(36).slice(2, 9);
  return `${prefix}_${Date.now().toString(36)}${random}`;
}

export function generateStudentCode(existingStudents, year = new Date().getFullYear()) {
  const yearPrefix = `STU-${year}-`;
  const usedNumbers = existingStudents
    .map((student) => student.studentCode)
    .filter((code) => code && code.startsWith(yearPrefix))
    .map((code) => Number.parseInt(code.slice(yearPrefix.length), 10))
    .filter((num) => !Number.isNaN(num));

  const nextNumber = usedNumbers.length > 0 ? Math.max(...usedNumbers) + 1 : 1;
  return `${yearPrefix}${String(nextNumber).padStart(3, '0')}`;
}

export function getInitials(firstName, lastName) {
  const first = (firstName || '').trim().charAt(0);
  const last = (lastName || '').trim().charAt(0);
  return `${first}${last}`.toUpperCase() || '?';
}

const AVATAR_PALETTE = ['#6366f1', '#22d3ee', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c', '#38bdf8'];

export function getAvatarColor(seed) {
  const str = String(seed || '');
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) % AVATAR_PALETTE.length;
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}
