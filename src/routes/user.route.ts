import express from 'express';
const router = express.Router();
import {Settings, findUser} from "../controllers/users"
import { protectRoute } from '../middleware/protect';
import { upload } from '../utils/S3';

router.get('/find/:email',findUser);

router.post('/settings',upload.single('image'),protectRoute,Settings);

export default router;