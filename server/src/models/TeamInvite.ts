import mongoose from "mongoose";

const teamInviteSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },

  invitedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

// Prevent duplicate invites for same team & user
teamInviteSchema.index(
  { team: 1, invitedUser: 1 },
  { unique: true }
);

export default mongoose.model("TeamInvite", teamInviteSchema);
