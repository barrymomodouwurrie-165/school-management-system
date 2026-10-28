import express from "express";
import Announcement from "../models/announcement.js";
import NewsArticle from "../models/newsArticle.js";
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
