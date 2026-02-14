import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password:{
      type:String,
      required:false
    },
    googleId:{
      type:String,
      required:false
    },
    avatar: String,
    sport:{
      type:String,
      default:"NA"
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
    role:{
      type:String,
      default:"NA"
    },
    available:{
      type:String,
      default:"NA"
    },
    contact:{
      type:String,
      default:"NA"
    },
    currentTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    default: null,
    },
    bio:{
      type:String,
    },
    profileImage:{
      type:String,
    }
    


  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);
