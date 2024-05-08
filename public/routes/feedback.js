"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedback = void 0;
const mail_1 = __importDefault(require("../utils/mail"));
const Users_1 = __importDefault(require("../modles/Users"));
async function feedback(req, res) {
    try {
        const { feedBack, user } = req.body;
        const { email } = await Users_1.default.findById(user);
        await (0, mail_1.default)({
            text: `
            ${email} has send a feedback on the website buisnesstool.com

            feedBack: ${feedBack}`,
            subject: "feedback from buisnesstools.com",
        });
        res.send("thank you for your feedback");
    }
    catch (error) {
        console.log("Error sending feedback");
        res.send("something went wrong");
    }
}
exports.feedback = feedback;
//# sourceMappingURL=feedback.js.map