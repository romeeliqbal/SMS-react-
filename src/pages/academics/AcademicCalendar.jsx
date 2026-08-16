import { useMemo } from 'react';
import { CalendarDays } from 'lucide-react';
import Badge from '../../components/common/Badge';
import ModulePage from '../shared/ModulePage';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/formatters';

export default function AcademicCalendar() {
  const { events, exams } = useData();

  const calendarEntries = useMemo(() => {
    const eventRows = events.map((e) => ({
      id: e.id,
      title: e.title,
      type: 'Event',
      category: e.category,
      startDate: e.date,
      endDate: e.endDate || e.date,
      location: e.location,
      status: e.status,
    }));
    const examRows = exams.map((e) => ({
      id: e.id,
      title: e.name,
      type: 'Exam',
      category: e.term,
      startDate: e.startDate,
      endDate: e.endDate,
      location: 'Examination Block',
      status: e.status,
    }));
    return [...eventRows, ...examRows].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate),
    );
  }, [events, exams]);

  return (
    <ModulePage
      title="Academic Calendar"
      subtitle="Events, examinations, and key academic dates"
      data={calendarEntries}
      searchKeys={['title', 'type', 'category', 'status']}
      stats={[
        { label: 'Total Entries', value: calendarEntries.length, icon: CalendarDays },
        { label: 'Events', value: events.length },
        { label: 'Examinations', value: exams.length },
      ]}
      columns={[
        { key: 'title', label: 'Title' },
        {
          key: 'type',
          label: 'Type',
          render: (row) => <Badge tone={row.type === 'Exam' ? 'warning' : 'info'}>{row.type}</Badge>,
        },
        { key: 'category', label: 'Category' },
        { key: 'startDate', label: 'Start Date', render: (row) => formatDate(row.startDate) },
        { key: 'endDate', label: 'End Date', render: (row) => formatDate(row.endDate) },
        { key: 'location', label: 'Location' },
        { key: 'status', label: 'Status' },
      ]}
    />
  );
}
