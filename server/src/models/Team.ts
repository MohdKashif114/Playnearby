import mongoose from "mongoose"
import User from "./User"


const teamSchema = new mongoose.Schema({
  name: String,
  sport: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  maxPlayers: {
    type:Number,
    required:true,
  },
  status: {
    type: String,
    enum: ["OPEN", "FULL"],
    default: "OPEN",
  },
  location: {
    type:String,
  },
});





export default mongoose.model("Team",teamSchema);
