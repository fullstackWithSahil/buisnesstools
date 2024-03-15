import express from "express";
export async function Login(req: express.Request, res: express.Response){
    const {username,middlename,lastname,password,email} = req.body;
    res.send(username);
}