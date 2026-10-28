import express from "express";
import mongoose from "mongoose";
import AttendanceSession from "../models/attendanceSession.js";
import ClassRoom from "../models/classRoom.js";
import StudentUser from "../models/studentUser.js";
import { isAuthentic } from "../models/tokens.js";

const attendanceRouter = express.Router();

const getTeacherClaims = (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    res.status(401).json({ message: "A valid access token is required." });
    return null;
  }

  if (claims.role !== "teacher") {
    res.status(403).json({ message: "Only teachers can access attendance." });
    return null;
  }

  return claims;
};

const getClassDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? null
    : date;
};

const getTeacherClass = async (classId, teacherId) => {
  if (!mongoose.isValidObjectId(classId)) return null;
  return ClassRoom.findOne({
    _id: classId,
    class_teacher: teacherId,
    status: "Active",
  });
};

const getClassStudents = (className) =>
  StudentUser.find({ class: className, status: { $ne: "Transferred" } })
    .select("_id student_id first_name last_name")
    .sort({ last_name: 1, first_name: 1 })
    .lean();

const buildAttendanceEntries = (students, entries, call) => {
  if (!Array.isArray(entries) || entries.length !== students.length) {
    return null;
  }

  const marksByStudent = new Map();
  for (const entry of entries) {
    if (
      !entry ||
      typeof entry.studentId !== "string" ||
      typeof entry[call] !== "boolean" ||
      marksByStudent.has(entry.studentId)
    ) {
      return null;
    }
    marksByStudent.set(entry.studentId, entry[call]);
  }

  if (students.some((student) => !marksByStudent.has(String(student._id)))) {
    return null;
  }

  return students.map((student) => ({
    student: student._id,
    studentId: student.student_id,
    studentName: `${student.first_name} ${student.last_name}`,
    firstCall:
      call === "firstCall"
        ? marksByStudent.get(String(student._id))
        : false,
    secondCall:
      call === "secondCall"
        ? marksByStudent.get(String(student._id))
        : false,
  }));
};

attendanceRouter.get("/classes", async (req, res) => {
  const claims = getTeacherClaims(req, res);
  if (!claims) return;

  try {
    const classrooms = await ClassRoom.find({
      class_teacher: claims.id,
      status: "Active",
    })
      .select("_id name")
      .sort({ name: 1 })
      .lean();

    const classesWithStudents = await Promise.all(
      classrooms.map(async (classroom) => ({
        ...classroom,
        students: await getClassStudents(classroom.name),
      })),
    );

    return res.status(200).json(classesWithStudents);
  } catch (error) {
    console.error("Attendance class retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve your classes right now." });
  }
});

attendanceRouter.get("/classes/:classId/sessions", async (req, res) => {
  const claims = getTeacherClaims(req, res);
  if (!claims) return;

  try {
    const classroom = await getTeacherClass(req.params.classId, claims.id);
    if (!classroom) {
      return res
        .status(403)
        .json({ message: "You are not the class teacher for this class." });
    }

    const query = { classroom: classroom._id };
    if (req.query.date !== undefined) {
      const date = getClassDate(req.query.date);
      if (!date) {
        return res
          .status(400)
          .json({ message: "Date must use the YYYY-MM-DD format." });
      }
      query.date = date;
      const session = await AttendanceSession.findOne(query).lean();
      return res.status(200).json(session);
    }

    const sessions = await AttendanceSession.find(query)
      .sort({ date: -1 })
      .lean();
    return res.status(200).json(sessions);
  } catch (error) {
    console.error("Attendance retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve attendance right now." });
  }
});

attendanceRouter.post("/classes/:classId/sessions", async (req, res) => {
  const claims = getTeacherClaims(req, res);
  if (!claims) return;

  const body = req.body && typeof req.body === "object" ? req.body : {};
  if (!["first", "second"].includes(body.call)) {
    return res
      .status(400)
      .json({ message: "Call must be either first or second." });
  }

  const date = getClassDate(body.date);
  if (!date) {
    return res
      .status(400)
      .json({ message: "Date must use the YYYY-MM-DD format." });
  }
  const today = getClassDate(new Date().toISOString().slice(0, 10));
  if (date > today || date.getUTCDay() === 0 || date.getUTCDay() === 6) {
    return res.status(400).json({
      message: "Attendance can only be marked for a school day up to today.",
    });
  }

  if (
    typeof body.academicYear !== "string" ||
    !/^\d{4}\/\d{2,4}$/.test(body.academicYear.trim())
  ) {
    return res
      .status(400)
      .json({ message: "A valid academic year is required." });
  }

  try {
    const classroom = await getTeacherClass(req.params.classId, claims.id);
    if (!classroom) {
      return res
        .status(403)
        .json({ message: "You are not the class teacher for this class." });
    }

    const students = await getClassStudents(classroom.name);
    const callKey = body.call === "first" ? "firstCall" : "secondCall";
    const callEntries = buildAttendanceEntries(students, body.entries, callKey);
    if (!callEntries) {
      return res.status(400).json({
        message:
          "Attendance must include exactly one mark for every student in the class.",
      });
    }

    const existingSession = await AttendanceSession.findOne({
      classroom: classroom._id,
      date,
    });

    if (body.call === "first") {
      if (existingSession) {
        return res.status(409).json({
          message: "The first call has already been saved for this date.",
        });
      }

      const session = await AttendanceSession.create({
        classroom: classroom._id,
        className: classroom.name,
        date,
        academicYear: body.academicYear.trim(),
        markingTeacher: claims.id,
        entries: callEntries,
        firstCallSavedAt: new Date(),
      });
      return res.status(201).json(session);
    }

    if (!existingSession) {
      return res.status(409).json({
        message: "Save the first call before saving the second call.",
      });
    }

    if (existingSession.secondCallSavedAt) {
      return res.status(409).json({
        message: "The second call has already been saved for this date.",
      });
    }

    const existingByStudent = new Map(
      existingSession.entries.map((entry) => [String(entry.student), entry]),
    );
    if (students.some((student) => !existingByStudent.has(String(student._id)))) {
      return res.status(409).json({
        message: "The class roster changed after the first call was saved.",
      });
    }

    for (const entry of callEntries) {
      existingByStudent.get(String(entry.student)).secondCall = entry.secondCall;
    }
    existingSession.secondCallSavedAt = new Date();
    await existingSession.save();

    return res.status(200).json(existingSession);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Attendance for this class and date has already been started.",
      });
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Attendance save failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to save attendance right now." });
  }
});

export default attendanceRouter;
