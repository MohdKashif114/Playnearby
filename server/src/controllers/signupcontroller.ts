import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const signupController = async (req: Request, res: Response) => {
    
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    // CASE 1: User exists and already has a password → reject
    if (existingUser && existingUser.password) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    // CASE 2: User exists via Google → attach password
    if (existingUser && !existingUser.password) {
      existingUser.password = hashedPassword;
      existingUser.name = name; // optional update
      user = await existingUser.save();
    } 
    // CASE 3: New user
    else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly:true,
      secure: false,  
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        sport:user.sport,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default signupController;
