import { BookOpen } from 'lucide-react';
import ModulePage, { StatusBadge } from '../shared/ModulePage';
import { useData } from '../../context/DataContext';

export default function Subjects() {
  const { subjects } = useData();

  return (
    <ModulePage
      title="Subjects"
      subtitle="Curriculum subjects and assigned teachers"
      data={subjects}
      searchKeys={['code', 'name', 'className', 'teacherName']}
      stats={[
        { label: 'Total Subjects', value: subjects.length, icon: BookOpen },
        { label: 'Active', value: subjects.filter((s) => s.status === 'Active').length },
        { label: 'Classes Covered', value: new Set(subjects.map((s) => s.classId)).size },
      ]}
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Subject' },
        { key: 'className', label: 'Class' },
        { key: 'teacherName', label: 'Teacher' },
        { key: 'totalMarks', label: 'Total Marks' },
      ]}
    />
  );
}
