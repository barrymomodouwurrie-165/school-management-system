import mongoose from "mongoose";

const staffIdCounterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { versionKey: false },
);

const StaffIdCounter = mongoose.model("StaffIdCounter", staffIdCounterSchema);

export default StaffIdCounter;
