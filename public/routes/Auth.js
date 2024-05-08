"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_1 = require("../controllers/register");
const login_1 = require("../controllers/login");
const protect_1 = require("../middleware/protect");
async function getData(req, res) {
    try {
        const userData = req.body.user;
        res.json(userData);
    }
    catch (error) {
        console.log("Error getting data");
        res.send("something went wrong");
    }
}
const router = express_1.default.Router();
router.post('/register/email', register_1.sendOtp);
router.post('/register/resendotp', register_1.resendotp);
router.post('/register', register_1.register);
router.post("/login", login_1.login);
router.post("/logout", login_1.logout);
router.post("/forgotpassword", login_1.forgotPassword);
router.get('/getData', protect_1.protectRoute, getData);
exports.default = router;
//# sourceMappingURL=Auth.js.map