import express from "express";
import cors from "cors";
import { Register } from "./routes/register";

const app = express();
app.use(express.json())
app.use(cors());


app.post("/api/users",(req,res)=>Register(req,res))
app.listen(process.env.PORT,()=>console.log("hi"));