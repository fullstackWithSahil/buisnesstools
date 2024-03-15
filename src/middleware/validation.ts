import { Request,Response,NextFunction } from "express";

export async function validate(req: Request, res: Response,next: NextFunction){
    const {username,middlename,lastname,password,email} = req.body;
    if (!username){
        res.json({ error:"username is required"})
        return
    }
    if (!lastname){
        res.json({ error:"lastname is required"})
        return
    }
    if (!middlename){
        res.json({ error:"middlename is required"})
        return
    }
    if (!password){
        res.json({ error:"password is required"});
        return
    }
    if (!email){
        res.json({ error:"email is required"})
        return
    }
    next()
}