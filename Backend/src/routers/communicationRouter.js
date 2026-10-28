import express from "express";
import Announcement from "../models/announcement.js";
import NewsArticle from "../models/newsArticle.js";
import FeedbackSubmission from "../models/feedbackSubmission.js";
import StudentReport from "../models/studentReport.js";
import { isAuthentic } from "../models/tokens.js";

const communicationRouter = express.Router();

const getPublisher = (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    res.status(401).json({ message: "A valid access token is required." });
    return null;
  }

  if (claims.role !== "admin") {
    res.status(403).json({ message: "Only admins can publish content." });
    return null;
  }

  if (typeof claims.username !== "string" || !claims.username) {
    res.status(403).json({ message: "A valid admin identity is required." });
    return null;
  }

  return claims.username;
};

const getSubmissionUser = (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    res.status(401).json({ message: "A valid access token is required." });
    return null;
  }

  if (!["student", "teacher"].includes(claims.role)) {
    res
      .status(403)
      .json({ message: "Only students and teachers can send submissions." });
    return null;
  }

  if (
    typeof claims.id !== "string" ||
    typeof claims.username !== "string" ||
    !claims.username
  ) {
    res.status(401).json({ message: "A valid user identity is required." });
    return null;
  }

  return claims;
};

communicationRouter.post("/submissions", async (req, res) => {
  const submitter = getSubmissionUser(req, res);
  if (!submitter) return;

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const submittedBy = {
    submittedById: submitter.id,
    submittedByRole: submitter.role,
    submittedByName: submitter.username,
  };

  try {
    if (body.type === "student-report") {
      const category =
        typeof body.category === "string"
          ? body.category.toLowerCase().replace("behaviour", "behavior")
          : body.category;
      const urgency =
        typeof body.urgency === "string"
          ? body.urgency.toLowerCase().replaceAll(" ", "-")
          : body.urgency;
      const report = await StudentReport.create({
        ...submittedBy,
        reportedStudent: body.student ?? body.reportedStudent ?? body.studentIdentity,
        category,
        urgency,
        description: body.description,
        notifyGuardian:
          body.notifyGuardian ?? body.involveGuardian === "Yes",
        requestCounselor:
          body.requestCounselor ?? body.involveCounselor === "Yes",
      });

      return res.status(201).json(report);
    }

    if (body.type === "suggestion" || body.type === "complaint") {
      const submission = await FeedbackSubmission.create({
        ...submittedBy,
        type: body.type,
        category: body.category,
        subject: body.subject ?? body.headline,
        details: body.details ?? body.suggestion,
        anonymous: body.anonymous ?? false,
        confidential: body.confidential ?? false,
      });

      return res.status(201).json(submission);
    }

    return res
      .status(400)
      .json({ message: "Type must be student-report, suggestion, or complaint." });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    console.error("Submission creation failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to send your submission right now." });
  }
});

communicationRouter.get("/submissions", async (req, res) => {
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
      .json({ message: "Only admins can view all submissions." });
  }

  try {
    const [reports, feedback] = await Promise.all([
      StudentReport.find().sort({ createdAt: -1 }).lean(),
      FeedbackSubmission.find().sort({ createdAt: -1 }).lean(),
    ]);

    const visibleFeedback = feedback.map((submission) => {
      if (!submission.anonymous) return submission;
      const anonymousSubmission = { ...submission };
      delete anonymousSubmission.submittedById;
      delete anonymousSubmission.submittedByName;
      return anonymousSubmission;
    });

    return res.status(200).json({ reports, feedback: visibleFeedback });
  } catch (error) {
    console.error("Submission retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve submissions right now." });
  }
});

communicationRouter.get("/submissions/mine", async (req, res) => {
  const submitter = getSubmissionUser(req, res);
  if (!submitter) return;

  try {
    const [reports, feedback] = await Promise.all([
      StudentReport.find({ submittedById: submitter.id })
        .sort({ createdAt: -1 })
        .lean(),
      FeedbackSubmission.find({ submittedById: submitter.id })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return res.status(200).json({ reports, feedback });
  } catch (error) {
    console.error("Personal submission retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve your submissions right now." });
  }
});

communicationRouter.post("/announcements", async (req, res) => {
  const author = getPublisher(req, res);
  if (!author) return;

  const body = req.body && typeof req.body === "object" ? req.body : {};

  try {
    const announcement = await Announcement.create({
      author,
      subject: body.subject,
      content: body.content,
      recipients: body.recipients,
    });

    return res.status(201).json(announcement);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    console.error("Announcement creation failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to create announcement right now." });
  }
});

communicationRouter.get("/announcements", async (_req, res) => {
  try {
    const announcements = await Announcement.find().sort({ sentAt: -1 });
    return res.status(200).json(announcements);
  } catch (error) {
    console.error("Announcement retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve announcements right now." });
  }
});

communicationRouter.post("/news", async (req, res) => {
  const author = getPublisher(req, res);
  if (!author) return;

  const body = req.body && typeof req.body === "object" ? req.body : {};

  try {
    const article = await NewsArticle.create({
      headline: body.headline,
      story: body.story,
      publicationDate: body.publicationDate,
      imageUrl: body.imageUrl,
    });

    return res.status(201).json(article);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    console.error("News article creation failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to create news article right now." });
  }
});

communicationRouter.get("/news", async (_req, res) => {
  try {
    const articles = await NewsArticle.find().sort({ publicationDate: -1 });
    return res.status(200).json(articles);
  } catch (error) {
    console.error("News article retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve news articles right now." });
  }
});

export default communicationRouter;
