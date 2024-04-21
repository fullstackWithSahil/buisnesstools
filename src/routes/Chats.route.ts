import express from 'express';
const router = express.Router();
import {protectRoute} from "../middleware/protect"
import { addMembers, createTeam, deleteTeam, getChats, removeMember } from '../controllers/chat.controller';

router.post("/createteam",protectRoute,createTeam);

router.put("/addMembers",protectRoute,addMembers);

router.delete("/removeMembers",protectRoute,removeMember)

router.delete("/deleteTeam",protectRoute,deleteTeam)

router.get("/getChats",protectRoute,getChats)

export default router;