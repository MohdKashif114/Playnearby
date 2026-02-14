import express from "express";
import {fetchusersController,fetchNearbyPlayers} from "../controllers/fetchuserscontroller";
import { authMiddleware } from "../middleware/authMiddleware";




const router=express.Router();


router.get("/fetchallusers/:city",fetchusersController);
router.get("/players/nearby",fetchNearbyPlayers)


export default router;