import express from 'express';
const app = express();
import cors from "cors";
import mongoose from 'mongoose';
import _ from "dotenv";
import cookieParser from "cookie-parser";
_.config();

app.use(cors());
app.use(cookieParser())
app.use(express.json());
mongoose.connect(process.env.MONGODB_URL!)
 
//auth imports
import authRouter from "./routes/Auth"
import {googleAuthhandler} from "./auth/googleAuthhandler"

import userRouter from "./routes/user.route";

app.use("/api",authRouter);
app.get("/api/sessions/oauth/google",googleAuthhandler)

app.use("/api/users",userRouter)

app.listen(process.env.PORT,()=>console.log(`listening on port ${process.env.PORT}` ))