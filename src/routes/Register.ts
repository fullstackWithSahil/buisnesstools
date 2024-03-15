import { Request,Response } from "express";
import bcrypt from "bcryptjs";
import Users from "../modles/Users";

export async function Register(req:Request,res:Response){
    const {username,middlename,lastname,password,email} = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword =await bcrypt.hash(password, salt);
    const newUser = new Users({
        username,
        middlename,
        lastname,
        password:hashedPassword,
        email
    })
    await newUser.save();
    res.json({message:"user saved successfully"})
}
