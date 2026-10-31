import express from "express";
import mongoose from "mongoose";
import ClassRoom from "../models/classRoom.js";
import Exam from "../models/exam.js";
import StaffUser from "../models/staffUser.js";
import StudentUser from "../models/studentUser.js";
import StudentResult from "../models/studentResult.js";
import Subject from "../models/subject.js";
import { isSubjectAvailableForClass } from "../data/subjectCatalog.js";
import { isAuthentic } from "../models/tokens.js";

const academicsRouter = express.Router();

const parseDateOnly = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? null
    : date;
};

const serializeExam = (exam) => ({
  ...exam,
  status: new Date(exam.endDate).toISOString().slice(0, 10) <
  new Date().toISOString().slice(0, 10)
    ? "Completed"
    : "Scheduled",
});

const getAdminClaims = (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    res.status(401).json({ message: "A valid access token is required." });
    return null;
  }

  if (claims.role !== "admin") {
    res.status(403).json({ message: "Only administrators can manage academics." });
    return null;
  }

  return claims;
};

const getTeacherClaims = (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    res.status(401).json({ message: "A valid access token is required." });
    return null;
  }

  if (claims.role !== "teacher" || typeof claims.id !== "string") {
    res.status(403).json({ message: "Only teachers can access these records." });
    return null;
  }

  return claims;
};

const getTeacherClassContext = async (teacherId, className) => {
  const [staff, classroom] = await Promise.all([
    StaffUser.findById(teacherId)
      .select("assigned_classes assigned_subjects subject_taught")
      .lean(),
    ClassRoom.findOne({ name: className, status: "Active" }).lean(),
  ]);
  if (!staff || !classroom || !staff.assigned_classes?.includes(className)) {
    return null;
  }

  const assignedSubjects =
    staff.assigned_subjects?.length > 0
      ? staff.assigned_subjects
      : staff.subject_taught
        ? [staff.subject_taught]
        : [];
  const catalogSubjects = await Subject.find({
    name: { $in: assignedSubjects },
    section: classroom.section,
    isActive: true,
  }).lean();
  const allowedSubjects = catalogSubjects
    .filter((subject) => isSubjectAvailableForClass(subject, classroom))
    .map((subject) => subject.name);

  return { staff, classroom, allowedSubjects };
};

const getResultGrade = (total) => {
  if (total >= 80) return "A";
  if (total >= 70) return "B";
  if (total >= 60) return "C";
  if (total >= 50) return "D";
  if (total >= 40) return "E";
  return "F";
};

const isAcademicYear = (value) => {
  if (typeof value !== "string" || !/^\d{4}\/\d{4}$/.test(value)) {
    return false;
  }
  const [start, end] = value.split("/").map(Number);
  return end === start + 1;
};

academicsRouter.get("/classes", async (req, res) => {
  if (!getAdminClaims(req, res)) return;

  try {
    const [classrooms, studentCounts] = await Promise.all([
      ClassRoom.find()
        .select("name grade section program stream_number class_teacher status")
        .populate("class_teacher", "first_name last_name staff_id")
        .sort({ grade: 1, program: 1, stream_number: 1, name: 1 })
        .lean(),
      StudentUser.aggregate([
        { $match: { status: { $ne: "Transferred" } } },
        { $group: { _id: "$class", total: { $sum: 1 } } },
      ]),
    ]);

    const countByClass = new Map(
      studentCounts.map((item) => [item._id, item.total]),
    );

    return res.status(200).json(
      classrooms.map((classroom) => ({
        ...classroom,
        totalStudents: countByClass.get(classroom.name) ?? 0,
      })),
    );
  } catch (error) {
    console.error("Academic class retrieval failed:", error.message);
    return res.status(500).json({ message: "Unable to retrieve classes." });
  }
});

academicsRouter.get("/teacher/classes", async (req, res) => {
  const claims = getTeacherClaims(req, res);
  if (!claims) return;

  try {
    const staff = await StaffUser.findById(claims.id)
      .select("assigned_classes assigned_subjects subject_taught")
      .lean();
    if (!staff) {
      return res.status(404).json({ message: "Teacher account was not found." });
    }

    const classrooms = staff.assigned_classes?.length
      ? await ClassRoom.find({
          name: { $in: staff.assigned_classes },
          status: "Active",
        })
          .sort({ grade: 1, program: 1, stream_number: 1, name: 1 })
          .lean()
      : [];
    const studentClasses = classrooms.map((classroom) => classroom.name);
    const [students, subjects] = await Promise.all([
      studentClasses.length
        ? StudentUser.find({
            class: { $in: studentClasses },
            status: { $ne: "Transferred" },
          })
            .select("_id student_id first_name last_name class status")
            .sort({ last_name: 1, first_name: 1 })
            .lean()
        : [],
      Subject.find({ isActive: true }).sort({ name: 1 }).lean(),
    ]);

    const assignedSubjects =
      staff.assigned_subjects?.length > 0
        ? staff.assigned_subjects
        : staff.subject_taught
          ? [staff.subject_taught]
          : [];

    return res.status(200).json(
      classrooms.map((classroom) => ({
        _id: classroom._id,
        name: classroom.name,
        section: classroom.section,
        program: classroom.program,
        stream_number: classroom.stream_number,
        subjects: subjects
          .filter(
            (subject) =>
              assignedSubjects.includes(subject.name) &&
              subject.section === classroom.section &&
              isSubjectAvailableForClass(subject, classroom),
          )
          .map((subject) => subject.name),
        students: students
          .filter((student) => student.class === classroom.name)
          .map((student) => ({
            id: String(student._id),
            studentId: student.student_id,
            name: `${student.first_name} ${student.last_name}`,
          })),
      })),
    );
  } catch (error) {
    console.error("Teacher result classes retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve your assigned classes." });
  }
});

academicsRouter.get("/teacher/results", async (req, res) => {
  const claims = getTeacherClaims(req, res);
  if (!claims) return;

  const { className, subject, academicYear, evaluationPeriod } = req.query;
  if (
    typeof className !== "string" ||
    typeof subject !== "string" ||
    !isAcademicYear(academicYear) ||
    !["First Term", "Second Term", "Third Term"].includes(evaluationPeriod)
  ) {
    return res.status(400).json({
      message: "Provide a class, subject, academic year, and evaluation period.",
    });
  }

  try {
    const context = await getTeacherClassContext(claims.id, className);
    if (!context || !context.allowedSubjects.includes(subject)) {
      return res
        .status(403)
        .json({ message: "You are not assigned to teach this subject in this class." });
    }

    const activeStudentIds = await StudentUser.distinct("_id", {
      class: className,
      status: { $ne: "Transferred" },
    });
    const results = await StudentResult.find({
      className,
      subject,
      academicYear,
      evaluationPeriod,
      student: { $in: activeStudentIds },
    })
      .select("student testScore examScore total grade updatedAt")
      .lean();

    return res.status(200).json(
      results.map((result) => ({
        studentId: String(result.student),
        testScore: result.testScore,
        examScore: result.examScore,
        total: result.total,
        grade: result.grade,
        updatedAt: result.updatedAt,
      })),
    );
  } catch (error) {
    console.error("Teacher results retrieval failed:", error.message);
    return res.status(500).json({ message: "Unable to retrieve student results." });
  }
});

academicsRouter.post("/teacher/results", async (req, res) => {
  const claims = getTeacherClaims(req, res);
  if (!claims) return;

  const { className, subject, academicYear, evaluationPeriod } = req.body ?? {};
  const entries = req.body?.entries;
  if (
    typeof className !== "string" ||
    typeof subject !== "string" ||
    !isAcademicYear(academicYear) ||
    !["First Term", "Second Term", "Third Term"].includes(evaluationPeriod) ||
    !Array.isArray(entries) ||
    !entries.length
  ) {
    return res.status(400).json({
      message: "Provide a class, subject, year, term, and at least one result.",
    });
  }

  const studentIds = entries.map((entry) => entry?.studentId);
  if (
    studentIds.some(
      (studentId) =>
        typeof studentId !== "string" || !mongoose.isValidObjectId(studentId),
    ) ||
    new Set(studentIds).size !== studentIds.length
  ) {
    return res
      .status(400)
      .json({ message: "Each result must contain a unique valid student ID." });
  }

  const validEntries = [];
  for (const entry of entries) {
    const testScore = entry.testScore;
    const examScore = entry.examScore;
    if (
      typeof testScore !== "number" ||
      typeof examScore !== "number" ||
      !Number.isFinite(testScore) ||
      !Number.isFinite(examScore) ||
      testScore < 0 ||
      testScore > 30 ||
      examScore < 0 ||
      examScore > 70
    ) {
      return res.status(400).json({
        message: "Test scores must be 0-30 and exam scores must be 0-70.",
      });
    }
    validEntries.push({ studentId: entry.studentId, testScore, examScore });
  }

  try {
    const context = await getTeacherClassContext(claims.id, className);
    if (!context || !context.allowedSubjects.includes(subject)) {
      return res
        .status(403)
        .json({ message: "You are not assigned to teach this subject in this class." });
    }

    const students = await StudentUser.find({
      _id: { $in: studentIds },
      class: className,
      status: { $ne: "Transferred" },
    })
      .select("_id student_id first_name last_name")
      .lean();
    if (students.length !== studentIds.length) {
      return res.status(400).json({
        message: "One or more students are not active members of this class.",
      });
    }

    const studentById = new Map(
      students.map((student) => [String(student._id), student]),
    );
    const operations = validEntries.map((entry) => {
      const student = studentById.get(entry.studentId);
      const total = Number((entry.testScore + entry.examScore).toFixed(2));
      return {
        updateOne: {
          filter: {
            student: student._id,
            className,
            subject,
            academicYear,
            evaluationPeriod,
          },
          update: {
            $set: {
              studentId: student.student_id,
              studentName: `${student.first_name} ${student.last_name}`,
              testScore: entry.testScore,
              examScore: entry.examScore,
              total,
              grade: getResultGrade(total),
              enteredBy: claims.id,
            },
          },
          upsert: true,
        },
      };
    });

    await StudentResult.bulkWrite(operations);
    return res.status(200).json({
      message: `Saved results for ${validEntries.length} student${validEntries.length === 1 ? "" : "s"}.`,
      savedCount: validEntries.length,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Teacher results save failed:", error.message);
    return res.status(500).json({ message: "Unable to save student results." });
  }
});

academicsRouter.get("/teacher/exams", async (req, res) => {
  const claims = getTeacherClaims(req, res);
  if (!claims) return;

  try {
    const staff = await StaffUser.findById(claims.id)
      .select("assigned_classes")
      .lean();
    if (!staff) {
      return res.status(404).json({ message: "Teacher account was not found." });
    }

    const sections = staff.assigned_classes?.length
      ? await ClassRoom.distinct("section", {
          name: { $in: staff.assigned_classes },
          status: "Active",
        })
      : [];
    if (!sections.length) return res.status(200).json([]);

    const exams = await Exam.find({
      section: { $in: [...sections, "Both"] },
    })
      .sort({ startDate: 1, title: 1 })
      .lean();
    return res.status(200).json(exams.map(serializeExam));
  } catch (error) {
    console.error("Teacher exam retrieval failed:", error.message);
    return res.status(500).json({ message: "Unable to retrieve scheduled exams." });
  }
});

academicsRouter.get("/subjects", async (req, res) => {
  if (!getAdminClaims(req, res)) return;

  try {
    const subjects = await Subject.find({ isActive: true })
      .sort({ section: 1, name: 1 })
      .lean();
    return res.status(200).json(subjects);
  } catch (error) {
    console.error("Academic subject retrieval failed:", error.message);
    return res.status(500).json({ message: "Unable to retrieve subjects." });
  }
});

academicsRouter.post("/subjects", async (req, res) => {
  if (!getAdminClaims(req, res)) return;

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const { section } = req.body ?? {};
  const programs = Array.isArray(req.body?.programs)
    ? [...new Set(req.body.programs)]
    : [];
  const validPrograms =
    section === "Junior"
      ? [..."ABCDEFGHIJKLM"]
      : section === "Senior"
        ? [
            "Science",
            "Arts",
            "Commerce",
            "Agric",
            "Home Economics",
            "Technical",
          ]
        : [];

  if (
    !name ||
    name.length > 100 ||
    !["Junior", "Senior"].includes(section) ||
    !programs.length ||
    programs.some((program) => !validPrograms.includes(program))
  ) {
    return res.status(400).json({
      message: "Provide a subject name, section, and valid class programs.",
    });
  }

  try {
    const subjectsInSection = await Subject.find({ section });
    const existing = subjectsInSection.find(
      (subject) => subject.name.toLowerCase() === name.toLowerCase(),
    );
    if (existing?.isActive) {
      return res.status(409).json({
        message: "A subject with this name already exists in this section.",
      });
    }

    const subject = existing
      ? await Subject.findByIdAndUpdate(
          existing._id,
          { $set: { name, programs, isActive: true } },
          { new: true, runValidators: true },
        )
      : await Subject.create({ name, section, programs });

    return res.status(201).json({
      message: "Subject added successfully.",
      subject,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A subject with this name already exists in this section.",
      });
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Academic subject creation failed:", error.message);
    return res.status(500).json({ message: "Unable to add the subject." });
  }
});

academicsRouter.delete("/subjects/:id", async (req, res) => {
  if (!getAdminClaims(req, res)) return;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid subject ID." });
  }

  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      isActive: true,
    });
    if (!subject) {
      return res.status(404).json({ message: "Subject was not found." });
    }

    const staffMembers = await StaffUser.find({
      $or: [
        { subject_taught: subject.name },
        { assigned_subjects: subject.name },
      ],
    })
      .select("subject_taught assigned_subjects")
      .lean();
    const operations = staffMembers.map((staff) => {
      const remainingAssignments = (staff.assigned_subjects ?? []).filter(
        (name) => name !== subject.name,
      );
      const update = { $pull: { assigned_subjects: subject.name } };
      if (staff.subject_taught === subject.name) {
        update.$set = {
          subject_taught: remainingAssignments[0] ?? "Unassigned",
        };
      }
      return {
        updateOne: {
          filter: { _id: staff._id },
          update,
        },
      };
    });
    if (operations.length) {
      await StaffUser.bulkWrite(operations);
    }

    subject.isActive = false;
    await subject.save();

    return res.status(200).json({
      message: "Subject deleted and removed from staff assignments.",
      subjectId: String(subject._id),
    });
  } catch (error) {
    console.error("Academic subject deletion failed:", error.message);
    return res.status(500).json({ message: "Unable to delete the subject." });
  }
});

academicsRouter.get("/exams", async (req, res) => {
  if (!getAdminClaims(req, res)) return;

  try {
    const exams = await Exam.find()
      .sort({ startDate: 1, title: 1 })
      .lean();
    return res.status(200).json(exams.map(serializeExam));
  } catch (error) {
    console.error("Academic exam retrieval failed:", error.message);
    return res.status(500).json({ message: "Unable to retrieve exams." });
  }
});

academicsRouter.post("/exams", async (req, res) => {
  if (!getAdminClaims(req, res)) return;

  const title =
    typeof req.body?.title === "string" ? req.body.title.trim() : "";
  const startDate = parseDateOnly(req.body?.startDate);
  const endDate = parseDateOnly(req.body?.endDate);
  const { section } = req.body ?? {};

  if (
    !title ||
    !startDate ||
    !endDate ||
    !["Junior", "Senior", "Both"].includes(section)
  ) {
    return res.status(400).json({
      message: "Provide an exam title, valid start and end dates, and section.",
    });
  }
  if (endDate < startDate) {
    return res.status(400).json({
      message: "Exam end date must be on or after the start date.",
    });
  }

  try {
    const exam = await Exam.create({ title, startDate, endDate, section });
    return res.status(201).json({
      message: "Exam created successfully.",
      exam: serializeExam(exam.toObject()),
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Academic exam creation failed:", error.message);
    return res.status(500).json({ message: "Unable to create the exam." });
  }
});

academicsRouter.post("/classes", async (req, res) => {
  if (!getAdminClaims(req, res)) return;

  const grade = Number(req.body?.grade);
  const { section, program } = req.body ?? {};
  const streamNumber =
    req.body?.stream_number === "" || req.body?.stream_number === undefined
      ? undefined
      : Number(req.body.stream_number);
  const isJuniorProgram =
    typeof program === "string" && [..."ABCDEFGHIJKLM"].includes(program);
  const isSeniorProgram = [
    "Science",
    "Arts",
    "Commerce",
    "Agric",
    "Home Economics",
    "Technical",
  ].includes(program);

  if (
    !Number.isInteger(grade) ||
    !["Junior", "Senior"].includes(section) ||
    (section === "Junior" && (grade < 7 || grade > 9 || !isJuniorProgram)) ||
    (section === "Senior" && (grade < 10 || grade > 12 || !isSeniorProgram)) ||
    (section === "Junior" && streamNumber !== undefined) ||
    (section === "Senior" &&
      program !== "Technical" &&
      ![1, 2].includes(streamNumber)) ||
    (program === "Technical" && streamNumber !== undefined)
  ) {
    return res.status(400).json({
      message: "Provide a valid grade, section, program, and stream combination.",
    });
  }

  const name = `Grade ${grade} ${program}${
    streamNumber === undefined ? "" : ` ${streamNumber}`
  }`;

  try {
    const classroom = await ClassRoom.create({
      name,
      grade,
      section,
      program,
      ...(streamNumber === undefined ? {} : { stream_number: streamNumber }),
    });

    return res.status(201).json({
      message: "Class created successfully.",
      classroom: { ...classroom.toObject(), totalStudents: 0 },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "This class already exists." });
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Academic class creation failed:", error.message);
    return res.status(500).json({ message: "Unable to create the class." });
  }
});

export default academicsRouter;
