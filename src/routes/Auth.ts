import express, { Request, Response } from "express";
import {register, resendotp,sendOtp} from "../controllers/register";
import {forgotPassword, login,logout} from "../controllers/login"
import { protectRoute } from "../middleware/protect";

async function getData(req: Request,res: Response){
    try {
        const userData = req.body.user;
        res.json(userData);        
    } catch (error) {
        console.log("Error getting data");
        res.send("something went wrong");
    }
}

const router = express.Router();

router.post('/register/email',sendOtp)

router.post('/register/resendotp',resendotp)

router.post('/register',register)

router.post("/login",login)

router.post("/logout",logout)

router.post("/forgotpassword",forgotPassword)

router.get('/getData',protectRoute,getData);

export default router;