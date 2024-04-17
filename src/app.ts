import express from 'express';
const app = express();
import cors from "cors";
import mongoose from 'mongoose';
import _ from "dotenv";
import cookieParser from "cookie-parser";
_.config();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(cookieParser())
app.use(express.json());
mongoose.connect(process.env.MONGODB_URL!)
 
//auth imports
import authRouter from "./routes/Auth"
import {googleAuthhandler} from "./auth/googleAuthhandler"

import userRouter from "./routes/user.route";
import chatRouter from "./routes/Chats.route";

app.use("/api/auth",authRouter);

app.get("/api/sessions/oauth/google",googleAuthhandler)

app.use("/api/users",userRouter)

app.use("/api/teams",chatRouter)

app.get("/cookie",(req,res)=>{
    res.cookie("sahil","cookie",{
        maxAge:200000000000,
        httpOnly:true
    })
    res.send("ok")
})

app.listen(process.env.PORT,()=>console.log(`listening on port ${process.env.PORT}` ))