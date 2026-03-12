import express from "express";
import {fetchusersController,fetchNearbyPlayers} from "../controllers/fetchuserscontroller";
import { authMiddleware } from "../middleware/authMiddleware";
import { rateVenue} from "../controllers/ratevenuecontroller";
import { addvenueimagecontroller } from "../controllers/addvenuecontroller";
import upload from "../middleware/upload";




const router=express.Router();


router.post("/venue/rate",authMiddleware,rateVenue)
router.put(
  "/venue/addimage",authMiddleware,
  upload.single("venueImage"),
  addvenueimagecontroller
);


export default router;