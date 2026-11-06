import bcrypt from "bcrypt";
import mongoose from "mongoose";

const guardianUserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 10,
      select: false,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentUser",
        required: true,
      },
    ],
    mustChangePassword: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["guardian"],
      default: "guardian",
    },
    refreshTokenHash: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

guardianUserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

const GuardianUser = mongoose.model("GuardianUser", guardianUserSchema);

export default GuardianUser;
