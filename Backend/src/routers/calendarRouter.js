import express from "express";
import mongoose from "mongoose";
import { isAuthentic } from "../models/tokens.js";
import SchoolCalendarEvent from "../models/schoolCalendarEvent.js";

const calendarRouter = express.Router();
const EVENT_TYPES = ["term-date", "school-event"];

const getClaimsForRole = (req, res, role) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    res.status(401).json({ message: "A valid access token is required." });
    return null;
  }

  if (claims.role !== role || typeof claims.id !== "string") {
    res.status(403).json({
      message: `Only ${role}s can access this calendar.`,
    });
    return null;
  }

  return claims;
};

const parseDate = (value) => {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return null;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? null
    : date;
};

const getEventInput = (body) => {
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const description =
    typeof body?.description === "string" ? body.description.trim() : "";
  const type = typeof body?.type === "string" ? body.type : "";
  const startDate = parseDate(body?.startDate);
  const endDate = parseDate(body?.endDate);

  if (!title || title.length > 160) {
    return { error: "Provide an event title of up to 160 characters." };
  }
  if (!EVENT_TYPES.includes(type)) {
    return { error: "Event type must be a term date or school event." };
  }
  if (description.length > 3000) {
    return { error: "Event description must be 3000 characters or fewer." };
  }
  if (!startDate || !endDate) {
    return { error: "Provide valid start and end dates." };
  }
  if (endDate < startDate) {
    return { error: "The end date must be on or after the start date." };
  }

  return {
    value: { title, description, type, startDate, endDate },
  };
};

const getUpcomingEvents = () => {
  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  return SchoolCalendarEvent.find({ endDate: { $gte: today } })
    .sort({ startDate: 1, title: 1 })
    .lean();
};

calendarRouter.get("/events", async (req, res) => {
  if (!getClaimsForRole(req, res, "admin")) return;
  try {
    const events = await SchoolCalendarEvent.find()
      .sort({ startDate: 1, title: 1 })
      .lean();
    return res.status(200).json(events);
  } catch (error) {
    console.error("Admin calendar event retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve calendar events." });
  }
});

calendarRouter.post("/events", async (req, res) => {
  const claims = getClaimsForRole(req, res, "admin");
  if (!claims) return;

  const eventInput = getEventInput(req.body);
  if (eventInput.error) {
    return res.status(400).json({ message: eventInput.error });
  }

  try {
    const event = await SchoolCalendarEvent.create({
      ...eventInput.value,
      createdBy: claims.id,
    });
    return res.status(201).json({
      message: "Calendar event published successfully.",
      event,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Calendar event creation failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to publish the calendar event." });
  }
});

calendarRouter.put("/events/:eventId", async (req, res) => {
  if (!getClaimsForRole(req, res, "admin")) return;
  if (!mongoose.isValidObjectId(req.params.eventId)) {
    return res.status(400).json({ message: "A valid calendar event is required." });
  }

  const eventInput = getEventInput(req.body);
  if (eventInput.error) {
    return res.status(400).json({ message: eventInput.error });
  }

  try {
    const event = await SchoolCalendarEvent.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "Calendar event was not found." });
    }
    Object.assign(event, eventInput.value);
    await event.save();
    return res.status(200).json({
      message: "Calendar event updated successfully.",
      event,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Calendar event update failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to update the calendar event." });
  }
});

calendarRouter.delete("/events/:eventId", async (req, res) => {
  if (!getClaimsForRole(req, res, "admin")) return;
  if (!mongoose.isValidObjectId(req.params.eventId)) {
    return res.status(400).json({ message: "A valid calendar event is required." });
  }

  try {
    const event = await SchoolCalendarEvent.findByIdAndDelete(
      req.params.eventId,
    );
    if (!event) {
      return res.status(404).json({ message: "Calendar event was not found." });
    }
    return res.status(200).json({ message: "Calendar event deleted." });
  } catch (error) {
    console.error("Calendar event deletion failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to delete the calendar event." });
  }
});

calendarRouter.get("/events/student", async (req, res) => {
  if (!getClaimsForRole(req, res, "student")) return;
  try {
    return res.status(200).json(await getUpcomingEvents());
  } catch (error) {
    console.error("Student calendar event retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve upcoming school events." });
  }
});

calendarRouter.get("/events/teacher", async (req, res) => {
  if (!getClaimsForRole(req, res, "teacher")) return;
  try {
    return res.status(200).json(await getUpcomingEvents());
  } catch (error) {
    console.error("Teacher calendar event retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve upcoming school events." });
  }
});

calendarRouter.get("/events/guardian", async (req, res) => {
  if (!getClaimsForRole(req, res, "guardian")) return;
  try {
    return res.status(200).json(await getUpcomingEvents());
  } catch (error) {
    console.error("Guardian calendar event retrieval failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve upcoming school events." });
  }
});

export default calendarRouter;
