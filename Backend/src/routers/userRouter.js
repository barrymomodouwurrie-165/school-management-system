import express from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  isAuthentic,
} from "../models/tokens.js";
import bcrypt from "bcrypt";
import AdminUser from "../models/adminUser.js";
import StaffUser from "../models/staffUser.js";
import StudentUser from "../models/studentUser.js";
import staffRegister from "../controllers/staffRegister.js";
import studentRegister from "../controllers/studentRegister.js";

const userRouter = express.Router();

userRouter.post("/staff/register", staffRegister);

userRouter.post("/students/register", studentRegister);

userRouter.post("/login", async (req, res) => {
  const { role, password } = req.body;
  const identifier = req.body.username ?? req.body.email;
  const normalizedRole =
    typeof role === "string" ? role.trim().toLowerCase() : "";
  const normalizedIdentifier =
    typeof identifier === "string" ? identifier.trim().toLowerCase() : "";

  if (
    !normalizedRole ||
    !normalizedIdentifier ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      message: "Role, username or email, and password are required.",
    });
  }

  const userModel =
    normalizedRole === "admin"
      ? AdminUser
      : normalizedRole === "teacher"
        ? StaffUser
        : normalizedRole === "student"
          ? StudentUser
          : null;

  if (!userModel) {
    return res
      .status(400)
      .json({ message: "Role must be admin, teacher, or student." });
  }

  try {
    const userQuery =
      normalizedRole === "teacher"
        ? {
            $or: [
              { username: normalizedIdentifier },
              { email: normalizedIdentifier },
            ],
          }
        : { username: normalizedIdentifier };
    const user = await userModel.findOne(userQuery).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Invalid username/email or password." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return res.status(200).json({
      message: "Login successful.",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    return res.status(500).json({ message: "Unable to log in right now." });
  }
});

userRouter.post("/logout", async (req, res) => {
  let claims;
  try {
    claims = isAuthentic(req);
  } catch {
    return res
      .status(401)
      .json({ message: "A valid access token is required." });
  }

  const userModel =
    claims.role === "admin"
      ? AdminUser
      : claims.role === "teacher"
        ? StaffUser
        : claims.role === "student"
          ? StudentUser
          : null;

  if (!userModel) {
    return res.status(401).json({ message: "Invalid user role." });
  }

  try {
    const user = await userModel.findById(claims.id);
    if (user) {
      user.refreshTokenHash = null;
      await user.save();
    }

    return res.status(200).json({
      message: "Logout successful. The refresh token has been revoked.",
    });
  } catch (error) {
    console.error("Logout failed:", error.message);
    return res.status(500).json({ message: "Unable to log out right now." });
  }
});



export default userRouter;
