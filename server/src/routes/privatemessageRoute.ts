import express from "express";
import Message from "../models/Message";
import { authMiddleware } from "../middleware/authMiddleware";
import getMessagesWithFriend from "../controllers/getmessageswithfriendcontroller";

const router = express.Router();

router.get("/private-message/:friendId",authMiddleware,getMessagesWithFriend);

export default router;
