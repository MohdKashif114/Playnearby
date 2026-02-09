import Venue from "../models/Venue";
import {Request,Response} from "express"

export default async function addvenuecontroller(req:Request,res:Response){
    const {name,sport,type,location,area}=req.body;
    console.log("saving venue:",name);
    if (
      !location ||
      typeof location.lat !== "number" ||
      typeof location.lng !== "number"
    ) {
      return res.status(400).json({
        message: "Invalid location data",
      });
    }

    const {lng,lat}=location;
    try{
        const venue=await Venue.create({
            name:name,
            sport:sport,
            type:type,
            location: {
                type: "Point",
                coordinates: [lng, lat], 
            },
            area:area
        })

        return res.status(200).json({
            message: "Venue saved successfully",
        });

    }catch(err){
        console.log("Error saving venue",err);
    }
}