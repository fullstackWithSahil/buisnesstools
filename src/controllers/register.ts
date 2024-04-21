import { Request, Response } from "express";
import { kv } from "@vercel/kv";
import sendMail from "../utils/mail";
import User from "../modles/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function genOtp() {
  const chars = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let otp = "";
  for (let i = 0; i <= 5; i++) {
    const j = Math.floor(Math.random() * 8);
    otp += chars[j];
  }
  return otp;
}

export async function sendOtp(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const Existing = await User.findOne({ email });
    if (Existing) {
      res.json({
        title:"email already exists",
        description: "an account with this email already exists so try a different one"
      })
      return;
    } else {
      //generating otp sending email and saving it in reddis database
      const otp = genOtp();
      console.log("otp is", otp);
      // await sendMail({
      //     text:`otp sent successfully ${otp}`,
      //     to:email,
      //     subject:"OTP"
      // });
      await kv.set(email, otp);
      res.json({
        title: "OTP sent successfully",
        description: "An OTP for verication has been sent to your mail",
        ok: true
      })
    }
  } catch (error: any) {
    console.error("Error in sending otp:", error);
    res.json({
      title:"Error sending email",
      description:"There was an error sending email try again"
    });
  }
}

export async function resendotp(req: Request, res: Response) {
  try {
    const { email } = await req.body;
    await kv.del(email);

    //generating otp sending email and saving it in reddis database
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
    console.error("Error in resending otp:", error);
    res.send("something went wrong try again");
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { firstName, lastname, email, password, otp } = req.body;
    
    //verify otp
    const realOtp =await kv.get(email);
    
    if (otp!=realOtp){
      res.send("Invalid otp");
      return;
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);

    //saving user in database
    const newUser = new User({
      firstName,
      lastname,
      email,
      password: hashPassword,
    });

    if (newUser) {
			// Generate JWT token here
			const token = jwt.sign({ newUser:newUser }, process.env.JWT_SECRET!, {
        expiresIn: "15d",
      });
      
      await newUser.save();
      res.cookie('auth-token', token, {
        secure: true,
        httpOnly:true,
      })
      
			res.status(201).json(newUser);
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" }); // Provide a generic error message
  }
}