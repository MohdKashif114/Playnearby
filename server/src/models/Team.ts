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
  area:{
      type:String,
      default:"Unknown"
    },
  location: {
      type: {
        type: String,
        enum: ["Point"],
        
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        
    }
  },
});

teamSchema.index({ location: "2dsphere" });




export default mongoose.model("Team",teamSchema);
