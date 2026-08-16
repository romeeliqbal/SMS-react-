import { GraduationCap } from 'lucide-react';
import ModulePage, { StatusBadge } from '../shared/ModulePage';
import { useData } from '../../context/DataContext';

export default function Teachers() {
  const { teachers } = useData();

  return (
    <ModulePage
      title="Teachers"
      subtitle="Faculty directory and teaching assignments"
      data={teachers}
      searchKeys={['teacherCode', 'fullName', 'designation', 'departmentName']}
      stats={[
        { label: 'Total Teachers', value: teachers.length, icon: GraduationCap },
        { label: 'Active', value: teachers.filter((t) => t.status === 'Active').length },
        { label: 'Departments', value: new Set(teachers.map((t) => t.departmentId)).size },
      ]}
      columns={[
        { key: 'teacherCode', label: 'Code' },
        { key: 'fullName', label: 'Name' },
        { key: 'designation', label: 'Designation' },
        { key: 'departmentName', label: 'Department' },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
      ]}
    />
  );
}
