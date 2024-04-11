import { createTeam } from '../controllers/chat';
import express from 'express';
const router = express.Router();
import {protectRoute} from "../middleware/protect"


router.post("/createteam",protectRoute,createTeam);

export default router;