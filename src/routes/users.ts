import { Request,Response } from "express";
import User from "../modles/Users";

export async function findUser(req:Request,res:Response){
    const {email} = req.body;
    const data = await User.find({ email:{$regex: new RegExp(email,'i')}})
    res.json(data);
}