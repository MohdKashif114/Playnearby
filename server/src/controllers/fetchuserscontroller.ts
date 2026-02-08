import { Request, Response } from "express";
import User from "../models/User";





 const fetchusersController=async(req :Request,res:Response)=>{
    const users = await User.find({}, {
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


export default fetchusersController;