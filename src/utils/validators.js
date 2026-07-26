const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+]?[\d\s()-]{7,20}$/;

export function validateStudent(values, existingStudents, editingId) {
  const errors = {};

  if (!values.firstName?.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!values.lastName?.trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (!values.email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  } else {
    const duplicate = existingStudents.find(
      (student) =>
        student.id !== editingId &&
        student.email.trim().toLowerCase() === values.email.trim().toLowerCase(),
    );
    if (duplicate) {
      errors.email = 'This email is already used by another student.';
    }
  }

  if (values.phone && !PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (values.studentCode) {
    const duplicateCode = existingStudents.find(
      (student) =>
        student.id !== editingId &&
        student.studentCode.trim().toLowerCase() === values.studentCode.trim().toLowerCase(),
    );
    if (duplicateCode) {
      errors.studentCode = 'This student ID is already in use.';
    }
  }

  if (!values.enrollmentDate) {
    errors.enrollmentDate = 'Enrollment date is required.';
  }

  if (!values.courseIds || values.courseIds.length === 0) {
    errors.courseIds = 'Select at least one course.';
  }

  return errors;
}

export function validateCourse(values, existingCourses, editingId) {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name = 'Course name is required.';
  }

  if (!values.code?.trim()) {
    errors.code = 'Course code is required.';
  } else {
    const duplicate = existingCourses.find(
      (course) =>
        course.id !== editingId && course.code.trim().toLowerCase() === values.code.trim().toLowerCase(),
    );
    if (duplicate) {
      errors.code = 'This course code is already in use.';
    }
  }

  if (!values.instructor?.trim()) {
    errors.instructor = 'Instructor name is required.';
  }

  if (!values.credits || Number(values.credits) <= 0) {
    errors.credits = 'Enter a valid credit value.';
  }

  if (!values.capacity || Number(values.capacity) <= 0) {
    errors.capacity = 'Enter a valid capacity.';
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
