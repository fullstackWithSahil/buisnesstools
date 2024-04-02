import User from "../../../../modles/Users";
import { Request,Response } from "express";

export async function POST(req:Request, res:Response){
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if (!user){
            res.send("invalid email")
        }else{
            res.send("email is valid")
        }        
    } catch (error) {
        res.json(error);
    }
}