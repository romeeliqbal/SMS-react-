import { getAvatarColor, getInitials } from '../utils/idGenerators';

export const SEED_COURSES = [
  {
    id: 'course_cs101',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. Alan Turing',
    description: 'Foundational concepts of programming, algorithms, and computational thinking.',
    credits: 3,
    capacity: 40,
    status: 'Active',
  },
  {
    id: 'course_math201',
    code: 'MATH201',
    name: 'Calculus II',
    instructor: 'Dr. Ada Lovelace',
    description: 'Integral calculus, sequences, series, and applications to the sciences.',
    credits: 4,
    capacity: 35,
    status: 'Active',
  },
  {
    id: 'course_phy150',
    code: 'PHY150',
    name: 'Physics for Engineers',
    instructor: 'Dr. Marie Curie',
    description: 'Mechanics, thermodynamics, and electromagnetism with lab components.',
    credits: 4,
    capacity: 30,
    status: 'Active',
  },
  {
    id: 'course_eng105',
    code: 'ENG105',
    name: 'Academic Writing',
    instructor: 'Prof. Maya Rowan',
    description: 'Developing clear, persuasive academic writing across disciplines.',
    credits: 2,
    capacity: 25,
    status: 'Active',
  },
  {
    id: 'course_bio120',
    code: 'BIO120',
    name: 'Cell Biology',
    instructor: 'Dr. Rosalind Franklin',
    description: 'Structure and function of cells, from molecules to organelles.',
    credits: 3,
    capacity: 30,
    status: 'Upcoming',
  },
  {
    id: 'course_ds301',
    code: 'DS301',
    name: 'Data Structures & Algorithms',
    instructor: 'Dr. Grace Hopper',
    description: 'Trees, graphs, sorting, and algorithmic complexity analysis.',
    credits: 4,
    capacity: 35,
    status: 'Active',
  },
];

const FIRST_NAMES = [
  'Sarah', 'James', 'Amara', 'Liam', 'Fatima', 'Noah', 'Priya', 'Ethan', 'Zainab', 'Lucas',
  'Aisha', 'Mason', 'Layla', 'Omar', 'Grace', 'Daniel', 'Mei', 'Ibrahim', 'Isabella', 'Kwame',
  'Sofia', 'Ryan', 'Hana', 'Marcus', 'Nadia',
];

const LAST_NAMES = [
  'Chen', 'Patel', 'Okafor', 'Silva', 'Khan', 'Garcia', 'Kumar', 'Nguyen', 'Ahmed', 'Rossi',
  'Bello', 'Johnson', 'Haddad', 'Park', 'Ali', 'Fischer', 'Wong', 'Osei', 'Martinez', 'Diallo',
  'Novak', 'Brooks', 'Tanaka', 'Reyes', 'Hussain',
];

const STATUSES = ['Active', 'Active', 'Active', 'Active', 'Inactive', 'Graduated'];

function buildEnrollmentDate(index) {
  const monthsAgo = (index % 10) + 1;
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(((index * 7) % 27) + 1);
  return date.toISOString().slice(0, 10);
}

export function generateSeedStudents() {
  return FIRST_NAMES.map((firstName, index) => {
    const lastName = LAST_NAMES[index];
    const courseCount = (index % 3) + 1;
    const courseIds = [];
    for (let c = 0; c < courseCount; c += 1) {
      const course = SEED_COURSES[(index + c) % SEED_COURSES.length];
      if (!courseIds.includes(course.id)) {
        courseIds.push(course.id);
      }
    }

    const fullName = `${firstName} ${lastName}`;
    return {
      id: `student_${index + 1}`,
      studentCode: `STU-2024-${String(index + 1).padStart(3, '0')}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@edupulse.edu`,
      phone: `+1 555-01${String(10 + index).slice(-2)}-${String(1000 + index * 37).slice(-4)}`,
      courseIds,
      status: STATUSES[index % STATUSES.length],
      enrollmentDate: buildEnrollmentDate(index),
      avatarColor: getAvatarColor(fullName),
      initials: getInitials(firstName, lastName),
    };
  });
}

function buildAttendanceKey(studentId, dateStr) {
  return `${studentId}_${dateStr}`;
}

export function generateSeedAttendance(students) {
  const records = {};
  const today = new Date();

  students.forEach((student, sIndex) => {
    for (let dayOffset = 0; dayOffset < 20; dayOffset += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - dayOffset);
      const day = date.getDay();
      if (day === 0 || day === 6) {
        continue; // skip weekends
      }
      const dateStr = date.toISOString().slice(0, 10);
      const roll = (sIndex + dayOffset) % 10;
      let status = 'present';
      if (roll === 0) status = 'absent';
      else if (roll === 1) status = 'leave';
      records[buildAttendanceKey(student.id, dateStr)] = status;
    }
  });

  return records;
}

export function generateSeedGrades(students) {
  const records = [];
  students.forEach((student, sIndex) => {
    student.courseIds.forEach((courseId, cIndex) => {
      const base = 65 + ((sIndex * 7 + cIndex * 13) % 32);
      records.push({
        id: `grade_${student.id}_${courseId}`,
        studentId: student.id,
        courseId,
        assignments: Math.min(100, base + 5),
        midExam: Math.min(100, base),
        finalExam: Math.min(100, base + ((sIndex + cIndex) % 10)),
      });
    });
  });
  return records;
}

export function generateSeedActivity() {
  const now = Date.now();
  const hoursAgo = (h) => new Date(now - h * 60 * 60 * 1000).toISOString();

  return [
    {
      id: 'seed-1',
      action: 'New student enrolled',
      detail: 'Sarah Chen joined Introduction to Computer Science',
      timestamp: hoursAgo(2),
    },
    {
      id: 'seed-2',
      action: 'Grade submitted',
      detail: 'Midterm scores posted for Calculus II',
      timestamp: hoursAgo(4),
    },
    {
      id: 'seed-3',
      action: 'Attendance marked',
      detail: 'Physics for Engineers lab session completed',
      timestamp: hoursAgo(6),
    },
    {
      id: 'seed-4',
      action: 'Course updated',
      detail: 'Syllabus revised for Data Structures & Algorithms',
      timestamp: hoursAgo(22),
    },
  ];
}
