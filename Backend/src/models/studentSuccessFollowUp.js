import mongoose from "mongoose";

const studentSuccessFollowUpSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentUser",
      required: true,
    },
    className: {
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
    action: {
      type: String,
      enum: [
        "student-meeting",
        "guardian-contact",
        "academic-support",
        "attendance-check-in",
        "other",
      ],
      required: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["Open", "Resolved"],
      default: "Open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffUser",
      required: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

studentSuccessFollowUpSchema.index({
  student: 1,
  className: 1,
  academicYear: 1,
  evaluationPeriod: 1,
  createdAt: -1,
});

const StudentSuccessFollowUp = mongoose.model(
  "StudentSuccessFollowUp",
  studentSuccessFollowUpSchema,
);

export default StudentSuccessFollowUp;
