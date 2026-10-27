import express from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  isAuthentic,
} from "../models/tokens.js";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("User route is working");
});

export default userRouter;