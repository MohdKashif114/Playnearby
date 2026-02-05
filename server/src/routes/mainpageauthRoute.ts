import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/User"

const router = express.Router();


router.get("/authenticate", authMiddleware, async (req, res) => {
  const userId = (req.user as JwtPayload).id;

  const user = await User.findById(userId);
  console.log(user);
  res.json(user);
});





export default router;
