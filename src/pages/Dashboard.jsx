import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BookOpen, ClipboardCheck, GraduationCap, Users } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { useStoredState } from '../hooks/useStoredState';
import { STORAGE_KEYS } from '../utils/storage';
import { formatNumber, getGreeting } from '../utils/formatters';
import { calculateAverage, calculateStudentGpa, getPassFailStatus } from '../utils/gradeUtils';
import { getActivity, formatRelativeTime } from '../utils/activityLog';
import styles from './Dashboard.module.css';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue}>{formatNumber(payload[0].value)} students</p>
    </div>
  );
}

function buildEnrollmentTrend(students) {
  const now = new Date();
  const months = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: date.toLocaleDateString('en-US', { month: 'short' }),
      date,
    });
  }

  return months.map((month, index) => {
    const cutoff =
      index < months.length - 1
        ? months[index + 1].date
        : new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const count = students.filter((student) => new Date(student.enrollmentDate) < cutoff).length;
    return { month: month.label, students: count };
  });
}

export default function Dashboard() {
  const [students] = useStoredState(STORAGE_KEYS.students, []);
  const [courses] = useStoredState(STORAGE_KEYS.courses, []);
  const [attendance] = useStoredState(STORAGE_KEYS.attendance, {});
  const [grades] = useStoredState(STORAGE_KEYS.grades, []);

  const greeting = useMemo(() => getGreeting(), []);

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const totalCourses = courses.length;

    const attendanceValues = Object.values(attendance);
    const presentCount = attendanceValues.filter((status) => status === 'present').length;
    const attendanceRate =
      attendanceValues.length > 0 ? Math.round((presentCount / attendanceValues.length) * 100) : 0;

    const studentsWithGrades = students.filter((student) =>
      grades.some((record) => record.studentId === student.id),
    );
    const avgGpa =
      studentsWithGrades.length > 0
        ? studentsWithGrades.reduce(
            (sum, student) => sum + calculateStudentGpa(grades.filter((r) => r.studentId === student.id)),
            0,
          ) / studentsWithGrades.length
        : 0;

    return { totalStudents, totalCourses, attendanceRate, avgGpa };
  }, [students, courses, attendance, grades]);

  const statCards = [
    { id: 'students', label: 'Total Students', value: formatNumber(stats.totalStudents), icon: Users },
    { id: 'courses', label: 'Active Courses', value: formatNumber(stats.totalCourses), icon: BookOpen },
    { id: 'attendance', label: 'Attendance Rate', value: `${stats.attendanceRate}%`, icon: ClipboardCheck },
    { id: 'grades', label: 'Average GPA', value: stats.avgGpa.toFixed(2), icon: GraduationCap },
  ];

  const enrollmentTrend = useMemo(() => buildEnrollmentTrend(students), [students]);

  const recentActivity = useMemo(
    () => getActivity().slice(0, 6),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [students, courses, attendance, grades],
  );

  const passCount = grades.filter(
    (record) =>
      getPassFailStatus(calculateAverage(record.assignments, record.midExam, record.finalExam)) === 'Pass',
  ).length;
  const passRate = grades.length > 0 ? Math.round((passCount / grades.length) * 100) : null;

  return (
    <div className={styles.dashboard}>
      <section className={styles.hero}>
        <GlassCard className={styles.heroCard} padding="large">
          <div className={styles.heroContent}>
            <div>
              <p className={styles.heroEyebrow}>Welcome back</p>
              <h2 className={styles.heroTitle}>{greeting}, Admin</h2>
              <p className={styles.heroDescription}>
                Monitor enrollment trends, track academic performance, and stay on top of
                daily operations across your institution.
              </p>
            </div>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeLabel}>System Status</span>
              <span className={styles.heroBadgeValue}>
                {passRate === null ? 'All systems operational' : `${passRate}% students passing`}
              </span>
            </div>
          </div>
        </GlassCard>
      </section>

      <section className={styles.statsGrid}>
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.id} className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.statIcon}>
                  <Icon size={20} />
                </div>
              </div>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statLabel}>{stat.label}</p>
            </GlassCard>
          );
        })}
      </section>

      <section className={styles.mainGrid}>
        <GlassCard className={styles.chartCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Enrollment Trend</h3>
              <p className={styles.sectionSubtitle}>Student growth over the last 7 months</p>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(99, 102, 241, 0.35)' }} />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#enrollmentGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className={styles.activityCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Recent Activity</h3>
              <p className={styles.sectionSubtitle}>Latest updates across the system</p>
            </div>
          </div>

          {recentActivity.length === 0 ? (
            <p className={styles.emptyActivity}>No recent activity yet.</p>
          ) : (
            <ul className={styles.activityList}>
              {recentActivity.map((activity) => (
                <li key={activity.id} className={styles.activityItem}>
                  <span className={styles.activityDot} />
                  <div className={styles.activityContent}>
                    <p className={styles.activityAction}>{activity.action}</p>
                    <p className={styles.activityDetail}>{activity.detail}</p>
                  </div>
                  <time className={styles.activityTime}>{formatRelativeTime(activity.timestamp)}</time>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </section>
    </div>
  );
}
