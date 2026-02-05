import { Request, Response } from "express";
import User from "../models/User";





 const fetchusersController=async(req :Request,res:Response)=>{
    const Users=await User.find({},{
        password:0,
        __v:0
    })
    console.log(Users);
    res.status(200).json({
        message:"fetched successfully",
        Users:Users
    })

}


export default fetchusersController;