import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";

const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user:any = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("token",token,{
      httpOnly:true,
      secure: false,  
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({ message: "Logged in successfully",
        user:{
            id:user._id,
            email:user.email,
            name:user.name,
            sport:user.sport,
            location:user.location
        }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default loginController;
