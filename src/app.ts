import express from 'express';
const app = express();
import cors from "cors";
import mongoose from 'mongoose';
import _ from "dotenv";
_.config();

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URL!)

 
//auth imports
    //jwt imports
import register from "./auth/jwt/register/route"
import resendotp from "./auth/jwt/register/resendotp/route"
import registeremail from "./auth/jwt/register/email/route"
    //google auth imports
import {googleAuthhandler} from "./auth/googleAuthhandler"



app.get("/api/sessions/oauth/google",googleAuthhandler)

app.post("/api/register",register)

app.post("/api/register/resendotp",resendotp)

app.post("/api/register/email",registeremail)

app.listen(process.env.PORT,()=>console.log(`listening on port ${process.env.PORT}` ))