import { db } from '@hack-alumni/db';

export function findStudentByEmail(email: string) {
  return db
    .selectFrom('studentEmails')
    .leftJoin('students', 'students.id', 'studentEmails.studentId')
    .where('studentEmails.email', 'ilike', email);
}
