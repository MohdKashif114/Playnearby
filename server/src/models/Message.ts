import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    name: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true } 
);

messageSchema.index({ teamId: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
