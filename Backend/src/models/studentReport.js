import mongoose from "mongoose";

const studentReportSchema = new mongoose.Schema(
  {
    reportedStudent: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "behavior",
        "academic",
        "attendance",
        "bullying",
        "other",
      ],
      required: true,
    },
    urgency: {
      type: String,
      enum: ["standard", "urgent", "very-urgent"],
      default: "standard",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    notifyGuardian: {
      type: Boolean,
      default: false,
    },
    requestCounselor: {
      type: Boolean,
      default: false,
    },
    submittedById: {
      type: String,
      required: true,
    },
    submittedByRole: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
    },
    submittedByName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const StudentReport = mongoose.model("StudentReport", studentReportSchema);

export default StudentReport;
