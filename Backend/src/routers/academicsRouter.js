import express from "express";
import mongoose from "mongoose";
import ClassRoom from "../models/classRoom.js";
import Exam from "../models/exam.js";
import StaffUser from "../models/staffUser.js";
import StudentUser from "../models/studentUser.js";
import Subject from "../models/subject.js";
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
