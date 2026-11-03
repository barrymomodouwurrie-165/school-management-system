import mongoose from "mongoose";

const studentResultRemarkSchema = new mongoose.Schema(
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
    remark: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffUser",
      required: true,
    },
  },
  { timestamps: true },
);

studentResultRemarkSchema.index(
  { student: 1, className: 1, academicYear: 1, evaluationPeriod: 1 },
  { unique: true },
);

const StudentResultRemark = mongoose.model(
  "StudentResultRemark",
  studentResultRemarkSchema,
);

export default StudentResultRemark;
