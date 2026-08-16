import { Briefcase } from 'lucide-react';
import ModulePage, { StatusBadge } from '../shared/ModulePage';
import { useData } from '../../context/DataContext';

export default function Staff() {
  const { staff } = useData();

  return (
    <ModulePage
      title="Non-Teaching Staff"
      subtitle="Administrative and support personnel"
      data={staff}
      searchKeys={['staffCode', 'fullName', 'designation', 'department']}
      stats={[
        { label: 'Total Staff', value: staff.length, icon: Briefcase },
        { label: 'Active', value: staff.filter((s) => s.status === 'Active').length },
        { label: 'Departments', value: new Set(staff.map((s) => s.department)).size },
      ]}
      columns={[
        { key: 'staffCode', label: 'Code' },
        { key: 'fullName', label: 'Name' },
        { key: 'designation', label: 'Designation' },
        { key: 'department', label: 'Department' },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
      ]}
    />
  );
}
