import express from "express";
import Message from "../models/Message";

const router = express.Router();

router.get("/:teamId", async (req, res) => {
  const { teamId } = req.params;
  console.log("teamid:",teamId);

  const messages = await Message.find({ teamId })
    .sort({ createdAt: 1 })
    .lean();

  res.json(messages);
});

export default router;
