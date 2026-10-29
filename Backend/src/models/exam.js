import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    section: {
      type: String,
      enum: ["Junior", "Senior", "Both"],
      required: true,
    },
  },
  { timestamps: true },
);

examSchema.index({ startDate: 1, title: 1 });

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
