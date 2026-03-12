import { io } from "../app";
import {Request,Response} from "express";
import TeamInvite from "../models/TeamInvite";

export const sendTeamInvite = async (req: Request, res: Response) => {
    console.log("in team invite controller");
  try {
    const invitedUser = req.body.userId;
    const teamId = req.body.teamId;
    const invitedBy = (req as any).user.id;

    const invite = await TeamInvite.create({
      team: teamId,
      invitedUser,
      invitedBy
    });

    const populatedInvite = await invite.populate([
      { path: "team", select: "name" },
      { path: "invitedBy", select: "name" }
    ]);

    console.log("The invite:",populatedInvite);
    io.to(invitedUser).emit("team-invite", populatedInvite);

    res.json({ message: "Invite sent" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



export const getPendingTeamInvites = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const invites = await TeamInvite.find({
      invitedUser: userId,
      status: "pending"
    })
      .select("_id team invitedBy createdAt") // only needed fields
      .populate({
        path: "team",
        select: "_id name"
      })
      .populate({
        path: "invitedBy",
        select: "_id name"
      })
      .lean();
      console.log("invites are:",invites);
    res.json(invites);

  } catch (error) {
    console.error("Fetch Pending Invites Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};





export const acceptTeamInvite = async (
  req: Request,
  res: Response
) => {
  try {
    const inviteId = req.params.id;
    const userId = (req as any).user.id;

    const invite = await TeamInvite.findById(inviteId);

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    
    if (invite.invitedUser.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (invite.status !== "pending") {
      return res.status(400).json({ message: "Invite already processed" });
    }

    

    invite.status = "accepted";
    await TeamInvite.findByIdAndDelete(inviteId);

    res.json({ message: "Joined team successfully" });

  } catch (error) {
    console.error("Accept Invite Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
