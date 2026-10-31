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
import Subject from "../models/subject.js";
import { isSubjectAvailableForClass } from "../data/subjectCatalog.js";
import staffRegister from "../controllers/staffRegister.js";
import studentRegister from "../controllers/studentRegister.js";

const userRouter = express.Router();
const LEGACY_SUBJECT_NAMES = {
  "G.Science": "General Science",
  Civic: "Civic Education",
  "S.E.S": "Social and Environmental Studies",
  "I.R.k": "I.R.K",
  Literature: "Literature in English",
  "F.Accounting": "Financial Accounting",
  "C.Accounting": "Cost Accounting",
};
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

const getAdminClaims = (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    res.status(401).json({ message: "A valid access token is required." });
    return null;
  }

  if (claims.role !== "admin" || typeof claims.id !== "string") {
    res.status(403).json({ message: "Only administrators can access this profile." });
    return null;
  }

  return claims;
};

const serializeAdminProfile = (admin) => ({
  id: admin._id,
  fullName: admin.fullName || "",
  username: admin.username,
  profilePicture: admin.profilePicture || "",
});

userRouter.get("/admin/profile", async (req, res) => {
  const claims = getAdminClaims(req, res);
  if (!claims) return;

  try {
    const admin = await AdminUser.findById(claims.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin account was not found." });
    }

    return res.status(200).json(serializeAdminProfile(admin));
  } catch (error) {
    console.error("Admin profile retrieval failed:", error.message);
    return res.status(500).json({ message: "Unable to retrieve admin profile." });
  }
});

userRouter.put("/admin/profile", async (req, res) => {
  const claims = getAdminClaims(req, res);
  if (!claims) return;

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const username =
    typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!fullName || fullName.length > 120 || !username || username.length > 64) {
    return res.status(400).json({
      message: "Provide a full name (up to 120 characters) and username (up to 64 characters).",
    });
  }
  if (password && password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }
  if (password.length > 128) {
    return res.status(400).json({ message: "Password is too long." });
  }

  let profilePicture;
  if (Object.hasOwn(body, "profilePicture")) {
    profilePicture = body.profilePicture;
    if (profilePicture !== null && profilePicture !== "") {
      if (
        typeof profilePicture !== "string" ||
        profilePicture.length > 1500000 ||
        !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(
          profilePicture,
        )
      ) {
        return res.status(400).json({
          message: "Profile picture must be a JPEG, PNG, or WebP image under 1.1 MB.",
        });
      }
    }
  }

  try {
    const admin = await AdminUser.findById(claims.id).select("+password");
    if (!admin) {
      return res.status(404).json({ message: "Admin account was not found." });
    }

    admin.fullName = fullName;
    admin.username = username;
    if (password) admin.password = password;
    if (profilePicture !== undefined) admin.profilePicture = profilePicture;
    await admin.save();

    return res.status(200).json({
      message: "Admin profile updated successfully.",
      profile: serializeAdminProfile(admin),
      accessToken: generateAccessToken(admin),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "That username is already in use." });
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Admin profile update failed:", error.message);
    return res.status(500).json({ message: "Unable to update admin profile." });
  }
});

userRouter.get("/teacher/profile", async (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    return res
      .status(401)
      .json({ message: "A valid access token is required." });
  }

  if (claims.role !== "teacher" || typeof claims.id !== "string") {
    return res
      .status(403)
      .json({ message: "Only teachers can access their profile." });
  }

  try {
    const staff = await StaffUser.findById(claims.id)
      .select(
        "first_name last_name gender email phone_number staff_id department subject_taught assigned_subjects assigned_classes staff_position section profile_image",
      )
      .lean();
    if (!staff) {
      return res.status(404).json({ message: "Teacher account was not found." });
    }

    const classes = await ClassRoom.find({
      class_teacher: staff._id,
      status: "Active",
    })
      .select("name")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      id: String(staff._id),
      firstName: staff.first_name,
      lastName: staff.last_name,
      fullName: `${staff.first_name} ${staff.last_name}`,
      gender: staff.gender,
      email: staff.email,
      phoneNumber: staff.phone_number,
      staffId: staff.staff_id,
      department: staff.department,
      primarySubject:
        LEGACY_SUBJECT_NAMES[staff.subject_taught] ?? staff.subject_taught,
      assignedSubjects: (staff.assigned_subjects ?? []).map(
        (subject) => LEGACY_SUBJECT_NAMES[subject] ?? subject,
      ),
      assignedClasses: staff.assigned_classes ?? [],
      classTeacherClasses: classes.map((classroom) => classroom.name),
      position: staff.staff_position,
      section: staff.section,
      profilePicture: staff.profile_image ?? "",
    });
  } catch (error) {
    console.error("Teacher profile retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve teacher profile." });
  }
});

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
        "student_id username first_name last_name gender nationality ethnicity date_of_birth phone_number religion previous_school section class enrollment_date guardian_name guardian_phone guardian_email guardian_address status",
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

userRouter.put("/students/:id", async (req, res) => {
  if (!isAdminRequest(req, res)) return;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid student record ID." });
  }

  const editableFields = [
    "first_name",
    "last_name",
    "date_of_birth",
    "nationality",
    "phone_number",
    "ethnicity",
    "religion",
    "previous_school",
    "gender",
    "section",
    "class",
    "enrollment_date",
    "guardian_name",
    "guardian_phone",
    "guardian_address",
  ];
  const updates = {};
  for (const field of editableFields) {
    if (typeof req.body?.[field] !== "string" || !req.body[field].trim()) {
      return res.status(400).json({
        message: `${field.replaceAll("_", " ")} is required.`,
      });
    }
    updates[field] = req.body[field].trim();
  }

  if (!["Junior", "Senior"].includes(updates.section)) {
    return res.status(400).json({
      message: "Section must be Junior or Senior.",
    });
  }

  if (
    req.body.status !== undefined &&
    req.body.status !== "" &&
    !["Active", "Suspended", "Transferred"].includes(req.body.status)
  ) {
    return res.status(400).json({ message: "Student status is invalid." });
  }

  const unset = {};
  if (typeof req.body.guardian_email === "string" && req.body.guardian_email.trim()) {
    updates.guardian_email = req.body.guardian_email.trim().toLowerCase();
  } else {
    unset.guardian_email = "";
  }
  if (req.body.status) {
    updates.status = req.body.status;
  } else {
    unset.status = "";
  }

  try {
    const student = await StudentUser.findByIdAndUpdate(
      req.params.id,
      { $set: updates, ...(Object.keys(unset).length ? { $unset: unset } : {}) },
      { new: true, runValidators: true },
    )
      .select(
        "student_id username first_name last_name gender nationality ethnicity date_of_birth phone_number religion previous_school section class enrollment_date guardian_name guardian_phone guardian_email guardian_address status",
      )
      .lean();

    if (!student) {
      return res.status(404).json({ message: "Student was not found." });
    }

    return res.status(200).json({
      message: "Student details updated successfully.",
      student,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "The student ID or username is already in use.",
      });
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Student update failed:", error.message);
    return res.status(500).json({ message: "Unable to update student details." });
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
      .select("name section program stream_number class_teacher")
      .populate("class_teacher", "staff_id first_name last_name")
      .sort({ name: 1 })
      .lean();
    const subjects = await Subject.find().sort({ section: 1, name: 1 }).lean();

    return res.status(200).json({
      staff: {
        ...staff,
        subject_taught:
          LEGACY_SUBJECT_NAMES[staff.subject_taught] ?? staff.subject_taught,
        assigned_subjects: (staff.assigned_subjects ?? []).map(
          (subject) => LEGACY_SUBJECT_NAMES[subject] ?? subject,
        ),
      },
      subjects,
      classes: classrooms.map((classroom) => ({
        name: classroom.name,
        section: classroom.section,
        program: classroom.program,
        stream_number: classroom.stream_number,
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
          .select("name section program stream_number class_teacher")
          .populate("class_teacher", "staff_id first_name last_name")
          .lean()
      : [];
    if (classrooms.length !== requiredClassNames.length) {
      return res.status(400).json({
        message: "One or more selected classes are unavailable or inactive.",
      });
    }

    const subjects = normalizedSubjects.length
      ? await Subject.find({
          name: { $in: normalizedSubjects },
          isActive: true,
        }).lean()
      : [];
    const subjectsByName = new Map(
      normalizedSubjects.map((name) => [
        name,
        subjects.filter((subject) => subject.name === name),
      ]),
    );
    if ([...subjectsByName.values()].some((matches) => !matches.length)) {
      return res.status(400).json({
        message: "One or more selected subjects are invalid.",
      });
    }

    const teachingClasses = classrooms.filter((classroom) =>
      normalizedClasses.includes(classroom.name),
    );
    const unavailableSubject = normalizedSubjects.find(
      (name) =>
        !subjectsByName.get(name).some((subject) =>
          teachingClasses.some((classroom) =>
            isSubjectAvailableForClass(subject, classroom),
          ),
        ),
    );
    if (unavailableSubject) {
      return res.status(400).json({
        message: `${unavailableSubject} is not available for any of the selected teaching classes.`,
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
