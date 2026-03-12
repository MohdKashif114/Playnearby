import { Request, Response } from "express";
import Venue from "../models/Venue";
import Team from "../models/Team";

export const fetchAllTeams = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find({}, { __v: 0 })
      .lean().populate("members","name _id profileImage"); 
    console.log("members are:",teams[0].members);
    const formattedTeams = teams.map((team) => ({
      ...team,
      location: team.location?.coordinates
        ? {
            lat: team.location.coordinates[1], 
            lng: team.location.coordinates[0], 
          }
        : null,
    }));
    console.log("teams are:",formattedTeams);
    res.status(200).json({
      Teams: formattedTeams,
    });

  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({
      message: "Failed to fetch teams",
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

    const formattedVenues = venues.map((team) => ({
      ...team,
      location: team.location?.coordinates
        ? {
            lat: team.location.coordinates[1],
            lng: team.location.coordinates[0],
          }
        : null,
      distanceKm: (team.distance / 1000).toFixed(2), // convert meters → km
    }));
    console.log("team is:",formattedVenues)
    res.json({ Venues: formattedVenues });

  } catch (err) {
    console.error("GeoNear error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
