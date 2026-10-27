import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

export const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
  user.refreshToken = refreshToken;
  await user.save();

  return refreshToken;
};

export const isAuthentic = (req) => {
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return user;
};


