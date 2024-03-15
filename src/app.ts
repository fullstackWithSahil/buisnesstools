import express from 'express';
const app = express();
import mongoose from 'mongoose';
import _ from "dotenv";
import {validate} from "./middleware/validation";
import {Register} from "./routes/Register";
import {Login} from "./routes/Login";
_.config();

app.use(express.json());
mongoose.connect(process.env.MONGODB_URL!)

app.post('/api/register',validate,Register)
app.post('/api/login',validate,Login)


app.listen(process.env.PORT,()=>console.log("listening on port 3000"))