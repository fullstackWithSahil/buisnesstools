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
      res.send("email already exists");
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
      res.send("otp sent successfully");
    }
  } catch (error: any) {
    console.error("Error in sending otp:", error);
    res.json({ error });
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
    res.json({ error });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { firstName, lastname, email, password, otp } = req.body;

    // Validate the OTP and clear the database
    const realOtp = await kv.get(email);
    if (realOtp !== +otp) {
      return res.status(400).send("Invalid OTP");
    }
    await kv.del(email);

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Saving user in database
    const newUser = new User({
      firstName,
      lastname, // Fixed typo here
      password: hashedPassword,
      email,
    });

    await newUser.save();
    const token = jwt.sign(
      {
        id: newUser._id, // Fixed capitalization of _id
        plan: newUser.plan, // Assuming newUser.plan exists
      },
      process.env.JWT_SECRET || "default_secret"
    ); // Provide a default value for JWT_SECRET

    res.cookie("auth-token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: true
    });

    const dataToSend = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastname: newUser.lastname, // Fixed capitalization of lastname
      email: newUser.email,
      picture: newUser.picture, // Assuming newUser.picture exists
    };

    // res.cookie("user-data", dataToSend, {
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    //   secure: false, // Set secure to false for development
    //   httpOnly: false,
    // });
    res.status(201).json(dataToSend);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" }); // Provide a generic error message
  }
}