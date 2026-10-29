import express from "express";
import mongoose from "mongoose";
import {
  generateAccessToken,
  generateRefreshToken,
  isAuthentic,
} from "../models/tokens.js";
import bcrypt from "bcrypt";
import AdminUser from "../models/adminUser.js";
import StaffUser from "../models/staffUser.js";
import StudentUser from "../models/studentUser.js";
import ClassRoom from "../models/classRoom.js";
import staffRegister from "../controllers/staffRegister.js";
import studentRegister from "../controllers/studentRegister.js";

const userRouter = express.Router();
const ASSIGNABLE_SUBJECTS = [
  "Mathematics",
  "English Language",
  "G.Science",
  "Civic",
  "Agricultural Science",
  "Financial Accounting",
  "Cost Accounting",
  "F.Accounting",
  "C.Accounting",
  "Physics",
  "Government",
  "History",
  "Geography",
  "Biology",
  "Chemistry",
  "S.E.S",
  "Literature",
  "I.R.k",
  "Others",
];
const STAFF_POSITIONS = ["Teacher", "H.O.D", "H.O.B", "Admin"];
const EDITABLE_STAFF_FIELDS = [
  "first_name",
  "last_name",
  "gender",
  "nationality",
  "phone_number",
  "email",
  "address",
  "ethnicity",
  "marital_status",
  "staff_id",
  "qualification",
  "subject_taught",
  "department",
  "section",
  "employment_type",
  "start_date",
  "username",
  "staff_position",
];

const isAdminRequest = (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    res.status(401).json({ message: "A valid access token is required." });
    return false;
  }

  if (claims.role !== "admin") {
    res.status(403).json({ message: "Only administrators can access user records." });
    return false;
  }

  return true;
};

userRouter.get("/staff", async (req, res) => {
  if (!isAdminRequest(req, res)) return;

  try {
    const staff = await StaffUser.find()
      .select(
        "first_name last_name gender nationality phone_number email staff_id qualification subject_taught department section employment_type start_date staff_position profile_image assigned_classes assigned_subjects",
      )
      .sort({ last_name: 1, first_name: 1 })
      .lean();

    return res.status(200).json(staff);
  } catch (error) {
    console.error("Staff list retrieval failed:", error.message);
    return res.status(500).json({ message: "Unable to retrieve staff records." });
  }
});

userRouter.put("/staff/:id", async (req, res) => {
  if (!isAdminRequest(req, res)) return;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid staff record ID." });
  }

  const updates = {};
  for (const field of EDITABLE_STAFF_FIELDS) {
    if (typeof req.body?.[field] !== "string" || !req.body[field].trim()) {
      return res.status(400).json({
        message: `${field.replaceAll("_", " ")} is required.`,
      });
    }
    updates[field] = req.body[field].trim();
  }

  if (!STAFF_POSITIONS.includes(updates.staff_position)) {
    return res.status(400).json({
      message: "Position must be Teacher, H.O.D, H.O.B, or Admin.",
    });
  }

  updates.email = updates.email.toLowerCase();
  updates.username = updates.username.toLowerCase();

  try {
    const staff = await StaffUser.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    )
      .select(
        "first_name last_name gender nationality phone_number email staff_id qualification subject_taught department section employment_type start_date username staff_position profile_image assigned_classes assigned_subjects",
      )
      .lean();

    if (!staff) {
      return res.status(404).json({ message: "Staff member was not found." });
    }

    return res.status(200).json({
      message: "Staff details updated successfully.",
      staff,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "The staff ID, username, or email is already in use.",
      });
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Staff update failed:", error.message);
    return res.status(500).json({ message: "Unable to update staff details." });
  }
});

userRouter.get("/students", async (req, res) => {
  if (!isAdminRequest(req, res)) return;

  try {
    const students = await StudentUser.find()
      .select(
        "student_id first_name last_name gender nationality ethnicity date_of_birth section class enrollment_date guardian_name guardian_phone guardian_address status",
      )
      .sort({ last_name: 1, first_name: 1 })
      .lean();

    return res.status(200).json(students);
  } catch (error) {
    console.error("Student list retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve student records." });
  }
});

userRouter.get("/staff/:staffId/assignments", async (req, res) => {
  if (!isAdminRequest(req, res)) return;

  try {
    const staff = await StaffUser.findOne({ staff_id: req.params.staffId })
      .select(
        "first_name last_name staff_id department staff_position subject_taught assigned_subjects assigned_classes",
      )
      .lean();
    if (!staff) {
      return res.status(404).json({ message: "Staff member was not found." });
    }

    const classrooms = await ClassRoom.find({ status: "Active" })
      .select("name class_teacher")
      .populate("class_teacher", "staff_id first_name last_name")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      staff,
      subjects: ASSIGNABLE_SUBJECTS,
      classes: classrooms.map((classroom) => ({
        name: classroom.name,
        classTeacher: classroom.class_teacher
          ? {
              staffId: classroom.class_teacher.staff_id,
              name: `${classroom.class_teacher.first_name} ${classroom.class_teacher.last_name}`,
            }
          : null,
      })),
      classTeacherClasses: classrooms
        .filter(
          (classroom) =>
            String(classroom.class_teacher?._id) === String(staff._id),
        )
        .map((classroom) => classroom.name),
    });
  } catch (error) {
    console.error("Staff assignment retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve staff assignments." });
  }
});

userRouter.put("/staff/:staffId/assignments", async (req, res) => {
  if (!isAdminRequest(req, res)) return;

  const { assignedClasses, assignedSubjects, classTeacherClasses, staffPosition } =
    req.body ?? {};
  const isStringArray = (value) =>
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && item.trim());

  if (
    !isStringArray(assignedClasses) ||
    !isStringArray(assignedSubjects) ||
    !isStringArray(classTeacherClasses) ||
    !STAFF_POSITIONS.includes(staffPosition)
  ) {
    return res.status(400).json({
      message: "Provide valid classes, subjects, class-teacher classes, and position.",
    });
  }

  const normalizedClasses = [...new Set(assignedClasses.map((item) => item.trim()))];
  const normalizedTeacherClasses = [
    ...new Set(classTeacherClasses.map((item) => item.trim())),
  ];
  const normalizedSubjects = [...new Set(assignedSubjects.map((item) => item.trim()))];

  if (normalizedSubjects.some((subject) => !ASSIGNABLE_SUBJECTS.includes(subject))) {
    return res.status(400).json({ message: "One or more selected subjects are invalid." });
  }

  try {
    const staff = await StaffUser.findOne({ staff_id: req.params.staffId });
    if (!staff) {
      return res.status(404).json({ message: "Staff member was not found." });
    }

    const requiredClassNames = [
      ...new Set([...normalizedClasses, ...normalizedTeacherClasses]),
    ];
    const classrooms = requiredClassNames.length
      ? await ClassRoom.find({
          name: { $in: requiredClassNames },
          status: "Active",
        })
          .select("name class_teacher")
          .populate("class_teacher", "staff_id first_name last_name")
          .lean()
      : [];
    if (classrooms.length !== requiredClassNames.length) {
      return res.status(400).json({
        message: "One or more selected classes are unavailable or inactive.",
      });
    }

    const teacherClasses = new Set(normalizedTeacherClasses);
    const conflictingClass = classrooms.find(
      (classroom) =>
        teacherClasses.has(classroom.name) &&
        classroom.class_teacher &&
        String(classroom.class_teacher._id) !== String(staff._id),
    );
    if (conflictingClass) {
      const currentTeacher = conflictingClass.class_teacher;
      return res.status(409).json({
        message: `${conflictingClass.name} is already assigned to ${currentTeacher.first_name} ${currentTeacher.last_name} as class teacher.`,
      });
    }

    const classTeacherOperations = classrooms
      .filter((classroom) => teacherClasses.has(classroom.name))
      .map((classroom) => ({
        updateOne: {
          filter: {
            _id: classroom._id,
            $or: [
              { class_teacher: { $exists: false } },
              { class_teacher: null },
              { class_teacher: staff._id },
            ],
          },
          update: { $set: { class_teacher: staff._id } },
        },
      }));

    if (classTeacherOperations.length) {
      const assignmentResult = await ClassRoom.bulkWrite(classTeacherOperations);
      if (assignmentResult.matchedCount !== classTeacherOperations.length) {
        return res.status(409).json({
          message:
            "One or more classes have been assigned to another class teacher. Reload the assignments and try again.",
        });
      }
    }

    await ClassRoom.updateMany(
      {
        class_teacher: staff._id,
        status: "Active",
        name: { $nin: normalizedTeacherClasses },
      },
      { $unset: { class_teacher: "" } },
    );
    staff.assigned_classes = normalizedClasses;
    staff.assigned_subjects = normalizedSubjects;
    staff.staff_position = staffPosition;
    await staff.save();

    return res.status(200).json({
      message: "Staff assignments updated successfully.",
      staff: {
        staff_id: staff.staff_id,
        assigned_classes: staff.assigned_classes,
        assigned_subjects: staff.assigned_subjects,
        staff_position: staff.staff_position,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Staff assignment update failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to update staff assignments." });
  }
});

userRouter.post("/staff/register", staffRegister);

userRouter.post("/students/register", studentRegister);

userRouter.post("/login", async (req, res) => {
  const { role, password } = req.body;
  const identifier = req.body.username ?? req.body.email;
  const normalizedRole =
    typeof role === "string" ? role.trim().toLowerCase() : "";
  const normalizedIdentifier =
    typeof identifier === "string" ? identifier.trim().toLowerCase() : "";

  if (
    !normalizedRole ||
    !normalizedIdentifier ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      message: "Role, username or email, and password are required.",
    });
  }

  const userModel =
    normalizedRole === "admin"
      ? AdminUser
      : normalizedRole === "teacher"
        ? StaffUser
        : normalizedRole === "student"
          ? StudentUser
          : null;

  if (!userModel) {
    return res
      .status(400)
      .json({ message: "Role must be admin, teacher, or student." });
  }

  try {
    const userQuery =
      normalizedRole === "teacher"
        ? {
            $or: [
              { username: normalizedIdentifier },
              { email: normalizedIdentifier },
            ],
          }
        : { username: normalizedIdentifier };
    const user = await userModel.findOne(userQuery).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Invalid username/email or password." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return res.status(200).json({
      message: "Login successful.",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    return res.status(500).json({ message: "Unable to log in right now." });
  }
});

userRouter.post("/logout", async (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    return res
      .status(401)
      .json({ message: "A valid access token is required." });
  }

  const userModel =
    claims.role === "admin"
      ? AdminUser
      : claims.role === "teacher"
        ? StaffUser
        : claims.role === "student"
          ? StudentUser
          : null;

  if (!userModel) {
    return res.status(401).json({ message: "Invalid user role." });
  }

  try {
    const user = await userModel.findById(claims.id);
    if (user) {
      user.refreshTokenHash = null;
      await user.save();
    }

    return res.status(200).json({
      message: "Logout successful. The refresh token has been revoked.",
    });
  } catch (error) {
    console.error("Logout failed:", error.message);
    return res.status(500).json({ message: "Unable to log out right now." });
  }
});



export default userRouter;
