import { School } from 'lucide-react';
import ModulePage from '../shared/ModulePage';
import { useData } from '../../context/DataContext';

export default function Classes() {
  const { classes } = useData();

  return (
    <ModulePage
      title="Classes & Sections"
      subtitle="Classrooms, sections, and class teachers"
      data={classes}
      searchKeys={['name', 'section', 'classTeacherName', 'roomNumber']}
      stats={[
        { label: 'Total Classes', value: classes.length, icon: School },
        { label: 'Total Capacity', value: classes.reduce((sum, c) => sum + (c.capacity || 0), 0) },
        { label: 'Matriculation', value: classes.filter((c) => c.academicLevel === 'Matriculation').length },
      ]}
      columns={[
        { key: 'name', label: 'Class' },
        { key: 'section', label: 'Section' },
        { key: 'classTeacherName', label: 'Class Teacher' },
        { key: 'roomNumber', label: 'Room' },
        { key: 'capacity', label: 'Capacity' },
      ]}
    />
  );
}
