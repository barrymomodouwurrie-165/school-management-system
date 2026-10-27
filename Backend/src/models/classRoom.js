import mongoose from "mongoose";

const classRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    grade: {
      type: Number,
      required: true,
      enum: [7, 8, 9, 10, 11, 12],
    },
    section: {
      type: String,
      required: true,
      enum: ["Junior", "Senior"],
    },
    program: {
      type: String,
      required: true,
      enum: [
        ..."ABCDEFGHIJKLM",
        "Science",
        "Arts",
        "Commerce",
        "Agric",
        "Home Economics",
        "Technical",
      ],
    },
    stream_number: {
      type: Number,
      enum: [1, 2],
    },
    class_teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffUser",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

const ClassRoom = mongoose.model("ClassRoom", classRoomSchema);

export default ClassRoom;
