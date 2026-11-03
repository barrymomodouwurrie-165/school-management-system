import mongoose from "mongoose";

const resultEntryWindowSchema = new mongoose.Schema(
  {
    academicYear: {
      type: String,
      required: true,
    },
    evaluationPeriod: {
      type: String,
      enum: ["First Term", "Second Term", "Third Term"],
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    deadlineAt: {
      type: Date,
      default: null,
    },
    deadlineAnnouncementSentAt: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
  },
  { timestamps: true },
);

resultEntryWindowSchema.index(
  { academicYear: 1, evaluationPeriod: 1 },
  { unique: true },
);

const ResultEntryWindow = mongoose.model(
  "ResultEntryWindow",
  resultEntryWindowSchema,
);

export default ResultEntryWindow;
