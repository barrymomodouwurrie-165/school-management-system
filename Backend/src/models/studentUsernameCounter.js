import mongoose from "mongoose";

const studentUsernameCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    sequence: { type: Number, required: true, default: 0 },
  },
  { versionKey: false },
);

const StudentUsernameCounter = mongoose.model(
  "StudentUsernameCounter",
  studentUsernameCounterSchema,
);

export default StudentUsernameCounter;
