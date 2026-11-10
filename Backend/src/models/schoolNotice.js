import mongoose from "mongoose";

const schoolNoticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const SchoolNotice = mongoose.model("SchoolNotice", schoolNoticeSchema);

export default SchoolNotice;
