import { kv } from "@vercel/kv";
import { Request,Response } from "express";
import sendMail from "../../../../utils/mail"

export default async function resendotp(req:Request, res:Response) {
  try {
    const { email } = await req.body;
    await kv.del(email);

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

    await sendMail({
      text: `otp sent successfully ${otp}`,
      to: email,
      subject: "OTP",
    });

    await kv.set(email, otp);
    res.send("otp sent successfully");
  } catch (error) {
    res.json(error);
  }
}
