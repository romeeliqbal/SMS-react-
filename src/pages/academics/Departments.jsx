import { Building2 } from 'lucide-react';
import ModulePage, { StatusBadge } from '../shared/ModulePage';
import { useData } from '../../context/DataContext';

export default function Departments() {
  const { departments } = useData();

  return (
    <ModulePage
      title="Departments"
      subtitle="Academic departments and faculty structure"
      data={departments}
      searchKeys={['name', 'code', 'headName']}
      stats={[
        { label: 'Total Departments', value: departments.length, icon: Building2 },
        { label: 'Active', value: departments.filter((d) => d.status === 'Active').length },
        { label: 'Total Faculty', value: departments.reduce((sum, d) => sum + (d.facultyCount || 0), 0) },
      ]}
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Department' },
        { key: 'headName', label: 'Head of Department' },
        { key: 'facultyCount', label: 'Faculty' },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
      ]}
    />
  );
}
