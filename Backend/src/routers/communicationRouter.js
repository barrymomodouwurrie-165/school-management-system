import express from "express";
import Announcement from "../models/announcement.js";
import NewsArticle from "../models/newsArticle.js";
import FeedbackSubmission from "../models/feedbackSubmission.js";
import StudentReport from "../models/studentReport.js";
import { isAuthentic } from "../models/tokens.js";
import StudentUser from "../models/studentUser.js";
import StaffUser from "../models/staffUser.js";
import ClassRoom from "../models/classRoom.js";
import Subject from "../models/subject.js";
import SchoolNotice from "../models/schoolNotice.js";

const communicationRouter = express.Router();
const MAX_INLINE_NEWS_IMAGE_LENGTH = 1_500_000;

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

communicationRouter.put("/announcements/:id", async (req, res) => {
  if (!getPublisher(req, res)) return;

  const body = req.body && typeof req.body === "object" ? req.body : {};
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement was not found." });
    }

    announcement.subject = body.subject;
    announcement.content = body.content;
    announcement.recipients = body.recipients;
    await announcement.save();
    return res.status(200).json(announcement);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    console.error("Announcement update failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to update the announcement right now." });
  }
});

communicationRouter.delete("/announcements/:id", async (req, res) => {
  if (!getPublisher(req, res)) return;

  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement was not found." });
    }

    return res.status(200).json({ message: "Announcement deleted." });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    console.error("Announcement deletion failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to delete the announcement right now." });
  }
});

communicationRouter.get("/announcements", async (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    return res
      .status(401)
      .json({ message: "A valid access token is required." });
  }

  const audienceByRole = {
    guardian: "guardians",
    teacher: "staff",
    student: "students",
  };
  const audience = audienceByRole[claims.role];
  if (claims.role !== "admin" && !audience) {
    return res
      .status(403)
      .json({ message: "This account cannot view announcements." });
  }

  try {
    const query =
      claims.role === "admin"
        ? {}
        : { recipients: { $in: [audience, "all"] } };
    const announcementsQuery = Announcement.find(query).sort({ sentAt: -1 });
    if (claims.role !== "admin") announcementsQuery.limit(8);
    const announcements = await announcementsQuery.lean();
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
  const headline =
    typeof body.headline === "string" ? body.headline.trim() : "";
  const story = typeof body.story === "string" ? body.story.trim() : "";
  const imageUrl =
    typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
  const publicationDate =
    typeof body.publicationDate === "string"
      ? new Date(`${body.publicationDate}T00:00:00.000Z`)
      : null;

  if (
    !headline ||
    !story ||
    !publicationDate ||
    Number.isNaN(publicationDate.getTime()) ||
    publicationDate.toISOString().slice(0, 10) !== body.publicationDate
  ) {
    return res.status(400).json({
      message: "Provide a headline, story, and valid publication date.",
    });
  }
  if (imageUrl.startsWith("data:")) {
    if (
      imageUrl.length > MAX_INLINE_NEWS_IMAGE_LENGTH ||
      !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(
        imageUrl,
      )
    ) {
      return res.status(400).json({
        message: "News photos must be a JPEG, PNG, or WebP image up to 1 MB.",
      });
    }
  } else if (imageUrl.length > 2048) {
    return res.status(400).json({ message: "Image URL is too long." });
  }

  try {
    const article = await NewsArticle.create({
      headline,
      story,
      publicationDate,
      ...(imageUrl ? { imageUrl } : {}),
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

communicationRouter.get("/news/admin", async (req, res) => {
  if (!getPublisher(req, res)) return;

  try {
    const articles = await NewsArticle.find()
      .sort({ publicationDate: -1, createdAt: -1 })
      .lean();
    return res.status(200).json(articles);
  } catch (error) {
    console.error("Admin news retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve news articles right now." });
  }
});

communicationRouter.put("/news/:id", async (req, res) => {
  if (!getPublisher(req, res)) return;

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const headline =
    typeof body.headline === "string" ? body.headline.trim() : "";
  const story = typeof body.story === "string" ? body.story.trim() : "";
  const publicationDate =
    typeof body.publicationDate === "string"
      ? new Date(`${body.publicationDate}T00:00:00.000Z`)
      : null;
  const hasImageUrl = Object.hasOwn(body, "imageUrl");
  if (hasImageUrl && typeof body.imageUrl !== "string") {
    return res.status(400).json({ message: "The news photo is invalid." });
  }
  const imageUrl =
    typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";

  if (
    !headline ||
    !story ||
    !publicationDate ||
    Number.isNaN(publicationDate.getTime()) ||
    publicationDate.toISOString().slice(0, 10) !== body.publicationDate
  ) {
    return res.status(400).json({
      message: "Provide a headline, story, and valid publication date.",
    });
  }
  if (imageUrl.startsWith("data:")) {
    if (
      imageUrl.length > MAX_INLINE_NEWS_IMAGE_LENGTH ||
      !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(
        imageUrl,
      )
    ) {
      return res.status(400).json({
        message: "News photos must be a JPEG, PNG, or WebP image up to 1 MB.",
      });
    }
  } else if (imageUrl.length > 2048) {
    return res.status(400).json({ message: "Image URL is too long." });
  }

  try {
    const article = await NewsArticle.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "News article was not found." });
    }

    article.headline = headline;
    article.story = story;
    article.publicationDate = publicationDate;
    if (hasImageUrl) article.imageUrl = imageUrl;
    await article.save();
    return res.status(200).json(article);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    console.error("News article update failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to update the news article right now." });
  }
});

communicationRouter.delete("/news/:id", async (req, res) => {
  if (!getPublisher(req, res)) return;

  try {
    const article = await NewsArticle.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "News article was not found." });
    }

    return res.status(200).json({ message: "News article deleted." });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    console.error("News article deletion failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to delete the news article right now." });
  }
});

communicationRouter.get("/news", async (req, res) => {
  const requestedLimit =
    req.query.limit === undefined ? null : Number(req.query.limit);
  if (
    requestedLimit !== null &&
    (!Number.isInteger(requestedLimit) || requestedLimit < 1)
  ) {
    return res.status(400).json({ message: "News limit must be a positive integer." });
  }

  try {
    let articlesQuery = NewsArticle.find().sort({
      publicationDate: -1,
      createdAt: -1,
    });
    if (requestedLimit !== null) {
      articlesQuery = articlesQuery.limit(requestedLimit);
    }
    const articles = await articlesQuery.lean();
    return res.status(200).json(articles);
  } catch (error) {
    console.error("News article retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve news articles right now." });
  }
});

communicationRouter.get("/public-overview", async (_req, res) => {
  try {
    const [students, teachingStaff, activeClassrooms, subjects] =
      await Promise.all([
        StudentUser.countDocuments({ status: "Active" }),
        StaffUser.countDocuments({ staff_position: { $in: ["Teacher", "H.O.D"] } }),
        ClassRoom.countDocuments({ status: "Active" }),
        Subject.countDocuments({ isActive: true }),
      ]);

    return res.status(200).json({
      students,
      teachingStaff,
      activeClassrooms,
      subjects,
    });
  } catch (error) {
    console.error("Public school overview retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve school statistics right now." });
  }
});

communicationRouter.get("/notices", async (_req, res) => {
  try {
    const notices = await SchoolNotice.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("title message createdAt")
      .lean();
    return res.status(200).json(notices);
  } catch (error) {
    console.error("School notice retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve school notices right now." });
  }
});

communicationRouter.get("/notices/admin", async (req, res) => {
  if (!getPublisher(req, res)) return;

  try {
    const notices = await SchoolNotice.find()
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(notices);
  } catch (error) {
    console.error("Admin school notice retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve school notices right now." });
  }
});

communicationRouter.post("/notices", async (req, res) => {
  const author = getPublisher(req, res);
  if (!author) return;

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!title || !message) {
    return res.status(400).json({
      message: "Provide both a notice title and message.",
    });
  }
  if (title.length > 160 || message.length > 3000) {
    return res.status(400).json({
      message: "The title must be 160 characters or fewer and the message 3,000 characters or fewer.",
    });
  }

  try {
    const notice = await SchoolNotice.create({ title, message, author });
    return res.status(201).json(notice);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    console.error("School notice creation failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to publish the school notice right now." });
  }
});

communicationRouter.put("/notices/:id", async (req, res) => {
  if (!getPublisher(req, res)) return;

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!title || !message) {
    return res.status(400).json({
      message: "Provide both a notice title and message.",
    });
  }
  if (title.length > 160 || message.length > 3000) {
    return res.status(400).json({
      message: "The title must be 160 characters or fewer and the message 3,000 characters or fewer.",
    });
  }

  try {
    const notice = await SchoolNotice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "School notice was not found." });
    }

    notice.title = title;
    notice.message = message;
    await notice.save();
    return res.status(200).json(notice);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    console.error("School notice update failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to update the school notice right now." });
  }
});

communicationRouter.delete("/notices/:id", async (req, res) => {
  if (!getPublisher(req, res)) return;

  try {
    const notice = await SchoolNotice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "School notice was not found." });
    }

    return res.status(200).json({ message: "School notice deleted." });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    console.error("School notice deletion failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to delete the school notice right now." });
  }
});

export default communicationRouter;
