"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.logout = exports.login = void 0;
const Users_1 = __importDefault(require("../modles/Users"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const kv_1 = require("@vercel/kv");
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await Users_1.default.findOne({ email });
        if (!user) {
            return res.json({
                title: "Invalid email address",
                description: "This email address is not registered",
            });
        }
        const valid = await bcryptjs_1.default.compare(password, user.password);
        if (!valid) {
            return res.json({
                title: "Invalid password",
                description: "This is not the correct password for this email address",
            });
        }
        const token = jsonwebtoken_1.default.sign({ newUser: user }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.cookie("auth-token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: false // Set this to false if not using HTTPS locally
        });
        return res.status(201).json(user);
    }
    catch (error) {
        console.error("Error in login function", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.login = login;
async function logout(req, res) {
    res.cookie("auth-token", "", {
        maxAge: 10,
        secure: true,
        httpOnly: true
    }).send("user logged out successfully");
}
exports.logout = logout;
//send a post requset to /api/register/email to send otp to that user
async function forgotPassword(req, res) {
    const { email, otp } = req.body;
    const realOtp = await kv_1.kv.get(email);
    if (realOtp != otp) {
        res.status(200).send("invalid otp cannot grant access");
        return;
    }
    const user = await Users_1.default.findOne({ email });
    res.cookie("auth-token", user, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true
    });
    res.status(201).send("user logged in successfully");
}
exports.forgotPassword = forgotPassword;
//# sourceMappingURL=login.js.map