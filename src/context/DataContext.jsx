import { createContext, useCallback, useContext, useMemo } from 'react';
import { useStoredState } from '../hooks/useStoredState';
import { STORAGE_KEYS } from '../utils/storage';
import { logActivity } from '../utils/activityLog';
import { useAuth } from './AuthContext';
import {
  calculateClassRankings,
  calculatePercentage,
  calculateStudentOverallMarks,
  getGradeFromPercentage,
  getPassFailStatus,
} from '../utils/gradeUtils';

const DataContext = createContext(null);

function useEntity(key, fallback) {
  const [data, setData] = useStoredState(key, fallback);
  return [data, setData];
}

export function DataProvider({ children }) {
  const { authProfile, roleDefinition } = useAuth();

  const [students, setStudents] = useEntity(STORAGE_KEYS.students, []);
  const [teachers, setTeachers] = useEntity(STORAGE_KEYS.teachers, []);
  const [parents, setParents] = useEntity(STORAGE_KEYS.parents, []);
  const [staff, setStaff] = useEntity(STORAGE_KEYS.staff, []);
  const [departments, setDepartments] = useEntity(STORAGE_KEYS.departments, []);
  const [classes, setClasses] = useEntity(STORAGE_KEYS.classes, []);
  const [subjects, setSubjects] = useEntity(STORAGE_KEYS.subjects, []);
  const [attendance, setAttendance] = useEntity(STORAGE_KEYS.attendance, {});
  const [teacherAttendance, setTeacherAttendance] = useEntity(STORAGE_KEYS.teacherAttendance, {});
  const [exams, setExams] = useEntity(STORAGE_KEYS.exams, []);
  const [marks, setMarks] = useEntity(STORAGE_KEYS.marks, []);
  const [assignments, setAssignments] = useEntity(STORAGE_KEYS.assignments, []);
  const [fees, setFees] = useEntity(STORAGE_KEYS.fees, []);
  const [payments, setPayments] = useEntity(STORAGE_KEYS.payments, []);
  const [announcements, setAnnouncements] = useEntity(STORAGE_KEYS.announcements, []);
  const [events, setEvents] = useEntity(STORAGE_KEYS.events, []);
  const [admissions, setAdmissions] = useEntity(STORAGE_KEYS.admissions, []);
  const [libraryBooks, setLibraryBooks] = useEntity(STORAGE_KEYS.libraryBooks, []);
  const [inventory, setInventory] = useEntity(STORAGE_KEYS.inventory, []);
  const [facilities, setFacilities] = useEntity(STORAGE_KEYS.facilities, []);
  const [transport, setTransport] = useEntity(STORAGE_KEYS.transport, []);
  const [hostel, setHostel] = useEntity(STORAGE_KEYS.hostel, []);
  const [complaints, setComplaints] = useEntity(STORAGE_KEYS.complaints, []);
  const [discipline, setDiscipline] = useEntity(STORAGE_KEYS.discipline, []);
  const [auditLogs, setAuditLogs] = useEntity(STORAGE_KEYS.auditLogs, []);
  const [settings, setSettings] = useEntity(STORAGE_KEYS.settings, {});
  const [notifications, setNotifications] = useEntity(STORAGE_KEYS.notifications, []);
  const [timetable, setTimetable] = useEntity(STORAGE_KEYS.timetable, []);

  const audit = useCallback(
    (action, detail, module = 'General') => {
      logActivity(action, detail, {
        user: authProfile?.name || 'System',
        role: roleDefinition?.label || 'System',
        module,
      });
      setAuditLogs((prev) => {
        const entry = {
          id: `log_${Date.now()}`,
          user: authProfile?.name || 'System',
          role: roleDefinition?.label || 'System',
          action,
          module,
          detail,
          timestamp: new Date().toISOString(),
        };
        return [entry, ...prev].slice(0, 50);
      });
    },
    [authProfile, roleDefinition, setAuditLogs],
  );

  const getStudentById = useCallback((id) => students.find((s) => s.id === id), [students]);
  const getClassById = useCallback((id) => classes.find((c) => c.id === id), [classes]);
  const getSubjectById = useCallback((id) => subjects.find((s) => s.id === id), [subjects]);
  const getTeacherById = useCallback((id) => teachers.find((t) => t.id === id), [teachers]);

  const getStudentsByClass = useCallback(
    (classId) => students.filter((s) => s.classId === classId && s.status === 'Active'),
    [students],
  );

  const getStudentAttendancePercentage = useCallback(
    (studentId, days = 30) => {
      const today = new Date();
      let present = 0;
      let total = 0;
      for (let i = 0; i < days; i += 1) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        const key = `${studentId}_${date.toISOString().slice(0, 10)}`;
        const status = attendance[key];
        if (status) {
          total += 1;
          if (status === 'present' || status === 'late') present += 1;
        }
      }
      return total > 0 ? Math.round((present / total) * 100) : 0;
    },
    [attendance],
  );

  const getStudentMarksForExam = useCallback(
    (studentId, examId) => marks.filter((m) => m.studentId === studentId && m.examId === examId),
    [marks],
  );

  const getStudentOverallForExam = useCallback(
    (studentId, examId) => {
      const subjectMarks = getStudentMarksForExam(studentId, examId).map((m) => ({
        obtainedMarks: m.obtainedMarks,
        totalMarks: m.totalMarks,
        passingMarks: m.passingMarks,
      }));
      const scale = settings.gradingScale;
      const passing = settings.passingPercentage ?? 33;
      const result = calculateStudentOverallMarks(subjectMarks);
      if (scale) {
        result.grade = getGradeFromPercentage(result.percentage, scale);
        result.status = getPassFailStatus(result.percentage, passing);
      }
      return result;
    },
    [getStudentMarksForExam, settings],
  );

  const getClassRankingsForExam = useCallback(
    (classId, examId) => {
      const classStudents = getStudentsByClass(classId);
      const performance = classStudents.map((student) => {
        const overall = getStudentOverallForExam(student.id, examId);
        return {
          studentId: student.id,
          studentName: student.fullName,
          rollNo: student.rollNo,
          ...overall,
        };
      });
      return calculateClassRankings(performance);
    },
    [getStudentsByClass, getStudentOverallForExam],
  );

  const updateMark = useCallback(
    (markId, updates) => {
      setMarks((prev) =>
        prev.map((m) => {
          if (m.id !== markId) return m;
          const updated = { ...m, ...updates };
          if (updates.obtainedMarks !== undefined) {
            updated.percentage = Math.round(calculatePercentage(updated.obtainedMarks, updated.totalMarks) * 10) / 10;
            updated.grade = getGradeFromPercentage(updated.percentage, settings.gradingScale);
            updated.status = updated.obtainedMarks >= updated.passingMarks ? 'Pass' : 'Fail';
          }
          updated.updatedAt = new Date().toISOString().slice(0, 10);
          return updated;
        }),
      );
    },
    [setMarks, settings.gradingScale],
  );

  const markAttendanceForClass = useCallback(
    (classId, dateStr, statusMap) => {
      setAttendance((prev) => {
        const next = { ...prev };
        Object.entries(statusMap).forEach(([studentId, status]) => {
          next[`${studentId}_${dateStr}`] = status;
        });
        return next;
      });
      audit('Attendance marked', `Class ${classId} attendance updated for ${dateStr}`, 'Attendance');
    },
    [setAttendance, audit],
  );

  const recordPayment = useCallback(
    (feeId, paymentData) => {
      const fee = fees.find((f) => f.id === feeId);
      if (!fee) return;

      const payment = {
        id: `pay_${Date.now()}`,
        feeId,
        studentId: fee.studentId,
        studentName: fee.studentName,
        ...paymentData,
        paymentDate: paymentData.paymentDate || new Date().toISOString().slice(0, 10),
        recordedBy: authProfile?.name || 'Accountant',
      };

      setPayments((prev) => [payment, ...prev]);
      setFees((prev) =>
        prev.map((f) => {
          if (f.id !== feeId) return f;
          const paidAmount = (f.paidAmount || 0) + paymentData.amount;
          const balance = f.totalAmount - paidAmount;
          return {
            ...f,
            paidAmount,
            balance,
            status: balance <= 0 ? 'Paid' : paidAmount > 0 ? 'Partially Paid' : f.status,
            paymentDate: payment.paymentDate,
            paymentMethod: paymentData.method,
          };
        }),
      );
      audit('Fee payment recorded', `Rs. ${paymentData.amount} for ${fee.studentName}`, 'Finance');
    },
    [fees, setPayments, setFees, audit, authProfile],
  );

  const enrollAdmission = useCallback(
    (admissionId) => {
      const admission = admissions.find((a) => a.id === admissionId);
      if (!admission) return null;

      const newStudent = {
        id: `student_${Date.now()}`,
        studentCode: `ST-2026-${String(students.length + 1).padStart(3, '0')}`,
        rollNo: `NEW-${students.length + 1}`,
        firstName: admission.applicantName.split(' ')[0],
        lastName: admission.applicantName.split(' ').slice(1).join(' ') || admission.applicantName,
        fullName: admission.applicantName,
        email: admission.email,
        phone: admission.phone,
        classId: 'class_9a',
        className: 'Grade 9',
        section: 'Section A (Science)',
        subjectIds: [],
        guardianName: admission.fatherName,
        guardianRelation: 'Father',
        guardianPhone: admission.phone,
        guardianEmail: admission.email,
        status: 'Active',
        admissionDate: new Date().toISOString().slice(0, 10),
        avatarColor: '#6366f1',
        initials: admission.applicantName.slice(0, 2).toUpperCase(),
      };

      setStudents((prev) => [...prev, newStudent]);
      setAdmissions((prev) =>
        prev.map((a) => (a.id === admissionId ? { ...a, status: 'Enrolled', enrolledStudentId: newStudent.id } : a)),
      );
      audit('Student enrolled', `${admission.applicantName} enrolled from admissions pipeline`, 'Admissions');
      return newStudent;
    },
    [admissions, students.length, setStudents, setAdmissions, audit],
  );

  const lowAttendanceStudents = useMemo(() => {
    const threshold = settings.attendanceThreshold ?? 75;
    return students
      .filter((s) => s.status === 'Active')
      .map((s) => ({ ...s, attendancePct: getStudentAttendancePercentage(s.id) }))
      .filter((s) => s.attendancePct < threshold);
  }, [students, settings.attendanceThreshold, getStudentAttendancePercentage]);

  const overdueFees = useMemo(() => fees.filter((f) => f.status === 'Overdue' || f.balance > 0), [fees]);

  const value = useMemo(
    () => ({
      students, setStudents,
      teachers, setTeachers,
      parents, setParents,
      staff, setStaff,
      departments, setDepartments,
      classes, setClasses,
      subjects, setSubjects,
      attendance, setAttendance,
      teacherAttendance, setTeacherAttendance,
      exams, setExams,
      marks, setMarks,
      assignments, setAssignments,
      fees, setFees,
      payments, setPayments,
      announcements, setAnnouncements,
      events, setEvents,
      admissions, setAdmissions,
      libraryBooks, setLibraryBooks,
      inventory, setInventory,
      facilities, setFacilities,
      transport, setTransport,
      hostel, setHostel,
      complaints, setComplaints,
      discipline, setDiscipline,
      auditLogs, setAuditLogs,
      settings, setSettings,
      notifications, setNotifications,
      timetable, setTimetable,
      getStudentById,
      getClassById,
      getSubjectById,
      getTeacherById,
      getStudentsByClass,
      getStudentAttendancePercentage,
      getStudentMarksForExam,
      getStudentOverallForExam,
      getClassRankingsForExam,
      updateMark,
      markAttendanceForClass,
      recordPayment,
      enrollAdmission,
      audit,
      lowAttendanceStudents,
      overdueFees,
    }),
    [
      students, setStudents, teachers, setTeachers, parents, setParents, staff, setStaff,
      departments, setDepartments, classes, setClasses, subjects, setSubjects,
      attendance, setAttendance, teacherAttendance, setTeacherAttendance,
      exams, setExams, marks, setMarks, assignments, setAssignments,
      fees, setFees, payments, setPayments, announcements, setAnnouncements,
      events, setEvents, admissions, setAdmissions, libraryBooks, setLibraryBooks,
      inventory, setInventory, facilities, setFacilities, transport, setTransport,
      hostel, setHostel, complaints, setComplaints, discipline, setDiscipline,
      auditLogs, setAuditLogs, settings, setSettings, notifications, setNotifications,
      timetable, setTimetable,
      getStudentById, getClassById, getSubjectById, getTeacherById,
      getStudentsByClass, getStudentAttendancePercentage, getStudentMarksForExam,
      getStudentOverallForExam, getClassRankingsForExam, updateMark,
      markAttendanceForClass, recordPayment, enrollAdmission, audit,
      lowAttendanceStudents, overdueFees,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
