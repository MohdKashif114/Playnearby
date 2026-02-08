import express from "express";
import { setLocation } from "../controllers/setlocationcontroller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/setlocation", authMiddleware, setLocation);

export default router;
