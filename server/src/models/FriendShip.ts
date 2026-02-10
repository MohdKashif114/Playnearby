import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending"
  }

}, { timestamps: true });


friendshipSchema.index(
  { sender: 1, receiver: 1 },
  { unique: true }
);

export default mongoose.model("FriendShip", friendshipSchema);
