import { Request, Response } from "express";
import User from "../models/User";

export const setLocation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; 
    const { location,area } = req.body;
    console.log("the area is ",area);
    console.log("location is ",location.lat,"and",location.lng)
    
    if (
      !location ||
      typeof location.lat !== "number" ||
      typeof location.lng !== "number"
    ) {
      return res.status(400).json({
        message: "Invalid location data",
      });
    }

    const { lat, lng } = location;

    
    const updatedUser=await User.findByIdAndUpdate(
      userId,
      {
        area,
        location: {
          type: "Point",
          coordinates: [lng, lat], 
        },
      },
      { new: true }
    );

    console.log("updated user area is ",updatedUser?.area)

    return res.status(200).json({
      message: "Location set successfully",
    });
  } catch (err) {
    console.error("Set location error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
