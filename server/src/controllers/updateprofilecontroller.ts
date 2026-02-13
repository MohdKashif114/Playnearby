import {Response,Request} from "express"
import User from "../models/User"
import cloudinary from "../config/cloudinary";



const updateprofilecontroller=async (req:Request, res:Response) => {
  try {
      const userId = (req as any).user.id;

      let imageUrl;

      if (req.file) {
        const result = await cloudinary.uploader.upload_stream(
          { folder: "profile_images" },
          async (error, result) => {
            if (error) throw error;
            imageUrl = result?.secure_url;

            const updatedUser = await User.findByIdAndUpdate(
              userId,
              {
                ...req.body,
                profileImage: imageUrl,
              },
              { new: true }
            ).select("-password");

            res.json({ updatedUser });
          }
        );

        result.end(req.file.buffer);
      } else {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { ...req.body },
          { new: true }
        ).select("-password");

        res.json({ updatedUser });
      }
    } catch (err) {
        console.log("error while updating is :",err);
      res.status(500).json({ message: "Update failed" });
    }

}

export default updateprofilecontroller