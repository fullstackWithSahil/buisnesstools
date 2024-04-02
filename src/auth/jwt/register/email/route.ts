import { kv } from "@vercel/kv";
import { Request,Response } from "express";
import sendMail from "../../../../utils/mail"
import User from "../../../../modles/Users";

export default async function registeremail(req: Request, res: Response){
    try {
        const {email} =req.body;
        const Existing = await User.findOne({ email});
        if(Existing){
            res.send("email already exists")
        }else{
            //generating otp sending email and saving it in reddis database
            function genOtp(){
                const chars = ["1", "2", "3", "4", "5", "6","7", "8", "9"];
                let otp = ''
                for (let i = 0; i <=5; i++){
                  const j=Math.floor(Math.random()*8);
                  otp += chars[j];
                }
                return otp
            }
            const otp = genOtp();
            console.log("otp is", otp);
            // await sendMail({
            //     text:`otp sent successfully ${otp}`,
            //     to:email,
            //     subject:"OTP"
            // });
            await kv.set(email,otp);
            res.send("otp sent successfully")
        }
    } catch (error:any) {
        res.send(error.message);
    }
}