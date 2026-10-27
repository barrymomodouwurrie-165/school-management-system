import { isAuthentic } from "../models/tokens.js";
import StudentUser from "../models/studentUser.js";
import StudentUsernameCounter from "../models/studentUsernameCounter.js";

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
    const counter = await StudentUsernameCounter.findOneAndUpdate(
      { _id: `student-username-${academicYear}` },
      { $inc: { sequence: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    if (counter.sequence > 999) {
      return res.status(409).json({
        message: `The student username sequence for ${academicYear} is full.`,
      });
    }

    const username = `${academicYear}${String(counter.sequence).padStart(3, "0")}`;
    const password = `${username}${sectionCode}`;
    const student = await StudentUser.create({
      ...studentData,
      section: normalizedSection === "senior" ? "Senior" : "Junior",
      student_id: username,
      username,
      password,
    });

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
