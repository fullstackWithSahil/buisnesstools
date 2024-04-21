import { Request,Response } from "express";
import User from "../modles/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { kv } from "@vercel/kv";

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                title: "Invalid email address",
                description: "This email address is not registered",
            });
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.json({
                title: "Invalid password",
                description: "This is not the correct password for this email address",
            });
        }

        const token = jwt.sign({ newUser:user }, process.env.JWT_SECRET!, { expiresIn: '30d' });

        res.cookie("auth-token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: false // Set this to false if not using HTTPS locally
        });

        return res.status(201).json(user);
    } catch (error) {
        console.error("Error in login function", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function logout(req:Request,res:Response){
    res.cookie("auth-token","",{
        maxAge:10,
        secure:true,
        httpOnly:true
    }).send("user logged out successfully");
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