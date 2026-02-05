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
    location:{
      type:String,
      default:"NA"
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

  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
