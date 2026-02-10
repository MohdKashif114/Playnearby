import express from "express"
import { authMiddleware } from "../middleware/authMiddleware";
import {sendfriendrequest,acceptfriendrequest,rejectfriendrequest,fetchfriends, incomingrequestcontroller} from "../controllers/Friendrequestcontroller"

const router=express.Router();


router.post("/send-request/:id", authMiddleware,sendfriendrequest);

router.post("/accept/:id",authMiddleware,acceptfriendrequest);

router.post("/reject/:id",authMiddleware,rejectfriendrequest);

router.get("/my-friends",authMiddleware,fetchfriends)

router.get("/incoming-request",authMiddleware,incomingrequestcontroller)


export default router;

