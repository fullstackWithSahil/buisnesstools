import { Request,Response } from "express";
import User from "../modles/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { kv } from "@vercel/kv";

export async function login(req:Request,res:Response){
    try {
        const {email,password} =req.body;

        const user = await User.findOne({email});
        if (!user){
            res.send("invalid email")
        }   

        const valid = await bcrypt.compare(password,user.password);
        
        if(!valid){
            res.send("invalid password");
            return;
        }

        const token = jwt.sign(User,process.env.JWT_SECRET!);

        res.cookie("auth-token", token,{
            httpOnly: true,
            maxAge:30*24*60*60*1000,
            secure: true
        });

        res.status(201).send("user logged in successfully");
    } catch (error) {
        console.log("Error in login function",error);
        res.json({ error: error});
    }
}

export async function logout(req:Request,res:Response){
    res.cookie("auth-token","",{
        maxAge:10,
        secure:true,
        httpOnly:true
    })
}


//send a post requset to /api/register/email to send otp to that user
export async function forgotPassword(req:Request,res:Response){
    const {email,otp} = req.body;
    const realOtp = await kv.get(email);
    if(realOtp!=otp){
        res.status(200).send("invalid otp cannot grant access");
        return;
    }

    const user = await User.findOne({ email});
    
    res.cookie("auth-token", user,{
        httpOnly: true,
        maxAge:30*24*60*60*1000,
        secure: true
    });

    res.status(201).send("user logged in successfully");
}