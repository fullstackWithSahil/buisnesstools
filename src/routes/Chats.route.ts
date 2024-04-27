import express from 'express';
const router = express.Router();
import {protectRoute} from "../middleware/protect"
import { addMembers, createTeam, deleteTeam, getChats, getMessages, removeMember, sendMessage } from '../controllers/chat.controller';

router.post("/createteam",protectRoute,createTeam);

router.put("/addMembers",protectRoute,addMembers);

router.delete("/removeMembers",protectRoute,removeMember)

router.delete("/deleteTeam",protectRoute,deleteTeam)

router.get("/getChats",protectRoute,getChats)

router.get("/getmessages/:id",protectRoute,getMessages)

router.post("/sendMessage/:id",protectRoute,sendMessage)

export default router;