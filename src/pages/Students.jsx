import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Pencil, Plus, Trash2, Users } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import { TextInput, SelectInput } from '../components/common/FormField';
import { useStoredState } from '../hooks/useStoredState';
import { STORAGE_KEYS, readStorage, writeStorage } from '../utils/storage';
import { generateId, generateStudentCode, getAvatarColor, getInitials } from '../utils/idGenerators';
import { validateStudent, hasErrors } from '../utils/validators';
import { logActivity } from '../utils/activityLog';
import styles from './Students.module.css';

const PAGE_SIZE = 8;

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  studentCode: '',
  courseIds: [],
  status: 'Active',
  enrollmentDate: new Date().toISOString().slice(0, 10),
};

export default function Students() {
  const [students, setStudents] = useStoredState(STORAGE_KEYS.students, []);
  const [courses] = useStoredState(STORAGE_KEYS.courses, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [sortKey, setSortKey] = useState('firstName');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const [viewingStudent, setViewingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  const courseMap = useMemo(() => {
    const map = {};
    courses.forEach((course) => {
      map[course.id] = course;
    });
    return map;
  }, [courses]);

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let result = students.filter((student) => {
      const matchesTerm =
        !term ||
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.studentCode.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      const matchesCourse = courseFilter === 'all' || student.courseIds.includes(courseFilter);

      return matchesTerm && matchesStatus && matchesCourse;
    });

    result = [...result].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (sortKey === 'firstName') {
        aVal = `${a.firstName} ${a.lastName}`;
        bVal = `${b.firstName} ${b.lastName}`;
      }

      if (typeof aVal === 'string') {
        const cmp = aVal.localeCompare(bVal);
        return sortDir === 'asc' ? cmp : -cmp;
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [students, searchTerm, statusFilter, courseFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  }

  function sortIcon(key) {
    if (sortKey !== key) return <ArrowUpDown size={13} />;
    return sortDir === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
  }

  function openAddForm() {
    setEditingId(null);
    setFormValues({ ...emptyForm, studentCode: generateStudentCode(students) });
    setFormErrors({});
    setIsFormOpen(true);
  }

  function openEditForm(student) {
    setEditingId(student.id);
    setFormValues({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      studentCode: student.studentCode,
      courseIds: student.courseIds,
      status: student.status,
      enrollmentDate: student.enrollmentDate,
    });
    setFormErrors({});
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
  }

  function toggleCourseSelection(courseId) {
    setFormValues((prev) => {
      const has = prev.courseIds.includes(courseId);
      return {
        ...prev,
        courseIds: has ? prev.courseIds.filter((id) => id !== courseId) : [...prev.courseIds, courseId],
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const errors = validateStudent(formValues, students, editingId);
    if (hasErrors(errors)) {
      setFormErrors(errors);
      return;
    }

    const fullName = `${formValues.firstName.trim()} ${formValues.lastName.trim()}`;

    if (editingId) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editingId
            ? {
                ...student,
                ...formValues,
                firstName: formValues.firstName.trim(),
                lastName: formValues.lastName.trim(),
                email: formValues.email.trim(),
                initials: getInitials(formValues.firstName, formValues.lastName),
              }
            : student,
        ),
      );
      logActivity('Student updated', `${fullName}'s profile was updated`);
    } else {
      const newStudent = {
        id: generateId('student'),
        ...formValues,
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        email: formValues.email.trim(),
        avatarColor: getAvatarColor(fullName),
        initials: getInitials(formValues.firstName, formValues.lastName),
      };
      setStudents((prev) => [newStudent, ...prev]);
      const firstCourseName = courseMap[formValues.courseIds[0]]?.name || 'a course';
      logActivity('New student enrolled', `${fullName} joined ${firstCourseName}`);
    }

    closeForm();
  }

  function confirmDelete() {
    if (!deletingStudent) return;
    const studentId = deletingStudent.id;
    const fullName = `${deletingStudent.firstName} ${deletingStudent.lastName}`;

    setStudents((prev) => prev.filter((student) => student.id !== studentId));

    const attendance = readStorage(STORAGE_KEYS.attendance, {});
    const nextAttendance = Object.fromEntries(
      Object.entries(attendance).filter(([key]) => !key.startsWith(`${studentId}_`)),
    );
    writeStorage(STORAGE_KEYS.attendance, nextAttendance);

    const grades = readStorage(STORAGE_KEYS.grades, []);
    writeStorage(
      STORAGE_KEYS.grades,
      grades.filter((record) => record.studentId !== studentId),
    );

    logActivity('Student removed', `${fullName} was removed from the system`);
    setDeletingStudent(null);
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <SearchBar
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setPage(1);
          }}
          placeholder="Search by name, email, or ID..."
        />

        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Graduated">Graduated</option>
        </select>

        <select
          className={styles.filterSelect}
          value={courseFilter}
          onChange={(e) => {
            setCourseFilter(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by course"
        >
          <option value="all">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code}
            </option>
          ))}
        </select>

        <Button variant="primary" icon={Plus} onClick={openAddForm}>
          Add Student
        </Button>
      </div>

      <GlassCard padding="none" className={styles.tableCard}>
        {paginatedStudents.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students found"
            description="Try adjusting your search or filters, or add a new student."
            action={
              <Button variant="secondary" icon={Plus} onClick={openAddForm}>
                Add Student
              </Button>
            }
          />
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <button type="button" className={styles.sortButton} onClick={() => toggleSort('firstName')}>
                      Student {sortIcon('firstName')}
                    </button>
                  </th>
                  <th>
                    <button type="button" className={styles.sortButton} onClick={() => toggleSort('studentCode')}>
                      ID {sortIcon('studentCode')}
                    </button>
                  </th>
                  <th className={styles.hideOnMobile}>Courses</th>
                  <th>Status</th>
                  <th className={styles.hideOnMobile}>
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => toggleSort('enrollmentDate')}
                    >
                      Enrolled {sortIcon('enrollmentDate')}
                    </button>
                  </th>
                  <th className={styles.actionsHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className={styles.studentCell}>
                        <Avatar initials={student.initials} color={student.avatarColor} />
                        <div>
                          <p className={styles.studentName}>
                            {student.firstName} {student.lastName}
                          </p>
                          <p className={styles.studentEmail}>{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.mono}>{student.studentCode}</td>
                    <td className={styles.hideOnMobile}>
                      <span className={styles.courseCount}>
                        {student.courseIds.length} course{student.courseIds.length === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td>
                      <Badge>{student.status}</Badge>
                    </td>
                    <td className={styles.hideOnMobile}>{student.enrollmentDate}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={() => setViewingStudent(student)}
                          aria-label={`View ${student.firstName} ${student.lastName}`}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={() => openEditForm(student)}
                          aria-label={`Edit ${student.firstName} ${student.lastName}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className={[styles.actionButton, styles.danger].join(' ')}
                          onClick={() => setDeletingStudent(student)}
                          aria-label={`Delete ${student.firstName} ${student.lastName}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {paginatedStudents.length > 0 && (
          <div className={styles.paginationWrapper}>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={filteredStudents.length}
              pageSize={PAGE_SIZE}
            />
          </div>
        )}
      </GlassCard>

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editingId ? 'Edit Student' : 'Add Student'}
        size="large"
        footer={
          <>
            <Button variant="ghost" onClick={closeForm}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingId ? 'Save Changes' : 'Add Student'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <TextInput
              id="firstName"
              label="First Name"
              required
              value={formValues.firstName}
              error={formErrors.firstName}
              onChange={(e) => setFormValues({ ...formValues, firstName: e.target.value })}
            />
            <TextInput
              id="lastName"
              label="Last Name"
              required
              value={formValues.lastName}
              error={formErrors.lastName}
              onChange={(e) => setFormValues({ ...formValues, lastName: e.target.value })}
            />
            <TextInput
              id="email"
              type="email"
              label="Email"
              required
              value={formValues.email}
              error={formErrors.email}
              onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
            />
            <TextInput
              id="phone"
              label="Phone"
              value={formValues.phone}
              error={formErrors.phone}
              placeholder="+1 555-0100"
              onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
            />
            <TextInput
              id="studentCode"
              label="Student ID"
              required
              value={formValues.studentCode}
              error={formErrors.studentCode}
              onChange={(e) => setFormValues({ ...formValues, studentCode: e.target.value })}
            />
            <TextInput
              id="enrollmentDate"
              type="date"
              label="Enrollment Date"
              required
              value={formValues.enrollmentDate}
              error={formErrors.enrollmentDate}
              onChange={(e) => setFormValues({ ...formValues, enrollmentDate: e.target.value })}
            />
            <SelectInput
              id="status"
              label="Status"
              value={formValues.status}
              onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
            </SelectInput>
          </div>

          <div className={styles.fieldFull}>
            <span className={styles.courseLabel}>
              Courses <span className={styles.required}>*</span>
            </span>
            <div className={styles.courseGrid}>
              {courses.map((course) => (
                <label key={course.id} className={styles.courseCheckbox}>
                  <input
                    type="checkbox"
                    checked={formValues.courseIds.includes(course.id)}
                    onChange={() => toggleCourseSelection(course.id)}
                  />
                  <span>{course.code} — {course.name}</span>
                </label>
              ))}
            </div>
            {formErrors.courseIds && <p className={styles.courseError}>{formErrors.courseIds}</p>}
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(viewingStudent)}
        onClose={() => setViewingStudent(null)}
        title="Student Profile"
      >
        {viewingStudent && (
          <div className={styles.profile}>
            <div className={styles.profileHeader}>
              <Avatar
                initials={viewingStudent.initials}
                color={viewingStudent.avatarColor}
                size={56}
              />
              <div>
                <h3 className={styles.profileName}>
                  {viewingStudent.firstName} {viewingStudent.lastName}
                </h3>
                <p className={styles.profileMeta}>{viewingStudent.studentCode}</p>
              </div>
              <Badge>{viewingStudent.status}</Badge>
            </div>

            <dl className={styles.profileList}>
              <div>
                <dt>Email</dt>
                <dd>{viewingStudent.email}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{viewingStudent.phone || 'Not provided'}</dd>
              </div>
              <div>
                <dt>Enrollment Date</dt>
                <dd>{viewingStudent.enrollmentDate}</dd>
              </div>
              <div>
                <dt>Courses</dt>
                <dd>
                  {viewingStudent.courseIds.length === 0
                    ? 'No courses'
                    : viewingStudent.courseIds
                        .map((id) => courseMap[id]?.code)
                        .filter(Boolean)
                        .join(', ')}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingStudent)}
        onClose={() => setDeletingStudent(null)}
        onConfirm={confirmDelete}
        title="Delete Student"
        message={
          deletingStudent
            ? `Are you sure you want to delete ${deletingStudent.firstName} ${deletingStudent.lastName}? This will also remove their attendance and grade records. This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
      />
    </div>
  );
}
