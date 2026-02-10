import {Response,Request} from "express"
import FriendShip from "../models/FriendShip"

 export const sendfriendrequest= async(req:Request, res:Response) => {
  console.log("is sendrequest controller")
  try {
    const sender = (req as any).user.id;
    const receiver = req.params.id;

    if (sender === receiver) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    // Check if already exists in either direction
    const existing = await FriendShip.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    });

    if (existing) {
      return res.status(400).json({ message: "Request already exists or already friends" });
    }

    await FriendShip.create({
      sender,
      receiver
    });

    res.status(200).json({ message: "Friend request sent" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



export const acceptfriendrequest=async (req:Request, res:Response) => {
  try {
    const requestId = req.params.id;
    const userId = (req as any).user.id;

    const request = await FriendShip.findById(requestId);

    if (!request || request.receiver.toString() !== userId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    request.status = "accepted";
    await request.save();

    res.json({ message: "Friend request accepted" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectfriendrequest=async (req:Request, res:Response) => {
  try {
    const requestId = req.params.id;
    await FriendShip.findByIdAndDelete(requestId);

    res.json({ message: "Friend request rejected" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const fetchfriends=async (req:Request, res:Response) => {
  try {
    const userId = (req as any).user.id;

    const friendships = await FriendShip.find({
      status: "accepted",
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    }).populate("sender receiver", "name email");

    const friends = friendships.map(f => {
      return f.sender._id.toString() === userId
        ? f.receiver
        : f.sender;
    });

    console.log("friends are :",friends);

    res.json(friends);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}


export const incomingrequestcontroller= async (req:Request, res:Response) => {
  console.log("in incoming request")
  try {
    const userId = (req as any).user.id;

    const requests = await FriendShip.find({
      receiver: userId,
      status: "pending"
    }).populate("sender", "name email").select("_id sender ").lean();

    console.log("REQS are",userId,requests);
    res.json(requests);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

