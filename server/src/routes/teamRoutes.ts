import express from "express";
import {fetchusersController,fetchNearbyPlayers} from "../controllers/fetchuserscontroller";
import { authMiddleware } from "../middleware/authMiddleware";
import { acceptTeamInvite, getPendingTeamInvites, sendTeamInvite } from "../controllers/teaminvitecontroller";
import { fetchAllTeams } from "../controllers/fetchteamscontroller";



const router=express.Router();

router.get("/fetch-teams",authMiddleware,fetchAllTeams)
router.post("/team-invite",authMiddleware,sendTeamInvite);
router.get("/pending-teaminvites",authMiddleware,getPendingTeamInvites)
router.get("/team-invite/accept/:id",authMiddleware,acceptTeamInvite)

export default router;