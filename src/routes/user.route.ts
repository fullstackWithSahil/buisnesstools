import express from 'express';
const router = express.Router();
import {findUser} from "../controllers/users"

router.get('/find/:email',findUser);

export default router;