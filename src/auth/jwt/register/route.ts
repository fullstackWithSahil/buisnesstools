import User from "../../../modles/Users";
import bcrypt from "bcryptjs";
import { kv } from "@vercel/kv";
import { Request,Response } from "express";
import jwt from "jsonwebtoken";

export default async function register(req:Request, res:Response) {
    try {
        const { firstName, lastname, email, password, otp } = req.body;

        // Validate the OTP and clear the database
        const realOtp = await kv.get(email);
    
        if (realOtp !== +otp) {
            res.send("Invalid OTP");
            return;
        }
        await kv.del(email);

        // Encrypting the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const tokenData ={
            firstName,
            lastname,
            email
        }

        const token = jwt.sign(tokenData,process.env.SECRET_KEY!,{expiresIn:60*60*24*30});
        // getting the expiration date
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        
        // Creating user in the database
        const newUser = new User({
            firstName,
            lastname,
            password: hashedPassword,
            email,
            verifToken: token,
            verifTokenExpiry:222,
        });
        
        await newUser.save();

        res.cookie("auth-token", token, { httpOnly: true });

        res.status(201).json(newUser);
        
    } catch (error) {
        console.error("Error processing POST request:", error);
        res.json({ error});
    }
}
