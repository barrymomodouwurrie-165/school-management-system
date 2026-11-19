import mongoose from "mongoose";

const WORKFLOW_STATUSES = ["open", "in-progress", "resolved"];

const assignedToSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const internalNoteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true, trim: true, maxlength: 3000 },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

const resolutionHistorySchema = new mongoose.Schema(
  {
    fromStatus: { type: String, enum: WORKFLOW_STATUSES, required: true },
    toStatus: { type: String, enum: WORKFLOW_STATUSES, required: true },
    note: { type: String, trim: true, maxlength: 3000, default: "" },
    changedById: { type: String, required: true },
    changedByName: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

export const createSubmissionWorkflowFields = () => ({
  status: {
    type: String,
    enum: WORKFLOW_STATUSES,
    default: "open",
  },
  assignedTo: { type: assignedToSchema, default: null },
  internalNotes: { type: [internalNoteSchema], default: [] },
  resolutionHistory: { type: [resolutionHistorySchema], default: [] },
});
