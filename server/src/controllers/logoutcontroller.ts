import { Request, Response } from "express";

const logoutController = (req: Request, res: Response) => {
  res.clearCookie("token", {
      httpOnly:true,
      secure: false,  
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

  return res.status(200).json({ message: "Logged out successfully" });
};

export default logoutController;
