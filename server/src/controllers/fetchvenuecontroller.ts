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





export const fetchNearbyVenues = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng required" });
    }

    const radiusInKm = Number(radius) || 5;
    const radiusInMeters = radiusInKm * 1000;

    const venues = await Venue.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)], 
          },
          distanceField: "distance", // field name in result
          maxDistance: radiusInMeters,
          spherical: true,
        },
      },
      {
        $project: {
          name: 1,
          sport: 1,
          area: 1,
          type: 1,
          availability: 1,
          contact: 1,
          location: 1,
          distance: 1,
        },
      },
    ]);

    const formattedVenues = venues.map((venue) => ({
      ...venue,
      location: venue.location?.coordinates
        ? {
            lat: venue.location.coordinates[1],
            lng: venue.location.coordinates[0],
          }
        : null,
      distanceKm: (venue.distance / 1000).toFixed(2), // convert meters → km
    }));
    console.log("venue is:",formattedVenues)
    res.json({ Venues: formattedVenues });

  } catch (err) {
    console.error("GeoNear error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
