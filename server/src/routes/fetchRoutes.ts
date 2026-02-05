import express from "express";
import fetchusersController from "../controllers/fetchuserscontroller";
import { authMiddleware } from "../middleware/authMiddleware";




const router=express.Router();


router.get("/fetchallusers",fetchusersController);


export default router;