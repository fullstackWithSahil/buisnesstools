import express from 'express';
import { addAudience, deleteSubscribers, getAudience } from '../controllers/emailnewsletter/audience.controller';
import {protectRoute} from "../middleware/protect"
import {addSubscribers, createTemplet, getdata, renderTemplet} from "../controllers/emailnewsletter/templet.controller"

const router = express.Router();

router.get("/",protectRoute,getAudience)

router.post("/add",protectRoute,addAudience)

router.delete("/delete",deleteSubscribers);

router.get("/templete/render/:id",renderTemplet)

router.post("/templete/create",protectRoute,createTemplet)

router.post("/templete/addSubscriber/:id",addSubscribers)

router.get("/templete/getdata",protectRoute,getdata)

export default router;