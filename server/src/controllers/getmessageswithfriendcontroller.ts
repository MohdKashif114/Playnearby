import PrivateMessage from "../models/PrivateMessage"
import {Response,Request} from "express"

const getMessagesWithFriend = async (req:Request, res:Response) => {
  try {
    const userId = (req as any).user.id;
    const { friendId } = req.params;

    const messages = await PrivateMessage.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    }).sort({ createdAt: 1 }).select("sender receiver text");

    console.log("message are",messages);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
};

export default getMessagesWithFriend;
