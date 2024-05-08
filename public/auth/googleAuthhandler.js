"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthhandler = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = __importDefault(require("../modles/Users"));
async function googleAuthhandler(req, res) {
    try {
        //get code from qs
        const code = req.query.code;
        //get id and access token from code
        const { id_token } = await getGoogleToken(code);
        //get user from the token
        const user = jsonwebtoken_1.default.decode(id_token);
        //upsert the user
        const newUser = await Users_1.default.findOneAndUpdate({ email: user.email }, {
            email: user.email,
            firstName: user.given_name,
            lastName: user.family_name,
            password: user.at_hash,
            picture: user.picture
        }, { upsert: true });
        //generate token
        const token = jsonwebtoken_1.default.sign({ newUser }, process.env.JWT_SECRET, {
            expiresIn: "15d",
        });
        // Set cookie
        res.cookie("auth-token", token, { httpOnly: true });
        // Redirect back to client
        res.redirect(`${process.env.NEXT_PUBLIC_HOST}/profile`);
    }
    catch (error) {
        console.log(error);
        res.json({ error });
    }
}
exports.googleAuthhandler = googleAuthhandler;
async function getGoogleToken(code) {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        grant_type: "authorization_code"
    };
    try {
        const res = await axios_1.default.post(url, qs_1.default.stringify(values), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return res.data;
    }
    catch (error) {
        console.log(error);
    }
}
//# sourceMappingURL=googleAuthhandler.js.map