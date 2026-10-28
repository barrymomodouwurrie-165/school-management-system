import mongoose from "mongoose";

const attendanceEntrySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentUser",
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    firstCall: {
      type: Boolean,
      default: false,
    },
    secondCall: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const attendanceSessionSchema = new mongoose.Schema(
  {
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassRoom",
      required: true,
    },
    className: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },
    markingTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffUser",
      required: true,
    },
    entries: {
      type: [attendanceEntrySchema],
      required: true,
      validate: {
        validator: (entries) => entries.length > 0,
        message: "An attendance session must include students.",
      },
    },
    firstCallSavedAt: Date,
    secondCallSavedAt: Date,
  },
  { timestamps: true },
);

attendanceSessionSchema.index(
  { classroom: 1, date: 1 },
  { unique: true },
);

const AttendanceSession = mongoose.model(
  "AttendanceSession",
  attendanceSessionSchema,
);

export default AttendanceSession;
