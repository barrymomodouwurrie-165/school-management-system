import mongoose from "mongoose";

const guardianAlertAcknowledgementSchema = new mongoose.Schema(
  {
    guardian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GuardianUser",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentUser",
      required: true,
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
    alertKey: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    acknowledgedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

guardianAlertAcknowledgementSchema.index(
  {
    guardian: 1,
    student: 1,
    academicYear: 1,
    evaluationPeriod: 1,
    alertKey: 1,
  },
  { unique: true },
);

const GuardianAlertAcknowledgement = mongoose.model(
  "GuardianAlertAcknowledgement",
  guardianAlertAcknowledgementSchema,
);

export default GuardianAlertAcknowledgement;
