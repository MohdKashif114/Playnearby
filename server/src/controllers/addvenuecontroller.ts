import cloudinary from "../config/cloudinary";
import Venue from "../models/Venue";
import {Request,Response} from "express"

export async function addvenuecontroller(req:Request,res:Response){
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







export async function addvenueimagecontroller(req:Request, res:Response){
  try {
      const userId = (req as any).user.id;

      let imageUrl;
        console.log(req.body);
      if (req.file) {
        const result = await cloudinary.uploader.upload_stream(
          { folder: "venue_images" },
          async (error, result) => {
            if (error) throw error;
            imageUrl = result?.secure_url;

            const updatedVenue = await Venue.findByIdAndUpdate(
                                    req.body.venueId,
                                    {
                                        $push: { images: imageUrl },
                                    },
                                    { new: true }
                                    ).select("images");
                                    console.log("images",updatedVenue);
            res.json( updatedVenue );
          }
        );

        result.end(req.file.buffer);
      } 
    } catch (err) {
        console.log("error while updating is :",err);
      res.status(500).json({ message: "Update failed" });
    }

}

