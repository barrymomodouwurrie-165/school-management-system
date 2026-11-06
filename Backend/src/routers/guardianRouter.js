import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import GuardianUser from "../models/guardianUser.js";
import GuardianAlertAcknowledgement from "../models/guardianAlertAcknowledgement.js";
import StudentUser from "../models/studentUser.js";
import AttendanceSession from "../models/attendanceSession.js";
import StudentResult from "../models/studentResult.js";
import Exam from "../models/exam.js";
import FeedbackSubmission from "../models/feedbackSubmission.js";
import { getAcademicPeriod, TERMS } from "../utils/academicPeriod.js";
import { isAuthentic } from "../models/tokens.js";

const guardianRouter = express.Router();
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const getGuardianClaims = (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    res.status(401).json({ message: "A valid access token is required." });
    return null;
  }

  if (claims.role !== "guardian" || typeof claims.id !== "string") {
    res.status(403).json({ message: "Only guardians can access this portal." });
    return null;
  }

  return claims;
};

const getAcademicYearLabel = (shortLabel) => {
  const startYear = Number(shortLabel.slice(0, 4));
  return `${startYear}/${startYear + 1}`;
};

const getPreviousPeriod = (academicYear, term) => {
  const termIndex = TERMS.indexOf(term);
  if (termIndex > 0) {
    return { academicYear, evaluationPeriod: TERMS[termIndex - 1] };
  }
  const previousStartYear = Number(academicYear.slice(0, 4)) - 1;
  return {
    academicYear: `${previousStartYear}/${previousStartYear + 1}`,
    evaluationPeriod: TERMS[TERMS.length - 1],
  };
};

const getAverage = (results) =>
  results.length
    ? Number(
        (
          results.reduce((total, result) => total + result.total, 0) /
          results.length
        ).toFixed(1),
      )
    : null;

const getStatus = (entry, isComplete) => {
  if (entry?.firstCall) return "Present";
  if (entry?.secondCall) return "Late";
  return isComplete ? "Absent" : "Pending";
};

const isCurrentGuardianForStudent = (guardian, student) => {
  const studentEmail =
    typeof student.guardian_email === "string"
      ? student.guardian_email.trim().toLowerCase()
      : "";

  if (guardian.email) return studentEmail === guardian.email;
  return (
    !studentEmail &&
    guardian.username === `guardian-${student.student_id}`.toLowerCase()
  );
};

const getGuardianPortalData = async (guardian) => {
  const linkedStudents = (await StudentUser.find({
    _id: { $in: guardian.students },
    status: { $ne: "Transferred" },
  })
    .select(
      "_id student_id first_name last_name class section status guardian_email",
    )
    .sort({ last_name: 1, first_name: 1 })
    .lean()).filter((student) => isCurrentGuardianForStudent(guardian, student));

  const period = getAcademicPeriod();
  const evaluationPeriod = period.term || TERMS[TERMS.length - 1];
  const startYear = Number(period.academicYear.slice(0, 4));
  const academicYear = getAcademicYearLabel(period.academicYear);
  const yearStart = new Date(Date.UTC(startYear, 8, 16));
  const yearEnd = new Date(Date.UTC(startYear + 1, 8, 16));
  const today = new Date();
  const todayStart = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );
  const examHorizon = new Date(todayStart.getTime() + 7 * DAY_IN_MILLISECONDS);

  const children = await Promise.all(
    linkedStudents.map(async (student) => {
      const previousPeriod = getPreviousPeriod(academicYear, evaluationPeriod);
      const [currentResults, previousResults, sessions, exams] =
        await Promise.all([
          StudentResult.find({
            student: student._id,
            className: student.class,
            academicYear,
            evaluationPeriod,
            published: true,
          })
            .select("subject total grade publishedAt")
            .sort({ subject: 1 })
            .lean(),
          StudentResult.find({
            student: student._id,
            className: student.class,
            academicYear: previousPeriod.academicYear,
            evaluationPeriod: previousPeriod.evaluationPeriod,
            published: true,
          })
            .select("subject total")
            .lean(),
          AttendanceSession.find({
            date: { $gte: yearStart, $lt: yearEnd },
            "entries.student": student._id,
          })
            .select("date entries secondCallSavedAt term")
            .sort({ date: -1 })
            .lean(),
          Exam.find({
            section: { $in: [student.section, "Both"] },
            endDate: { $gte: todayStart },
          })
            .select("title startDate endDate section")
            .sort({ startDate: 1 })
            .lean(),
        ]);

      const termSessions = sessions.filter(
        (session) =>
          (session.term || getAcademicPeriod(session.date).term) ===
          evaluationPeriod,
      );
      const completeSessions = termSessions.filter(
        (session) => session.secondCallSavedAt,
      );
      const presentSessions = completeSessions.filter((session) => {
        const entry = session.entries.find(
          (item) => String(item.student) === String(student._id),
        );
        return entry?.firstCall || entry?.secondCall;
      });
      const attendanceRate = completeSessions.length
        ? Math.round((presentSessions.length / completeSessions.length) * 1000) /
          10
        : null;
      const currentAverage = getAverage(currentResults);
      const previousAverage = getAverage(previousResults);
      const subjectResults = currentResults.map((result) => ({
        subject: result.subject,
        total: result.total,
        grade: result.grade,
        publishedAt: result.publishedAt,
      }));
      const upcomingExams = exams.map((exam) => ({
        id: String(exam._id),
        title: exam.title,
        startDate: exam.startDate,
        endDate: exam.endDate,
        withinAWeek:
          new Date(exam.startDate).getTime() <= examHorizon.getTime(),
      }));
      const alerts = [];

      if (completeSessions.length >= 5 && attendanceRate < 85) {
        alerts.push({
          key: "low-attendance",
          title: "Attendance needs attention",
          message: `Term attendance is ${attendanceRate}% (${presentSessions.length} of ${completeSessions.length} completed days).`,
        });
      }
      if (currentResults.length >= 2 && currentAverage < 50) {
        alerts.push({
          key: "low-term-progress",
          title: "Term progress may need support",
          message: `Published results average ${currentAverage}% across ${currentResults.length} subjects.`,
        });
      }
      if (
        previousAverage !== null &&
        currentAverage !== null &&
        previousResults.length >= 2 &&
        currentResults.length >= 2 &&
        previousAverage - currentAverage >= 10
      ) {
        alerts.push({
          key: "progress-decline",
          title: "Progress has changed",
          message: `Published average is down ${Number(
            (previousAverage - currentAverage).toFixed(1),
          )} points compared with ${previousPeriod.evaluationPeriod}.`,
        });
      }
      for (const exam of upcomingExams.filter((item) => item.withinAWeek)) {
        alerts.push({
          key: `upcoming-exam-${exam.id}`,
          title: "Upcoming exam",
          message: `${exam.title} begins ${new Date(exam.startDate).toLocaleDateString("en-CA", { timeZone: "UTC" })}.`,
        });
      }

      return {
        id: String(student._id),
        studentId: student.student_id,
        fullName: `${student.first_name} ${student.last_name}`,
        className: student.class,
        section: student.section,
        academicYear,
        term: evaluationPeriod,
        previousPeriod,
        progress: {
          average: currentAverage,
          previousAverage,
          publishedSubjects: subjectResults,
          publishedSubjectCount: subjectResults.length,
        },
        attendance: {
          rate: attendanceRate,
          completedDays: completeSessions.length,
          presentDays: presentSessions.length,
          absences: completeSessions.length - presentSessions.length,
          recentDays: termSessions.slice(0, 7).map((session) => {
            const entry = session.entries.find(
              (item) => String(item.student) === String(student._id),
            );
            return {
              date: session.date,
              status: getStatus(entry, Boolean(session.secondCallSavedAt)),
            };
          }),
        },
        upcomingExams,
        alerts,
      };
    }),
  );

  const acknowledgements = await GuardianAlertAcknowledgement.find({
    guardian: guardian._id,
    student: { $in: linkedStudents.map((student) => student._id) },
    academicYear,
    evaluationPeriod,
  })
    .select("student alertKey acknowledgedAt")
    .lean();
  const acknowledgedKeys = new Set(
    acknowledgements.map(
      (item) => `${item.student}:${item.alertKey}`,
    ),
  );

  for (const child of children) {
    child.alerts = child.alerts.map((alert) => ({
      ...alert,
      acknowledged: acknowledgedKeys.has(`${child.id}:${alert.key}`),
    }));
  }

  return {
    guardian: { fullName: guardian.fullName, mustChangePassword: false },
    academicYear,
    term: evaluationPeriod,
    children,
  };
};

guardianRouter.get("/me", async (req, res) => {
  const claims = getGuardianClaims(req, res);
  if (!claims) return;

  try {
    const guardian = await GuardianUser.findById(claims.id);
    if (!guardian) {
      return res.status(404).json({ message: "Guardian account was not found." });
    }
    if (guardian.mustChangePassword) {
      return res.status(200).json({ mustChangePassword: true });
    }

    return res.status(200).json(await getGuardianPortalData(guardian));
  } catch (error) {
    console.error("Guardian portal retrieval failed:", error.message);
    return res.status(500).json({
      message: "Unable to retrieve guardian progress right now.",
    });
  }
});

guardianRouter.post("/change-password", async (req, res) => {
  const claims = getGuardianClaims(req, res);
  if (!claims) return;

  const { currentPassword, newPassword } = req.body ?? {};
  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    newPassword.length < 10 ||
    newPassword.length > 128
  ) {
    return res.status(400).json({
      message: "Provide your current password and a new password of 10 to 128 characters.",
    });
  }

  try {
    const guardian = await GuardianUser.findById(claims.id).select("+password");
    if (!guardian) {
      return res.status(404).json({ message: "Guardian account was not found." });
    }
    if (!(await bcrypt.compare(currentPassword, guardian.password))) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }
    guardian.password = newPassword;
    guardian.mustChangePassword = false;
    await guardian.save();
    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Guardian password update failed:", error.message);
    return res.status(500).json({ message: "Unable to update guardian password." });
  }
});

guardianRouter.post("/acknowledgements", async (req, res) => {
  const claims = getGuardianClaims(req, res);
  if (!claims) return;

  const { studentId, alertKey } = req.body ?? {};
  if (
    typeof studentId !== "string" ||
    !mongoose.isValidObjectId(studentId) ||
    typeof alertKey !== "string" ||
    alertKey.length > 120
  ) {
    return res.status(400).json({
      message: "Provide a valid child and alert to acknowledge.",
    });
  }

  try {
    const guardian = await GuardianUser.findById(claims.id);
    if (!guardian) {
      return res.status(404).json({ message: "Guardian account was not found." });
    }
    if (guardian.mustChangePassword) {
      return res.status(403).json({
        message: "Change your temporary password before accessing the portal.",
      });
    }
    const isLinked = guardian.students.some(
      (id) => String(id) === studentId,
    );
    if (!isLinked) {
      return res.status(403).json({
        message: "You can only acknowledge alerts for your linked children.",
      });
    }

    const student = await StudentUser.findOne({
      _id: studentId,
      status: { $ne: "Transferred" },
    })
      .select("_id student_id guardian_email")
      .lean();
    if (
      !student ||
      !isCurrentGuardianForStudent(guardian, student) ||
      !guardian.students.some((id) => String(id) === studentId)
    ) {
      return res.status(404).json({ message: "Child record was not found." });
    }

    const portalData = await getGuardianPortalData(guardian);
    const child = portalData.children.find((item) => item.id === studentId);
    const alert = child?.alerts.find((item) => item.key === alertKey);
    if (!alert) {
      return res.status(404).json({
        message: "This alert is no longer active.",
      });
    }

    const acknowledgement = await GuardianAlertAcknowledgement.findOneAndUpdate(
      {
        guardian: guardian._id,
        student: student._id,
        academicYear: child.academicYear,
        evaluationPeriod: child.term,
        alertKey,
      },
      { $setOnInsert: { acknowledgedAt: new Date() } },
      { new: true, upsert: true },
    ).lean();

    return res.status(200).json({
      alertKey,
      acknowledgedAt: acknowledgement.acknowledgedAt,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This alert has already been acknowledged.",
      });
    }
    console.error("Guardian alert acknowledgement failed:", error.message);
    return res.status(500).json({
      message: "Unable to acknowledge this alert.",
    });
  }
});

guardianRouter.post("/contact", async (req, res) => {
  const claims = getGuardianClaims(req, res);
  if (!claims) return;

  const { type, category, subject, details, studentId } = req.body ?? {};
  if (
    !["suggestion", "complaint"].includes(type) ||
    typeof category !== "string" ||
    !category.trim() ||
    typeof subject !== "string" ||
    !subject.trim() ||
    subject.trim().length > 160 ||
    typeof details !== "string" ||
    !details.trim() ||
    details.trim().length > 3000 ||
    category.trim().length > 100 ||
    typeof studentId !== "string" ||
    !mongoose.isValidObjectId(studentId)
  ) {
    return res.status(400).json({
      message: "Choose a child and provide a valid message category, subject, and details.",
    });
  }

  try {
    const guardian = await GuardianUser.findById(claims.id);
    if (!guardian) {
      return res.status(404).json({ message: "Guardian account was not found." });
    }
    if (guardian.mustChangePassword) {
      return res.status(403).json({
        message: "Change your temporary password before contacting the school.",
      });
    }
    const student = await StudentUser.findById(studentId)
      .select("student_id guardian_email first_name last_name")
      .lean();
    if (
      !student ||
      !guardian.students.some((id) => String(id) === studentId) ||
      !isCurrentGuardianForStudent(guardian, student)
    ) {
      return res.status(404).json({ message: "Child record was not found." });
    }

    const submission = await FeedbackSubmission.create({
      type,
      category: category.trim(),
      subject: `Regarding ${student.first_name} ${student.last_name}: ${subject.trim()}`,
      details: details.trim(),
      anonymous: false,
      confidential: false,
      submittedById: guardian._id,
      submittedByRole: "guardian",
      submittedByName: guardian.fullName,
    });

    return res.status(201).json({
      message: `Your message about ${student.first_name} ${student.last_name} was sent to the school.`,
      submissionId: submission._id,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Guardian contact submission failed:", error.message);
    return res.status(500).json({
      message: "Unable to send your message to the school right now.",
    });
  }
});

export default guardianRouter;
