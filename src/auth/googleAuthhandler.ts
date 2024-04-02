import axios from "axios";
import { Request,Response } from "express";
import qs from "qs";
import jwt from "jsonwebtoken";
import User from "../modles/Users";

type googleUserType = {
    iss: string,
    azp: string,
    aud: string,
    sub: string,
    email:string,
    email_verified: true,
    at_hash: string,
    name: string,
    picture: string,
    given_name: string,
    family_name: string,
    iat: number,
    exp: number
}
 
export async function googleAuthhandler(req:Request, res:Response){
    try {
        //get code from qs
        const code = req.query.code as string;

        //get id and access token from code
        const {id_token} = await getGoogleToken(code);

        //get user from the token
        const user:googleUserType = jwt.decode(id_token);
        console.log(user)

        //upsert the user
        let existingUser = await User.findOne({email:user.email});
        if (existingUser){
            await User.updateOne({email:existingUser.email},{
                email:user.email,
                firstName:user.given_name,
                lastname:user.family_name,
                password:user.at_hash,
                picture:user.picture,
                verifyToken:id_token,
                verifTokenExpiry: user.exp
            });
        }else{  
            const newUser = new User({
                email:user.email,
                firstName:user.given_name,
                lastname:user.family_name,
                password:user.at_hash,
                picture:user.picture,
                verifyToken:id_token,
                verifTokenExpiry: user.exp
            });
            await newUser.save()
        }

        //set cookies
        res.cookie("auth-token", id_token, { httpOnly: true })
        
        //redirect back to client
        res.redirect(process.env.NEXT_PUBLIC_HOST)
        res.status(201).send("user registered");
    } catch (error) {
        console.log(error);
        res.json({ error})
    }
}

interface googleTokentype {
    access_token: string,
    expires_in: number,
    scope: string,
    token_type:string,
    id_token: string
}

async function getGoogleToken(code:string):Promise<googleTokentype>{
    const url ="https://oauth2.googleapis.com/token";
    const values ={
        code,
        client_id:process.env.GOOGLE_CLIENT_ID!,
        client_secret:process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri:process.env.GOOGLE_REDIRECT_URL!,
        grant_type:"authorization_code"
    }
    try {
        const res = await axios.post(url,qs.stringify(values),{
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return res.data
    } catch (error) {
        console.log(error)
    }
}