import { Request, Response } from "express";
import Venue from "../models/Venue";

export const fetchAllVenues = async (req: Request, res: Response) => {
  try {
    const venues = await Venue.find({}, { __v: 0 })
      .lean(); // 🔥 important

    const formattedVenues = venues.map((venue) => ({
      ...venue,
      location: venue.location?.coordinates
        ? {
            lat: venue.location.coordinates[1], // lat
            lng: venue.location.coordinates[0], // lng
          }
        : null,
    }));

    res.status(200).json({
      Venues: formattedVenues,
    });

  } catch (err) {
    console.error("Error fetching venues:", err);
    res.status(500).json({
      message: "Failed to fetch venues",
    });
  }
};
