import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Megaphone, School, Search, User, Users, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import styles from './GlobalSearchModal.module.css';

export default function GlobalSearchModal({ isOpen, onClose, query, setQuery }) {
  const navigate = useNavigate();
  const { students, teachers, classes, subjects, exams, announcements } = useData();

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return { students: [], teachers: [], classes: [], subjects: [], exams: [], announcements: [] };

    return {
      students: students.filter((s) =>
        s.fullName.toLowerCase().includes(term) ||
        s.studentCode.toLowerCase().includes(term) ||
        s.rollNo.toLowerCase().includes(term),
      ).slice(0, 4),
      teachers: teachers.filter((t) =>
        t.fullName.toLowerCase().includes(term) ||
        t.teacherCode.toLowerCase().includes(term) ||
        t.departmentName.toLowerCase().includes(term),
      ).slice(0, 4),
      classes: classes.filter((c) =>
        c.name.toLowerCase().includes(term) ||
        c.section.toLowerCase().includes(term) ||
        c.classTeacherName.toLowerCase().includes(term),
      ).slice(0, 3),
      subjects: subjects.filter((s) =>
        s.name.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term),
      ).slice(0, 3),
      exams: exams.filter((e) =>
        e.name.toLowerCase().includes(term) ||
        e.term.toLowerCase().includes(term),
      ).slice(0, 3),
      announcements: announcements.filter((a) =>
        a.title.toLowerCase().includes(term) ||
        a.category.toLowerCase().includes(term),
      ).slice(0, 3),
    };
  }, [query, students, teachers, classes, subjects, exams, announcements]);

  const totalCount =
    results.students.length +
    results.teachers.length +
    results.classes.length +
    results.subjects.length +
    results.exams.length +
    results.announcements.length;

  if (!isOpen) return null;

  function handleSelect(path) {
    navigate(path);
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputBar}>
          <Search size={20} className={styles.icon} />
          <input
            type="text"
            className={styles.input}
            placeholder="Search students, teachers, classes, subjects, exams..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {!query.trim() ? (
            <div className={styles.hintState}>
              <p>Type at least one character to search across institution records...</p>
              <div className={styles.quickTags}>
                <button type="button" onClick={() => setQuery('Romeel')}>Romeel (Student)</button>
                <button type="button" onClick={() => setQuery('Fatima')}>Fatima (Teacher)</button>
                <button type="button" onClick={() => setQuery('Grade 10')}>Grade 10</button>
                <button type="button" onClick={() => setQuery('Midterm')}>Midterm Exam</button>
              </div>
            </div>
          ) : totalCount === 0 ? (
            <div className={styles.emptyState}>No matching records found for "{query}".</div>
          ) : (
            <div className={styles.resultsList}>
              {results.students.length > 0 && (
                <div className={styles.group}>
                  <div className={styles.groupHeader}><Users size={14} /> Students</div>
                  {results.students.map((st) => (
                    <div
                      key={st.id}
                      className={styles.item}
                      onClick={() => handleSelect(`/people/students/${st.id}`)}
                    >
                      <div>
                        <strong>{st.fullName}</strong> ({st.rollNo}) — {st.className} {st.section}
                      </div>
                      <span className={styles.badge}>{st.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.teachers.length > 0 && (
                <div className={styles.group}>
                  <div className={styles.groupHeader}><User size={14} /> Teachers</div>
                  {results.teachers.map((t) => (
                    <div
                      key={t.id}
                      className={styles.item}
                      onClick={() => handleSelect('/people/teachers')}
                    >
                      <div>
                        <strong>{t.fullName}</strong> — {t.designation}
                      </div>
                      <span className={styles.tag}>{t.departmentName}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.classes.length > 0 && (
                <div className={styles.group}>
                  <div className={styles.groupHeader}><School size={14} /> Classes</div>
                  {results.classes.map((c) => (
                    <div
                      key={c.id}
                      className={styles.item}
                      onClick={() => handleSelect('/academics/classes')}
                    >
                      <div>
                        <strong>{c.name}</strong> {c.section} ({c.roomNumber})
                      </div>
                      <span>Teacher: {c.classTeacherName}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.subjects.length > 0 && (
                <div className={styles.group}>
                  <div className={styles.groupHeader}><BookOpen size={14} /> Subjects</div>
                  {results.subjects.map((s) => (
                    <div
                      key={s.id}
                      className={styles.item}
                      onClick={() => handleSelect('/academics/subjects')}
                    >
                      <div>
                        <strong>{s.name}</strong> ({s.code})
                      </div>
                      <span>Teacher: {s.teacherName}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.exams.length > 0 && (
                <div className={styles.group}>
                  <div className={styles.groupHeader}><FileText size={14} /> Exams</div>
                  {results.exams.map((e) => (
                    <div
                      key={e.id}
                      className={styles.item}
                      onClick={() => handleSelect('/examination/exams')}
                    >
                      <div>
                        <strong>{e.name}</strong> — {e.term} ({e.academicYear})
                      </div>
                      <span className={styles.badge}>{e.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.announcements.length > 0 && (
                <div className={styles.group}>
                  <div className={styles.groupHeader}><Megaphone size={14} /> Announcements</div>
                  {results.announcements.map((a) => (
                    <div
                      key={a.id}
                      className={styles.item}
                      onClick={() => handleSelect('/student-life/announcements')}
                    >
                      <div>
                        <strong>{a.title}</strong>
                      </div>
                      <span className={styles.tag}>{a.category}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
