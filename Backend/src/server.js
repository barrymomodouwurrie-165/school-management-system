import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "./config/db.js";
import userRouter from "./routers/userRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// {
//   "first_name": "Momodou",
//     "last_name": "Barry",
//     "gender": "Male",
//     "nationality":"Gambian",
//     "phone_number":"+220833986565",
//     "email":"barrymomodou@gmail.com",
//     "address":"Manjai Kunda",
//     "ethnicity":"Fula",
//     "marital_status":"Single",
//     "staff_id":"20260010",
//     "qualification":"Bachelor's Degree",
//     "subject_taught":"Mathematics",
//     "department":"Mathematics",
//     "section":"Senior",
//     "employment_type":"Full-time",
//     "start_date":"02/05/2026",
// }
