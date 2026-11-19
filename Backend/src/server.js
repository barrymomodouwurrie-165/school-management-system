import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "./config/db.js";
import { isAuthentic } from "./models/tokens.js";
import StudentUser from "./models/studentUser.js";
import userRouter from "./routers/userRouter.js";
import communicationRouter from "./routers/communicationRouter.js";
import attendanceRouter from "./routers/attendanceRouter.js";
import academicsRouter from "./routers/academicsRouter.js";
import guardianRouter from "./routers/guardianRouter.js";
import calendarRouter from "./routers/calendarRouter.js";
import { publishDueResultEntryAnnouncements } from "./services/resultEntryNotifications.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const PASSWORD_CHANGE_ALLOWED_ROUTES = new Set([
  "GET /api/users/student/profile",
  "POST /api/users/student/change-password",
  "POST /api/users/logout",
]);

const allowedOrigins = [
  "http://localhost:5173",
  "https://school-management-system-six-smoky.vercel.app",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(async (req, res, next) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    return next();
  }

  if (
    claims.role !== "student" ||
    typeof claims.id !== "string" ||
    PASSWORD_CHANGE_ALLOWED_ROUTES.has(`${req.method} ${req.path}`)
  ) {
    return next();
  }

  try {
    const student = await StudentUser.findById(claims.id)
      .select("mustChangePassword")
      .lean();
    if (student?.mustChangePassword) {
      return res.status(403).json({
        message: "Change your temporary password before accessing the student portal.",
        code: "PASSWORD_CHANGE_REQUIRED",
      });
    }
    return next();
  } catch (error) {
    console.error("Student password status check failed:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to verify student account access." });
  }
});
app.use("/api/users", userRouter);
app.use("/api/communications", communicationRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/academics", academicsRouter);
app.use("/api/guardians", guardianRouter);
app.use("/api/calendar", calendarRouter);

connectDB().then(() => {
  const checkResultEntryDeadlines = () => {
    publishDueResultEntryAnnouncements().catch((error) => {
      console.error("Result entry deadline check failed:", error.message);
    });
  };
  checkResultEntryDeadlines();
  setInterval(checkResultEntryDeadlines, 15_000);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
