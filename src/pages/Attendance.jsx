import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Clock3 } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { SelectInput } from '../components/common/FormField';
import { useStoredState } from '../hooks/useStoredState';
import { STORAGE_KEYS } from '../utils/storage';
import { logActivity } from '../utils/activityLog';
import styles from './Attendance.module.css';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STATUS_CONFIG = {
  present: { label: 'Present', className: 'present', icon: Check },
  absent: { label: 'Absent', className: 'absent', icon: X },
  leave: { label: 'Leave', className: 'leave', icon: Clock3 },
};

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function buildAttendanceKey(studentId, dateStr) {
  return `${studentId}_${dateStr}`;
}

export default function Attendance() {
  const [students] = useStoredState(STORAGE_KEYS.students, []);
  const [attendance, setAttendance] = useStoredState(STORAGE_KEYS.attendance, {});

  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(null);

  const activeStudentId = selectedStudentId || students[0]?.id || '';
  const activeStudent = students.find((student) => student.id === activeStudentId);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const calendarCells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }
    return cells;
  }, [year, month]);

  const monthSummary = useMemo(() => {
    if (!activeStudentId) {
      return { present: 0, absent: 0, leave: 0, total: 0, percentage: 0 };
    }

    let present = 0;
    let absent = 0;
    let leave = 0;

    calendarCells.forEach((date) => {
      if (!date) return;
      const status = attendance[buildAttendanceKey(activeStudentId, toDateKey(date))];
      if (status === 'present') present += 1;
      else if (status === 'absent') absent += 1;
      else if (status === 'leave') leave += 1;
    });

    const total = present + absent + leave;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { present, absent, leave, total, percentage };
  }, [attendance, activeStudentId, calendarCells]);

  function changeMonth(delta) {
    setViewDate(new Date(year, month + delta, 1));
    setSelectedDate(null);
  }

  function markAttendance(status) {
    if (!selectedDate || !activeStudentId) return;
    const dateStr = toDateKey(selectedDate);
    const key = buildAttendanceKey(activeStudentId, dateStr);

    setAttendance((prev) => {
      const next = { ...prev };
      if (next[key] === status) {
        delete next[key];
      } else {
        next[key] = status;
      }
      return next;
    });

    if (activeStudent) {
      logActivity(
        'Attendance marked',
        `${activeStudent.firstName} ${activeStudent.lastName} marked ${STATUS_CONFIG[status].label} for ${dateStr}`,
      );
    }
  }

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = toDateKey(new Date());

  if (students.length === 0) {
    return (
      <GlassCard>
        <p className={styles.emptyMessage}>Add a student first to start tracking attendance.</p>
      </GlassCard>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <GlassCard className={styles.studentPicker}>
          <SelectInput
            id="attendanceStudent"
            label="Student"
            value={activeStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              setSelectedDate(null);
            }}
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName} ({student.studentCode})
              </option>
            ))}
          </SelectInput>

          {activeStudent && (
            <div className={styles.studentInfo}>
              <Avatar initials={activeStudent.initials} color={activeStudent.avatarColor} size={44} />
              <div>
                <p className={styles.studentName}>
                  {activeStudent.firstName} {activeStudent.lastName}
                </p>
                <p className={styles.studentCode}>{activeStudent.studentCode}</p>
              </div>
            </div>
          )}
        </GlassCard>

        <div className={styles.summaryGrid}>
          <GlassCard className={styles.summaryCard}>
            <p className={styles.summaryValue}>{monthSummary.percentage}%</p>
            <p className={styles.summaryLabel}>Attendance Rate</p>
          </GlassCard>
          <GlassCard className={styles.summaryCard}>
            <p className={[styles.summaryValue, styles.presentText].join(' ')}>{monthSummary.present}</p>
            <p className={styles.summaryLabel}>Present</p>
          </GlassCard>
          <GlassCard className={styles.summaryCard}>
            <p className={[styles.summaryValue, styles.absentText].join(' ')}>{monthSummary.absent}</p>
            <p className={styles.summaryLabel}>Absent</p>
          </GlassCard>
          <GlassCard className={styles.summaryCard}>
            <p className={[styles.summaryValue, styles.leaveText].join(' ')}>{monthSummary.leave}</p>
            <p className={styles.summaryLabel}>Leave</p>
          </GlassCard>
        </div>
      </div>

      <GlassCard>
        <div className={styles.calendarHeader}>
          <h3 className={styles.monthLabel}>{monthLabel}</h3>
          <div className={styles.monthNav}>
            <button type="button" className={styles.navButton} onClick={() => changeMonth(-1)} aria-label="Previous month">
              <ChevronLeft size={18} />
            </button>
            <button type="button" className={styles.navButton} onClick={() => changeMonth(1)} aria-label="Next month">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className={styles.weekdayRow}>
          {WEEKDAY_LABELS.map((day) => (
            <span key={day} className={styles.weekdayLabel}>
              {day}
            </span>
          ))}
        </div>

        <div className={styles.calendarGrid}>
          {calendarCells.map((date, index) => {
            if (!date) {
              return <div key={`blank-${index}`} className={styles.emptyCell} />;
            }

            const dateStr = toDateKey(date);
            const status = attendance[buildAttendanceKey(activeStudentId, dateStr)];
            const isSelected = selectedDate && toDateKey(selectedDate) === dateStr;
            const isToday = dateStr === today;
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            const cellClassNames = [
              styles.dayCell,
              status ? styles[status] : '',
              isSelected ? styles.selected : '',
              isToday ? styles.today : '',
              isWeekend ? styles.weekend : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={dateStr}
                type="button"
                className={cellClassNames}
                onClick={() => setSelectedDate(date)}
                aria-label={`${dateStr}${status ? `, marked ${STATUS_CONFIG[status].label}` : ''}`}
                aria-pressed={isSelected}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <div className={styles.markPanel}>
            <span className={styles.markLabel}>
              Mark {toDateKey(selectedDate)} as:
            </span>
            <div className={styles.markButtons}>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                const isActive =
                  attendance[buildAttendanceKey(activeStudentId, toDateKey(selectedDate))] === key;
                return (
                  <Button
                    key={key}
                    variant={isActive ? 'primary' : 'secondary'}
                    size="small"
                    icon={Icon}
                    onClick={() => markAttendance(key)}
                  >
                    {config.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={[styles.legendDot, styles.present].join(' ')} /> Present
          </span>
          <span className={styles.legendItem}>
            <span className={[styles.legendDot, styles.absent].join(' ')} /> Absent
          </span>
          <span className={styles.legendItem}>
            <span className={[styles.legendDot, styles.leave].join(' ')} /> Leave
          </span>
        </div>
      </GlassCard>
    </div>
  );
}
