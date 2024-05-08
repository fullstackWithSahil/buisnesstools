"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = __importDefault(require("../modles/Users"));
async function protectRoute(req, res, next) {
    const token = req.cookies['auth-token'];
    if (!token) {
        return res.send("You must be logged in to access this page");
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userData = await Users_1.default.findById(user.newUser._id);
        if (!userData) {
            return res.send("User not found");
        }
        // Attach user data to the request for further processing
        req.body.user = userData;
        // Proceed to the next middleware
        next();
    }
    catch (error) {
        console.error("Error in authentication middleware:", error);
        return res.status(403).send("Invalid or expired token");
    }
}
exports.protectRoute = protectRoute;
//# sourceMappingURL=protect.js.map