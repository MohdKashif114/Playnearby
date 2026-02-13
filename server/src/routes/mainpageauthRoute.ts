import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/authMiddleware";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/User"
import updateprofilecontroller from "../controllers/updateprofilecontroller"
import upload from "../middleware/upload";

const router = express.Router();


router.get("/authenticate", authMiddleware, async (req, res) => {
  const userId = (req.user as JwtPayload).id;

  const user = await User.findById(userId).select("-password -__v").lean();
  console.log(user);
  const updatedUser={
    ...user,
    location: user?.location?.coordinates
        ? {
            lat: user?.location.coordinates[1], 
            lng: user?.location.coordinates[0], 
        }
        : null,
  }
  res.json(updatedUser);
});

router.put("/update-profile",authMiddleware,upload.single("profileImage"),updateprofilecontroller);





export default router;
