import mongoose from "mongoose";

const studentResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentUser",
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    evaluationPeriod: {
      type: String,
      enum: ["First Term", "Second Term", "Third Term"],
      required: true,
    },
    testScore: {
      type: Number,
      required: true,
      min: 0,
      max: 30,
    },
    examScore: {
      type: Number,
      required: true,
      min: 0,
      max: 70,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      enum: ["A", "B", "C", "D", "E", "F"],
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
    },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffUser",
      required: true,
    },
  },
  { timestamps: true },
);

studentResultSchema.index(
  {
    student: 1,
    className: 1,
    subject: 1,
    academicYear: 1,
    evaluationPeriod: 1,
  },
  { unique: true },
);

const StudentResult = mongoose.model("StudentResult", studentResultSchema);

export default StudentResult;
