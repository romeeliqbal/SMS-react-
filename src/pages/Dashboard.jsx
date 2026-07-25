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
import {
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Users,
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import {
  dashboardStats,
  enrollmentTrend,
  recentActivity,
} from '../data/dashboardStats';
import { formatNumber, getGreeting } from '../utils/formatters';
import styles from './Dashboard.module.css';

const statIcons = {
  students: Users,
  courses: BookOpen,
  attendance: ClipboardCheck,
  grades: GraduationCap,
};

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

export default function Dashboard() {
  const greeting = useMemo(() => getGreeting(), []);

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
              <span className={styles.heroBadgeValue}>All systems operational</span>
            </div>
          </div>
        </GlassCard>
      </section>

      <section className={styles.statsGrid}>
        {dashboardStats.map((stat) => {
          const Icon = statIcons[stat.id];

          return (
            <GlassCard key={stat.id} className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.statIcon}>
                  <Icon size={20} />
                </div>
                <span className={styles.statChange}>
                  <ArrowUpRight size={14} />
                  {stat.change}
                </span>
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

          <ul className={styles.activityList}>
            {recentActivity.map((activity) => (
              <li key={activity.id} className={styles.activityItem}>
                <span className={styles.activityDot} />
                <div className={styles.activityContent}>
                  <p className={styles.activityAction}>{activity.action}</p>
                  <p className={styles.activityDetail}>{activity.detail}</p>
                </div>
                <time className={styles.activityTime}>{activity.time}</time>
              </li>
            ))}
          </ul>
        </GlassCard>
      </section>
    </div>
  );
}
