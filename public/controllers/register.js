"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.resendotp = exports.sendOtp = void 0;
const kv_1 = require("@vercel/kv");
const mail_1 = __importDefault(require("../utils/mail"));
const Users_1 = __importDefault(require("../modles/Users"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function genOtp() {
    const chars = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let otp = "";
    for (let i = 0; i <= 5; i++) {
        const j = Math.floor(Math.random() * 8);
        otp += chars[j];
    }
    return otp;
}
async function sendOtp(req, res) {
    try {
        const { email } = req.body;
        const Existing = await Users_1.default.findOne({ email });
        if (Existing) {
            res.json({
                title: "email already exists",
                description: "an account with this email already exists so try a different one"
            });
            return;
        }
        else {
            //generating otp sending email and saving it in reddis database
            const otp = genOtp();
            console.log("otp is", otp);
            await (0, mail_1.default)({
                text: `otp for registering is ${otp}`,
                to: email,
                subject: "OTP"
            });
            await kv_1.kv.set(email, otp);
            res.json({
                title: "OTP sent successfully",
                description: "An OTP for verication has been sent to your mail",
                ok: true
            });
        }
    }
    catch (error) {
        console.error("Error in sending otp:", error);
        res.json({
            title: "Error sending email",
            description: "There was an error sending email try again"
        });
    }
}
exports.sendOtp = sendOtp;
async function resendotp(req, res) {
    try {
        const { email } = await req.body;
        await kv_1.kv.del(email);
        //generating otp sending email and saving it in reddis database
        const otp = genOtp();
        console.log("otp is", otp);
        // await sendMail({
        //   text: `otp sent successfully ${otp}`,
        //   to: email,
        //   subject: "OTP",
        // });
        await kv_1.kv.set(email, otp);
        res.send("otp sent successfully");
    }
    catch (error) {
        console.error("Error in resending otp:", error);
        res.send("something went wrong try again");
    }
}
exports.resendotp = resendotp;
async function register(req, res) {
    try {
        const { firstName, lastname, email, password, otp } = req.body;
        //verify otp
        const realOtp = await kv_1.kv.get(email);
        if (otp != realOtp) {
            res.send("Invalid otp");
            return;
        }
        //hashing password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashPassword = await bcryptjs_1.default.hash(password, salt);
        //saving user in database
        const newUser = new Users_1.default({
            firstName,
            lastname,
            email,
            password: hashPassword,
        });
        if (newUser) {
            // Generate JWT token here
            const token = jsonwebtoken_1.default.sign({ newUser: newUser }, process.env.JWT_SECRET, {
                expiresIn: "15d",
            });
            await newUser.save();
            res.cookie('auth-token', token, {
                secure: true,
                httpOnly: true,
            });
            res.status(201).json(newUser);
        }
        else {
            res.status(400).json({ error: "Invalid user data" });
        }
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error" }); // Provide a generic error message
    }
}
exports.register = register;
//# sourceMappingURL=register.js.map