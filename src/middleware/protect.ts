import {Request,Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../modles/Users";

export async function protectRoute(req:Request,res:Response,next:NextFunction){
    const token = req.cookies.token;
    const user:any = jwt.verify(token,process.env.JWT_SECRET!);
    const userData = await User.findById(user._id)

    if(!userData||!token){
        res.send(401).status(403).send("you must be logged in to access this page")
        return;
    }
    req.body.user = userData;
    next();
}