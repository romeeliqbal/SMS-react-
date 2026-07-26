import { useMemo, useState } from 'react';
import { BookOpen, Pencil, Plus, Trash2, Users } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import SearchBar from '../components/common/SearchBar';
import ProgressBar from '../components/common/ProgressBar';
import EmptyState from '../components/common/EmptyState';
import { TextInput, SelectInput, TextareaInput } from '../components/common/FormField';
import { useStoredState } from '../hooks/useStoredState';
import { STORAGE_KEYS, readStorage, writeStorage } from '../utils/storage';
import { generateId } from '../utils/idGenerators';
import { validateCourse, hasErrors } from '../utils/validators';
import { logActivity } from '../utils/activityLog';
import styles from './Courses.module.css';

const emptyForm = {
  code: '',
  name: '',
  instructor: '',
  description: '',
  credits: 3,
  capacity: 30,
  status: 'Active',
};

export default function Courses() {
  const [courses, setCourses] = useStoredState(STORAGE_KEYS.courses, []);
  const [students] = useStoredState(STORAGE_KEYS.students, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [deletingCourse, setDeletingCourse] = useState(null);

  const enrollmentCounts = useMemo(() => {
    const counts = {};
    students.forEach((student) => {
      student.courseIds.forEach((courseId) => {
        counts[courseId] = (counts[courseId] || 0) + 1;
      });
    });
    return counts;
  }, [students]);

  const filteredCourses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesTerm =
        !term ||
        course.name.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term) ||
        course.instructor.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
      return matchesTerm && matchesStatus;
    });
  }, [courses, searchTerm, statusFilter]);

  function openAddForm() {
    setEditingId(null);
    setFormValues(emptyForm);
    setFormErrors({});
    setIsFormOpen(true);
  }

  function openEditForm(course) {
    setEditingId(course.id);
    setFormValues({
      code: course.code,
      name: course.name,
      instructor: course.instructor,
      description: course.description,
      credits: course.credits,
      capacity: course.capacity,
      status: course.status,
    });
    setFormErrors({});
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const errors = validateCourse(formValues, courses, editingId);
    if (hasErrors(errors)) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      ...formValues,
      code: formValues.code.trim().toUpperCase(),
      name: formValues.name.trim(),
      instructor: formValues.instructor.trim(),
      credits: Number(formValues.credits),
      capacity: Number(formValues.capacity),
    };

    if (editingId) {
      setCourses((prev) =>
        prev.map((course) => (course.id === editingId ? { ...course, ...payload } : course)),
      );
      logActivity('Course updated', `${payload.name} details were updated`);
    } else {
      setCourses((prev) => [{ id: generateId('course'), ...payload }, ...prev]);
      logActivity('Course added', `${payload.name} (${payload.code}) was created`);
    }

    closeForm();
  }

  function confirmDelete() {
    if (!deletingCourse) return;
    const courseId = deletingCourse.id;

    setCourses((prev) => prev.filter((course) => course.id !== courseId));

    const storedStudents = readStorage(STORAGE_KEYS.students, []);
    writeStorage(
      STORAGE_KEYS.students,
      storedStudents.map((student) => ({
        ...student,
        courseIds: student.courseIds.filter((id) => id !== courseId),
      })),
    );

    const grades = readStorage(STORAGE_KEYS.grades, []);
    writeStorage(
      STORAGE_KEYS.grades,
      grades.filter((record) => record.courseId !== courseId),
    );

    logActivity('Course removed', `${deletingCourse.name} was deleted`);
    setDeletingCourse(null);
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name, code, or instructor..."
        />

        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
        </select>

        <Button variant="primary" icon={Plus} onClick={openAddForm}>
          Add Course
        </Button>
      </div>

      {filteredCourses.length === 0 ? (
        <GlassCard>
          <EmptyState
            icon={BookOpen}
            title="No courses found"
            description="Try adjusting your search or filters, or add a new course."
            action={
              <Button variant="secondary" icon={Plus} onClick={openAddForm}>
                Add Course
              </Button>
            }
          />
        </GlassCard>
      ) : (
        <div className={styles.grid}>
          {filteredCourses.map((course) => {
            const enrolled = enrollmentCounts[course.id] || 0;
            const isFull = enrolled >= course.capacity;

            return (
              <GlassCard key={course.id} className={styles.courseCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.courseCode}>{course.code}</span>
                  <Badge>{course.status}</Badge>
                </div>

                <h3 className={styles.courseName}>{course.name}</h3>
                <p className={styles.instructor}>{course.instructor}</p>
                <p className={styles.description}>{course.description}</p>

                <div className={styles.meta}>
                  <span>{course.credits} credits</span>
                  <span className={isFull ? styles.fullLabel : undefined}>
                    <Users size={13} /> {enrolled}/{course.capacity}
                  </span>
                </div>

                <ProgressBar value={enrolled} max={course.capacity} tone={isFull ? 'warning' : 'default'} />

                <div className={styles.cardActions}>
                  <Button variant="secondary" size="small" icon={Pencil} onClick={() => openEditForm(course)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    icon={Trash2}
                    onClick={() => setDeletingCourse(course)}
                  >
                    Delete
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editingId ? 'Edit Course' : 'Add Course'}
        size="large"
        footer={
          <>
            <Button variant="ghost" onClick={closeForm}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingId ? 'Save Changes' : 'Add Course'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <TextInput
              id="courseName"
              label="Course Name"
              required
              value={formValues.name}
              error={formErrors.name}
              onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
            />
            <TextInput
              id="courseCode"
              label="Course Code"
              required
              placeholder="e.g. CS101"
              value={formValues.code}
              error={formErrors.code}
              onChange={(e) => setFormValues({ ...formValues, code: e.target.value })}
            />
            <TextInput
              id="instructor"
              label="Instructor"
              required
              value={formValues.instructor}
              error={formErrors.instructor}
              onChange={(e) => setFormValues({ ...formValues, instructor: e.target.value })}
            />
            <SelectInput
              id="courseStatus"
              label="Status"
              value={formValues.status}
              onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </SelectInput>
            <TextInput
              id="credits"
              type="number"
              min="1"
              max="10"
              label="Credits"
              required
              value={formValues.credits}
              error={formErrors.credits}
              onChange={(e) => setFormValues({ ...formValues, credits: e.target.value })}
            />
            <TextInput
              id="capacity"
              type="number"
              min="1"
              label="Capacity"
              required
              value={formValues.capacity}
              error={formErrors.capacity}
              onChange={(e) => setFormValues({ ...formValues, capacity: e.target.value })}
            />
          </div>

          <TextareaInput
            id="description"
            label="Description"
            value={formValues.description}
            onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
          />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingCourse)}
        onClose={() => setDeletingCourse(null)}
        onConfirm={confirmDelete}
        title="Delete Course"
        message={
          deletingCourse
            ? `Are you sure you want to delete ${deletingCourse.name}? Students will be unenrolled and related grade records removed. This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
      />
    </div>
  );
}
