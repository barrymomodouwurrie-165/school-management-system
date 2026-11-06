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
import GuardianUser from "../models/guardianUser.js";
import AttendanceSession from "../models/attendanceSession.js";
import StudentReport from "../models/studentReport.js";
import FeedbackSubmission from "../models/feedbackSubmission.js";
import StudentResult from "../models/studentResult.js";
import ClassRoom from "../models/classRoom.js";
import Subject from "../models/subject.js";
import { isSubjectAvailableForClass } from "../data/subjectCatalog.js";
import staffRegister from "../controllers/staffRegister.js";
import studentRegister from "../controllers/studentRegister.js";
import { provisionGuardianAccess } from "../services/guardianAccounts.js";

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
const SCHOOL_BLOCKS = [
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];
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

userRouter.get("/admin/dashboard-overview", async (req, res) => {
  if (!isAdminRequest(req, res)) return;

  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setUTCHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
  const todayFilter = { $gte: dayStart, $lt: dayEnd };

  try {
    const [
      totalStudents,
      maleStudents,
      femaleStudents,
      staffMembers,
      maleStaff,
      femaleStaff,
      activeClassrooms,
      enrolledStudents,
      dailyAttendanceSessions,
      reports,
      feedback,
      attendanceSessions,
      resultEntries,
    ] = await Promise.all([
      StudentUser.countDocuments({ status: { $in: ["Active", "Suspended"] } }),
      StudentUser.countDocuments({
        status: { $in: ["Active", "Suspended"] },
        gender: { $regex: /^male$/i },
      }),
      StudentUser.countDocuments({
        status: { $in: ["Active", "Suspended"] },
        gender: { $regex: /^female$/i },
      }),
      StaffUser.find()
        .select("department first_name last_name staff_position assigned_block")
        .lean(),
      StaffUser.countDocuments({ gender: { $regex: /^male$/i } }),
      StaffUser.countDocuments({ gender: { $regex: /^female$/i } }),
      ClassRoom.find({ status: "Active" }).select("_id name grade").lean(),
      StudentUser.find({ status: { $in: ["Active", "Suspended"] } })
        .select("_id class gender")
        .lean(),
      AttendanceSession.find({ date: todayFilter })
        .select("classroom firstCallSavedAt secondCallSavedAt entries")
        .lean(),
      StudentReport.find({ createdAt: todayFilter })
        .sort({ createdAt: -1 })
        .select(
          "reportedStudent category submittedByRole submittedByName createdAt",
        )
        .lean(),
      FeedbackSubmission.find({ createdAt: todayFilter })
        .sort({ createdAt: -1 })
        .select(
          "type category subject anonymous submittedByRole submittedByName createdAt",
        )
        .lean(),
      AttendanceSession.find({
        $or: [
          { firstCallSavedAt: todayFilter },
          { secondCallSavedAt: todayFilter },
        ],
      })
        .sort({ updatedAt: -1 })
        .populate("markingTeacher", "first_name last_name")
        .select(
          "className markingTeacher firstCallSavedAt secondCallSavedAt updatedAt",
        )
        .lean(),
      StudentResult.find({ updatedAt: todayFilter })
        .sort({ updatedAt: -1 })
        .populate("enteredBy", "first_name last_name")
        .select(
          "className subject academicYear evaluationPeriod enteredBy updatedAt",
        )
        .lean(),
    ]);

    const studentsByClass = new Map();
    for (const student of enrolledStudents) {
      const classStudents = studentsByClass.get(student.class) ?? [];
      classStudents.push(student);
      studentsByClass.set(student.class, classStudents);
    }

    const attendanceByClassroom = new Map(
      dailyAttendanceSessions.map((session) => [
        String(session.classroom),
        session,
      ]),
    );
    const classAttendancePercentages = activeClassrooms.map((classroom) => {
      const students = studentsByClass.get(classroom.name) ?? [];
      const session = attendanceByClassroom.get(String(classroom._id));
      if (students.length === 0) return session?.firstCallSavedAt ? 100 : 0;

      const attendedStudentIds = new Set(
        (session?.entries ?? [])
          .filter((entry) => entry.firstCall || entry.secondCall)
          .map((entry) => String(entry.student)),
      );
      const attended = students.filter((student) =>
        attendedStudentIds.has(String(student._id)),
      ).length;
      return (attended / students.length) * 100;
    });
    const attendancePercentage =
      classAttendancePercentages.length === 0
        ? null
        : Math.round(
            (classAttendancePercentages.reduce(
              (total, percentage) => total + percentage,
              0,
            ) /
              classAttendancePercentages.length) *
              10,
          ) / 10;
    const completedClasses = activeClassrooms.filter((classroom) =>
      dailyAttendanceSessions.some(
        (session) =>
          String(session.classroom) === String(classroom._id) &&
          session.secondCallSavedAt,
      ),
    ).length;
    const departments = new Map();
    for (const staff of staffMembers) {
      const departmentName = staff.department?.trim();
      if (!departmentName) continue;

      const departmentKey = departmentName.toLocaleLowerCase();
      const department =
        departments.get(departmentKey) ??
        { name: departmentName, headOfDepartment: [], staffCount: 0 };
      department.staffCount += 1;
      if (staff.staff_position === "H.O.D") {
        department.headOfDepartment.push(
          `${staff.first_name} ${staff.last_name}`,
        );
      }
      departments.set(departmentKey, department);
    }
    const facultyStatus = [...departments.values()]
      .map((department) => ({
        ...department,
        headOfDepartment:
          department.headOfDepartment.join(", ") || "Not assigned",
      }))
      .sort((first, second) => first.name.localeCompare(second.name));
    const headOfBlocks = SCHOOL_BLOCKS.map((block) => {
      const grade = Number(block.replace("Grade ", ""));
      const blockClassNames = activeClassrooms
        .filter((classroom) => classroom.grade === grade)
        .map((classroom) => classroom.name);
      const totalStudents = blockClassNames.reduce(
        (total, className) =>
          total + (studentsByClass.get(className)?.length ?? 0),
        0,
      );
      const blockStudents = blockClassNames.flatMap(
        (className) => studentsByClass.get(className) ?? [],
      );

      return {
        block,
        totalStudents,
        maleStudents: blockStudents.filter(
          (student) => student.gender?.toLowerCase() === "male",
        ).length,
        femaleStudents: blockStudents.filter(
          (student) => student.gender?.toLowerCase() === "female",
        ).length,
        heads:
          staffMembers
            .filter(
              (staff) =>
                staff.staff_position === "H.O.B" &&
                staff.assigned_block === block,
            )
            .map((staff) => `${staff.first_name} ${staff.last_name}`)
            .join(", ") || "Not assigned",
      };
    });

    const activities = [
      ...reports.map((report) => ({
        id: `report-${report._id}`,
        type: "report",
        title: `${report.submittedByRole === "student" ? "Student" : "Staff"} reported a student`,
        detail: `${report.reportedStudent} · ${report.category}`,
        actor: report.submittedByName,
        createdAt: report.createdAt,
      })),
      ...feedback.map((submission) => ({
        id: `feedback-${submission._id}`,
        type: submission.type,
        title: `${submission.submittedByRole === "student" ? "Student" : "Staff"} sent a ${submission.type}`,
        detail: submission.subject || submission.category,
        actor: submission.anonymous
          ? "Anonymous"
          : submission.submittedByName,
        createdAt: submission.createdAt,
      })),
      ...attendanceSessions.map((session) => ({
        id: `attendance-${session._id}`,
        type: "attendance",
        title: "Class register marked",
        detail: session.className,
        actor: session.markingTeacher
          ? `${session.markingTeacher.first_name} ${session.markingTeacher.last_name}`
          : "Staff member",
        createdAt:
          session.secondCallSavedAt ??
          session.firstCallSavedAt ??
          session.updatedAt,
      })),
      ...resultEntries.map((entry) => ({
        id: `result-${entry._id}`,
        groupKey: [
          entry.className,
          entry.subject,
          entry.academicYear,
          entry.evaluationPeriod,
          String(entry.enteredBy?._id ?? ""),
          new Date(entry.updatedAt).toISOString().slice(0, 16),
        ].join("|"),
        type: "results",
        title: "Student results entered",
        detail: `${entry.subject} · ${entry.className} · ${entry.evaluationPeriod}`,
        actor: entry.enteredBy
          ? `${entry.enteredBy.first_name} ${entry.enteredBy.last_name}`
          : "Staff member",
        createdAt: entry.updatedAt,
      })),
    ];

    const recentActivities = [
      ...new Map(
        activities.map((activity) => [
          activity.groupKey ?? activity.id,
          activity,
        ]),
      ).values(),
    ]
      .sort(
        (first, second) =>
          new Date(second.createdAt) - new Date(first.createdAt),
      )
      .map(({ groupKey, ...activity }) => activity);

    return res.status(200).json({
      stats: {
        totalStudents,
        maleStudents,
        femaleStudents,
        totalStaff: staffMembers.length,
        maleStaff,
        femaleStaff,
        attendancePercentage,
        completedClasses,
        totalClasses: activeClassrooms.length,
      },
      facultyStatus,
      headOfBlocks,
      recentActivities,
    });
  } catch (error) {
    console.error("Admin dashboard overview retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve dashboard overview." });
  }
});

userRouter.get("/student/profile", async (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    return res
      .status(401)
      .json({ message: "A valid access token is required." });
  }

  if (claims.role !== "student" || typeof claims.id !== "string") {
    return res
      .status(403)
      .json({ message: "Only students can access their profile." });
  }

  try {
    const student = await StudentUser.findById(claims.id)
      .select(
        "student_id first_name last_name gender date_of_birth nationality phone_number ethnicity religion previous_school section class enrollment_date guardian_name guardian_phone guardian_email guardian_address status",
      )
      .lean();
    if (!student) {
      return res.status(404).json({ message: "Student account was not found." });
    }

    const classroom = await ClassRoom.findOne({
      name: student.class,
      status: "Active",
    })
      .populate(
        "class_teacher",
        "first_name last_name phone_number email",
      )
      .lean();
    const classTeacher = classroom?.class_teacher;

    return res.status(200).json({
      id: String(student._id),
      fullName: `${student.first_name} ${student.last_name}`,
      studentId: student.student_id,
      section: student.section,
      className: student.class,
      enrollmentDate: student.enrollment_date,
      status: student.status,
      gender: student.gender,
      dateOfBirth: student.date_of_birth,
      nationality: student.nationality,
      phoneNumber: student.phone_number,
      ethnicity: student.ethnicity,
      religion: student.religion,
      previousSchool: student.previous_school,
      guardian: {
        name: student.guardian_name,
        phoneNumber: student.guardian_phone,
        email: student.guardian_email ?? "",
        address: student.guardian_address,
      },
      classTeacher: classTeacher
        ? {
            name: `${classTeacher.first_name} ${classTeacher.last_name}`,
            phoneNumber: classTeacher.phone_number,
            email: classTeacher.email,
          }
        : null,
    });
  } catch (error) {
    console.error("Student profile retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve student profile." });
  }
});

userRouter.get("/student/classmates", async (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    return res
      .status(401)
      .json({ message: "A valid access token is required." });
  }

  if (claims.role !== "student" || typeof claims.id !== "string") {
    return res
      .status(403)
      .json({ message: "Only students can view classmates." });
  }

  try {
    const student = await StudentUser.findById(claims.id)
      .select("class")
      .lean();
    if (!student) {
      return res.status(404).json({ message: "Student account was not found." });
    }

    const classmates = await StudentUser.find({
      class: student.class,
      _id: { $ne: student._id },
      status: "Active",
    })
      .select("student_id first_name last_name gender guardian_address")
      .sort({ last_name: 1, first_name: 1 })
      .lean();

    return res.status(200).json(
      classmates.map((classmate) => ({
        id: String(classmate._id),
        studentId: classmate.student_id,
        name: `${classmate.first_name} ${classmate.last_name}`,
        gender: classmate.gender,
        address: classmate.guardian_address,
      })),
    );
  } catch (error) {
    console.error("Student classmates retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve your classmates." });
  }
});

userRouter.get("/student/subjects", async (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    return res
      .status(401)
      .json({ message: "A valid access token is required." });
  }

  if (claims.role !== "student" || typeof claims.id !== "string") {
    return res
      .status(403)
      .json({ message: "Only students can view their class subjects." });
  }

  try {
    const student = await StudentUser.findById(claims.id)
      .select("class")
      .lean();
    if (!student) {
      return res.status(404).json({ message: "Student account was not found." });
    }

    const classroom = await ClassRoom.findOne({ name: student.class }).lean();
    if (!classroom) {
      return res.status(404).json({
        message: "Your current classroom could not be found.",
      });
    }

    const subjects = await Subject.find({
      section: classroom.section,
      isActive: true,
    })
      .sort({ name: 1 })
      .lean();
    const assignedStaff = await StaffUser.find({
      assigned_classes: classroom.name,
    })
      .select(
        "first_name last_name assigned_subjects subject_taught class_subject_assignments",
      )
      .lean();

    return res.status(200).json({
      className: classroom.name,
      subjects: subjects
        .filter((subject) => isSubjectAvailableForClass(subject, classroom))
        .map((subject) => {
          const subjectTeachers = assignedStaff
            .filter((staff) => {
              const taughtSubjects = staff.assigned_subjects?.length
                ? staff.assigned_subjects
                : [staff.subject_taught];
              const classAssignment = staff.class_subject_assignments?.find(
                (assignment) => assignment.className === classroom.name,
              );
              const subjectsForClass =
                classAssignment?.subjects ?? taughtSubjects;
              return subjectsForClass.some(
                (taughtSubject) =>
                  (LEGACY_SUBJECT_NAMES[taughtSubject] ?? taughtSubject) ===
                  subject.name,
              );
            })
            .map((staff) => `${staff.first_name} ${staff.last_name}`);

          return {
            id: String(subject._id),
            name: subject.name,
            teachers: subjectTeachers,
          };
        }),
    });
  } catch (error) {
    console.error("Student subjects retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve your class subjects." });
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
      "first_name last_name staff_id department staff_position assigned_block subject_taught assigned_subjects assigned_classes class_subject_assignments",
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
        class_subject_assignments: (staff.class_subject_assignments ?? []).map(
          (assignment) => ({
            className: assignment.className,
            subjects: assignment.subjects.map(
              (subject) => LEGACY_SUBJECT_NAMES[subject] ?? subject,
            ),
          }),
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

  const {
    assignedClasses,
    assignedSubjects,
    classSubjectAssignments,
    classTeacherClasses,
    staffPosition,
    assignedBlock,
  } = req.body ?? {};
  const isStringArray = (value) =>
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && item.trim());

  if (
    !isStringArray(assignedClasses) ||
    !isStringArray(assignedSubjects) ||
    !Array.isArray(classSubjectAssignments) ||
    classSubjectAssignments.some(
      (assignment) =>
        !assignment ||
        typeof assignment.className !== "string" ||
        !assignment.className.trim() ||
        !isStringArray(assignment.subjects),
    ) ||
    !isStringArray(classTeacherClasses) ||
    !STAFF_POSITIONS.includes(staffPosition) ||
    (staffPosition === "H.O.B" && !SCHOOL_BLOCKS.includes(assignedBlock)) ||
    (staffPosition !== "H.O.B" &&
      assignedBlock !== undefined &&
      assignedBlock !== null &&
      assignedBlock !== "")
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
  const normalizedClassSubjectAssignments = classSubjectAssignments.map(
    (assignment) => ({
      className: assignment.className.trim(),
      subjects: [...new Set(assignment.subjects.map((subject) => subject.trim()))],
    }),
  );
  const classSubjectClassNames = normalizedClassSubjectAssignments.map(
    (assignment) => assignment.className,
  );
  if (
    new Set(classSubjectClassNames).size !== classSubjectClassNames.length ||
    classSubjectClassNames.length !== normalizedClasses.length ||
    normalizedClasses.some((className) => !classSubjectClassNames.includes(className)) ||
    normalizedClassSubjectAssignments.some((assignment) => !assignment.subjects.length)
  ) {
    return res.status(400).json({
      message: "Choose at least one subject for each assigned teaching class.",
    });
  }
  if (
    normalizedClassSubjectAssignments.some(
      (assignment) =>
        new Set(assignment.subjects).size !== assignment.subjects.length ||
        assignment.subjects.some((subject) => !normalizedSubjects.includes(subject)),
    )
  ) {
    return res.status(400).json({
      message: "Class subject selections must come from the assigned subject list.",
    });
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

    const unavailableAssignment = normalizedClassSubjectAssignments.find(
      (assignment) => {
        const classroom = classrooms.find(
          (item) => item.name === assignment.className,
        );
        return assignment.subjects.some(
          (name) =>
            !subjectsByName
              .get(name)
              ?.some((subject) =>
                isSubjectAvailableForClass(subject, classroom),
              ),
        );
      },
    );
    if (unavailableAssignment) {
      return res.status(400).json({
        message: `One or more selected subjects are not available for ${unavailableAssignment.className}.`,
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
    staff.class_subject_assignments = normalizedClassSubjectAssignments;
    staff.staff_position = staffPosition;
    if (staffPosition === "H.O.B") {
      staff.assigned_block = assignedBlock;
    } else {
      staff.assigned_block = undefined;
    }
    await staff.save();

    return res.status(200).json({
      message: "Staff assignments updated successfully.",
      staff: {
        staff_id: staff.staff_id,
        assigned_classes: staff.assigned_classes,
        assigned_subjects: staff.assigned_subjects,
        class_subject_assignments: staff.class_subject_assignments,
        staff_position: staff.staff_position,
        assigned_block: staff.assigned_block,
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

userRouter.post("/students/:studentId/guardian-access", async (req, res) => {
  if (!isAdminRequest(req, res)) return;
  if (!mongoose.isValidObjectId(req.params.studentId)) {
    return res.status(400).json({ message: "A valid student is required." });
  }

  try {
    const guardianAccess = await provisionGuardianAccess(req.params.studentId);
    return res.status(200).json({ guardianAccess });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    if (error.statusCode === 409) {
      return res.status(409).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "A guardian account with these details already exists. Review the guardian email and existing account.",
      });
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Guardian access provisioning failed:", error.message);
    return res.status(500).json({
      message: "Unable to provision guardian portal access.",
    });
  }
});

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
          : normalizedRole === "guardian"
            ? GuardianUser
          : null;

  if (!userModel) {
    return res
      .status(400)
      .json({ message: "Role must be admin, teacher, student, or guardian." });
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
        : normalizedRole === "guardian"
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
        mustChangePassword: Boolean(user.mustChangePassword),
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
            : claims.role === "guardian"
              ? GuardianUser
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
