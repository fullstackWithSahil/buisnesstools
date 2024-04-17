import express from "express";
import {register, resendotp,sendOtp} from "../controllers/register";
import {forgotPassword, login,logout} from "../controllers/login"

const router = express.Router();

router.post('/register/email',sendOtp)

router.post('/register/resendotp',resendotp)

router.post('/register',register)

router.post("/login",login)

router.post("/logout",logout)

router.post("/forgotpassword",forgotPassword)

export default router;