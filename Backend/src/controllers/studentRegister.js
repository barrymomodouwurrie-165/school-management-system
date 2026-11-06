import { isAuthentic } from "../models/tokens.js";
import StudentUser from "../models/studentUser.js";
import StudentUsernameCounter from "../models/studentUsernameCounter.js";
import { provisionGuardianAccess } from "../services/guardianAccounts.js";

const STUDENT_ID_LIMITS = {
  Junior: 780,
  Senior: 700,
};

const getNextStudentSequence = async (section, academicYear) => {
  const counterId = `student-username-${section}-${academicYear}`;
  let counter = await StudentUsernameCounter.findById(counterId).lean();

  if (!counter) {
    const digits = section === "Junior" ? 3 : 4;
    const idPattern = new RegExp(`^${academicYear}(\\d{${digits}})$`);
    const existingStudents = await StudentUser.find({
      $or: [{ student_id: idPattern }, { username: idPattern }],
    })
      .select("student_id username")
      .lean();
    const highestSequence = existingStudents.reduce((highest, student) => {
      return [student.student_id, student.username].reduce(
        (currentHighest, identifier) => {
          const match = identifier.match(idPattern);
          return match
            ? Math.max(currentHighest, Number(match[1]))
            : currentHighest;
        },
        highest,
      );
    }, 0);

    try {
      await StudentUsernameCounter.updateOne(
        { _id: counterId },
        { $setOnInsert: { sequence: highestSequence } },
        { upsert: true },
      );
    } catch (error) {
      if (error.code !== 11000) throw error;
    }

    counter = await StudentUsernameCounter.findById(counterId).lean();
  }

  if (!counter || counter.sequence >= STUDENT_ID_LIMITS[section]) {
    return null;
  }

  const updatedCounter = await StudentUsernameCounter.findOneAndUpdate(
    { _id: counterId, sequence: { $lt: STUDENT_ID_LIMITS[section] } },
    { $inc: { sequence: 1 } },
    { new: true },
  );
  return updatedCounter?.sequence ?? null;
};

const studentRegister = async (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    return res
      .status(401)
      .json({ message: "A valid access token is required." });
  }

  if (claims.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only an admin can register students." });
  }

  const { section } = req.body;
  const normalizedSection =
    typeof section === "string" ? section.trim().toLowerCase() : "";
  const sectionCode =
    normalizedSection === "senior"
      ? "ss"
      : normalizedSection === "junior"
        ? "js"
        : null;

  if (!sectionCode) {
    return res
      .status(400)
      .json({ message: "Section must be Junior or Senior." });
  }

  const studentFields = [
    "first_name",
    "last_name",
    "date_of_birth",
    "nationality",
    "phone_number",
    "ethnicity",
    "religion",
    "previous_school",
    "gender",
    "class",
    "enrollment_date",
    "guardian_name",
    "guardian_phone",
    "guardian_email",
    "guardian_address",
  ];
  const studentData = Object.fromEntries(
    studentFields.map((field) => [field, req.body[field]]),
  );
  const requiredStudentFields = [
    "first_name",
    "last_name",
    "date_of_birth",
    "nationality",
    "phone_number",
    "ethnicity",
    "religion",
    "previous_school",
    "gender",
    "class",
    "enrollment_date",
    "guardian_name",
    "guardian_phone",
    "guardian_address",
  ];
  const missingFields = requiredStudentFields.filter(
    (field) =>
      typeof studentData[field] !== "string" || !studentData[field].trim(),
  );

  if (missingFields.length) {
    return res.status(400).json({
      message: "Required student information is missing.",
      fields: missingFields,
    });
  }

  try {
    const academicYear = String(new Date().getFullYear());
    const sectionName = normalizedSection === "senior" ? "Senior" : "Junior";
    const sequence = await getNextStudentSequence(sectionName, academicYear);
    if (sequence === null) {
      return res.status(409).json({
        message: `The ${sectionName.toLowerCase()} student ID sequence for ${academicYear} is full.`,
      });
    }

    const sequenceDigits = sectionName === "Junior" ? 3 : 4;
    const username = `${academicYear}${String(sequence).padStart(sequenceDigits, "0")}`;
    const password = `${username}${sectionCode}`;
    const student = await StudentUser.create({
      ...studentData,
      section: sectionName,
      student_id: username,
      username,
      password,
      status: "Active",
    });
    let guardianAccess;
    try {
      guardianAccess = await provisionGuardianAccess(student._id);
    } catch (error) {
      await StudentUser.deleteOne({ _id: student._id });
      throw error;
    }

    return res.status(201).json({
      message: "Student registered successfully.",
      student: {
        id: student._id,
        first_name: student.first_name,
        last_name: student.last_name,
        student_id: student.student_id,
        username,
        section: student.section,
      },
      credentials: { username, password },
      guardianAccess,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "The generated student username already exists. Please retry registration.",
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Student registration failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to register student right now." });
  }
};

export default studentRegister;
