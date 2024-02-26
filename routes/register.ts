import { Request, Response } from "express";

export async function Register(req:Request,res:Response){
    res.json({text:"register"})
}