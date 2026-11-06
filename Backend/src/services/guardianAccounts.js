import { randomBytes } from "node:crypto";
import GuardianUser from "../models/guardianUser.js";
import StudentUser from "../models/studentUser.js";

const provisionGuardianAccess = async (studentId) => {
  const student = await StudentUser.findById(studentId);
  if (!student) {
    const error = new Error("Student account was not found.");
    error.statusCode = 404;
    throw error;
  }
  if (student.status === "Transferred") {
    const error = new Error(
      "Guardian portal access cannot be provisioned for a transferred student.",
    );
    error.statusCode = 409;
    throw error;
  }

  const email =
    typeof student.guardian_email === "string"
      ? student.guardian_email.trim().toLowerCase()
      : "";
  const studentName = `${student.first_name} ${student.last_name}`;
  const fullName = student.guardian_name.trim();
  const username = email || `guardian-${student.student_id}`.toLowerCase();

  const existingGuardian = await GuardianUser.findOne(
    email ? { email } : { username },
  );
  if (existingGuardian) {
    if (!existingGuardian.students.some((id) => String(id) === String(student._id))) {
      existingGuardian.students.push(student._id);
      await existingGuardian.save();
    }
    return {
      created: false,
      username: existingGuardian.username,
      linkedExistingAccount: true,
      studentName,
    };
  }

  const temporaryPassword = randomBytes(15).toString("base64url");
  const guardian = await GuardianUser.create({
    fullName,
    username,
    ...(email ? { email } : {}),
    password: temporaryPassword,
    students: [student._id],
    mustChangePassword: true,
  });

  return {
    created: true,
    username: guardian.username,
    temporaryPassword,
    linkedExistingAccount: false,
    studentName,
  };
};

export { provisionGuardianAccess };
