import { CalendarClock } from 'lucide-react';
import ModulePage from '../shared/ModulePage';
import { useData } from '../../context/DataContext';

export default function Timetable() {
  const { timetable } = useData();

  return (
    <ModulePage
      title="Class Timetable"
      subtitle="Weekly period schedule by class"
      data={timetable}
      searchKeys={['day', 'subjectName', 'teacherName', 'room']}
      stats={[
        { label: 'Total Periods', value: timetable.length, icon: CalendarClock },
        { label: 'Days Covered', value: new Set(timetable.map((t) => t.day)).size },
        { label: 'Subjects', value: new Set(timetable.map((t) => t.subjectName)).size },
      ]}
      columns={[
        { key: 'day', label: 'Day' },
        { key: 'period', label: 'Period' },
        { key: 'startTime', label: 'Start' },
        { key: 'endTime', label: 'End' },
        { key: 'subjectName', label: 'Subject' },
        { key: 'teacherName', label: 'Teacher' },
        { key: 'room', label: 'Room' },
      ]}
    />
  );
}
