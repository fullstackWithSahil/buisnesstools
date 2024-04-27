import { Request, Response } from "express";
import sendMail from "../utils/mail";
import User from '../modles/Users';

export async function feedback(req: Request, res: Response){
    try {
        const {feedBack,user} = req.body;
        const {email} = await User.findById(user);
        await sendMail({
            text:`
            ${email} has send a feedback on the website buisnesstool.com

            feedBack: ${feedBack}`,
            subject:"feedback from buisnesstools.com",
        });
        res.send("thank you for your feedback")
    } catch (error) {
        console.log("Error sending feedback");
        res.send("something went wrong");
    }
}
