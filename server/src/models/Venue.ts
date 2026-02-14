import mongoose from "mongoose"
import User from "./User"


const venueSchema = new mongoose.Schema({
  name: String,
  sport: String,
  type: {
    type: String,
    enum: ["Open ground", "Street","Indoor","Court","Park"],
    default: "Open ground",
  },
  area:{
      type:String,
      default:"Unknown"
    },
    city:{
      type:String,
      dafault:"Unknown"
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

venueSchema.index({ location: "2dsphere" });




export default mongoose.model("Venue",venueSchema);
