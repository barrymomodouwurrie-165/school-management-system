import mongoose from "mongoose";

const feedbackSubmissionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["suggestion", "complaint"],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    confidential: {
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

const FeedbackSubmission = mongoose.model(
  "FeedbackSubmission",
  feedbackSubmissionSchema,
);

export default FeedbackSubmission;
