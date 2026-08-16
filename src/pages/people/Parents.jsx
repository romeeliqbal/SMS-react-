import { Users } from 'lucide-react';
import ModulePage from '../shared/ModulePage';
import { useData } from '../../context/DataContext';

export default function Parents() {
  const { parents } = useData();

  return (
    <ModulePage
      title="Parents & Guardians"
      subtitle="Guardian contacts and linked student records"
      data={parents}
      searchKeys={['name', 'relation', 'phone', 'email']}
      stats={[
        { label: 'Total Parents', value: parents.length, icon: Users },
        {
          label: 'Linked Students',
          value: parents.reduce((sum, p) => sum + (p.linkedStudentIds?.length || 0), 0),
        },
      ]}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'relation', label: 'Relation' },
        { key: 'phone', label: 'Phone' },
        {
          key: 'linkedStudentIds',
          label: 'Linked Students',
          render: (row) => `${row.linkedStudentIds?.length || 0} student${row.linkedStudentIds?.length === 1 ? '' : 's'}`,
        },
      ]}
    />
  );
}
