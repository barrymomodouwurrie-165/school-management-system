import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });

const getSecret = (key) => {
  const secret = process.env[key];
  if (!secret) {
    throw new Error(`${key} is not defined in the environment variables.`);
  }
  return secret;
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    getSecret("ACCESS_TOKEN_SECRET"),
    { expiresIn: "15m" },
  );
};

export const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    getSecret("REFRESH_TOKEN_SECRET"),
    { expiresIn: "7d" },
  );
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  return refreshToken;
};

export const isAuthentic = (req) => {
  const authorization = req.headers.authorization;
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    throw new Error("A Bearer access token is required.");
  }
  return jwt.verify(match[1], getSecret("ACCESS_TOKEN_SECRET"));
};
