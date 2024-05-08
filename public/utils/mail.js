"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
aws_sdk_1.default.config.update({
    accessKeyId: process.env.SES_ACCESS_KEY,
    secretAccessKey: process.env.SES_SECRET_KEY,
    region: process.env.REGION,
});
aws_sdk_1.default.config.getCredentials((err) => {
    if (err) {
        console.log(err);
    }
});
const SES = new aws_sdk_1.default.SES({ apiVersion: "2010-12-01" });
const transporter = nodemailer_1.default.createTransport({
    SES: SES,
});
async function sendMail({ subject, text, to = "buisness@buisnesstoolsonline.com", html, from = "fullstackwithsahil@gmail.com", }) {
    try {
        const response = await transporter.sendMail({
            from,
            subject,
            to,
            html,
            text,
        });
        return response;
    }
    catch (error) {
        console.log("error sending email in sendMail function", error);
    }
}
exports.default = sendMail;
//# sourceMappingURL=mail.js.map