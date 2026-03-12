import {Request,Response } from "express";
import Rating from "../models/Rating";
import Venue from "../models/Venue";
import mongoose from "mongoose";


export const rateVenue = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const { venueId, rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    
    await Rating.findOneAndUpdate(
      { venue: venueId, user: userId },
      { rating },
      { upsert: true, new: true }
    );

    
    const stats = await Rating.aggregate([
      { $match: { venue: new mongoose.Types.ObjectId(venueId) } },
      {
        $group: {
          _id: "$venue",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      }
    ]);

    const avg = stats[0]?.avgRating || 0;
    const count = stats[0]?.count || 0;
    const updatedVenue=await Venue.findByIdAndUpdate(venueId, {
        averageRating: avg,
        ratingCount: count
    });
    console.log("venue after rating is :",updatedVenue)

    res.json({ message: "Rating submitted", averageRating: avg,ratingCount:count });

  } catch (error) {
    console.error("Rating Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
