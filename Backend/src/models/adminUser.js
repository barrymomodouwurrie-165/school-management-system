import bcrypt from "bcrypt";
import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
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
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    profilePicture: {
      type: String,
      default: "",
      maxlength: 1500000,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    refreshTokenHash: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

adminUserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

export default AdminUser;
