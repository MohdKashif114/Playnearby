import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import loginController from "../controllers/logincontroller";
import signupController from "../controllers/signupcontroller";
import logoutController from "../controllers/logoutcontroller";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  //after login when google redirects back to aur app we authenticate the metadata received from google is valid and not a
  //fake request from anyone else
  passport.authenticate("google", { session: false }),
  (req, res) => {

    const user = req.user as any;
    
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    

    
    res.cookie("token",token,{
      httpOnly:true,
      secure: false,  
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    // res.send("loggedin mf");
    res.redirect("http://localhost:5173/mainpage");
  }
);


router.post("/login",loginController);

router.post("/signup",signupController);

router.post("/logout",logoutController);






export default router;
