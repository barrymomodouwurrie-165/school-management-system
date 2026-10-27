import mongoose from "mongoose";
import bcrypt from "bcrypt";

const staffSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    ethnicity: {
      type: String,
      required: true,
    },
    marital_status: {
      type: String,
      required: true,
    },
    staff_id: {
      type: String,
      required: true,
      unique: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    subject_taught: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    employment_type: {
      type: String,
      required: true,
    },
    start_date: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshTokenHash: {
      type: String,
      select: false,
    },
    staff_position: {
      type: String,
      enum: ["Teacher", "H.O.D", "H.O.B", "Admin"],
      required: true,
    },
    role: {
      type: String,
      enum: ["teacher"],
      default: "teacher",
    },
  },
  { timestamps: true },
);

staffSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

const StaffUser = mongoose.model("StaffUser", staffSchema);

export default StaffUser;
