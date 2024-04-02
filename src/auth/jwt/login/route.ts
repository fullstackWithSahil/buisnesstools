import User from "../../../modles/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request,Response } from "express";

export async function POST(req:Request, res:Response){
    try {
        const {email,password} =req.body;

        const user = await User.findOne({email});  
        const valid = await bcrypt.compare(password,user.password);
        
        if(!valid){
            res.send("invalid password")
        }

        //create token data
        const tokenData ={
            id:user._id,
            firstName:user.firstName,
            middlename:user.middlename,
            lastname:user.lastname,
            email:user.email
        }
        //create token
        const token = jwt.sign(tokenData,process.env.SECRET_KEY!,{expiresIn:"1d"});

        res.json({
            message:"Login successful",
            success:true
        }).cookie("auth-token",token);
    } catch (error) {
        res.json(error);
    }
}