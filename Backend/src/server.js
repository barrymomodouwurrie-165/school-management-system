import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "./config/db.js";
import userRouter from "./routers/userRouter.js";
import communicationRouter from "./routers/communicationRouter.js";
import attendanceRouter from "./routers/attendanceRouter.js";
import academicsRouter from "./routers/academicsRouter.js";
import guardianRouter from "./routers/guardianRouter.js";
import { publishDueResultEntryAnnouncements } from "./services/resultEntryNotifications.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.FRONTEND_URL ||
  "https://school-management-system-six-smoky.vercel.app")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use("/api/users", userRouter);
app.use("/api/communications", communicationRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/academics", academicsRouter);
app.use("/api/guardians", guardianRouter);

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
