import { Request, Response } from "express";
import User from "../models/User";





 export const fetchusersController=async(req :Request,res:Response)=>{

    const city=req.params.city
    const users = await User.find({city:city}, {
    password: 0,
    __v: 0,
    }).lean(); 

    const formattedUsers = users.map(user => ({
    ...user,
    location: user.location?.coordinates
        ? {
            lat: user.location.coordinates[1], 
            lng: user.location.coordinates[0], 
        }
        : null,
    }));

    // res.json({ Users: formattedUsers });

        console.log(formattedUsers);
        res.status(200).json({
            message:"fetched successfully",
            Users:formattedUsers
        })

}


export const fetchNearbyPlayers = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng required" });
    }

    const radiusInKm = Number(radius) || 5;
    const radiusInMeters = radiusInKm * 1000;

    const players = await User.aggregate([
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
        available: 1, 
        contact: 1,
        location: 1,
        distance: 1,
        },

      },
    ]);

    const formattedPlayers = players.map((player) => ({
      ...player,
      location: player.location?.coordinates
        ? {
            lat: player.location.coordinates[1],
            lng: player.location.coordinates[0],
          }
        : null,
      distanceKm: (player.distance / 1000).toFixed(2), // convert meters → km
    }));
    console.log("player is:",formattedPlayers)
    res.json({ Players: formattedPlayers });

  } catch (err) {
    console.error("GeoNear error:", err);
    res.status(500).json({ message: "Server error" });
  }
};