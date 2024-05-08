"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Userschema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    picture: { type: String, required: false },
    plan: { type: String, required: false, default: "free" },
});
const User = mongoose_1.default.models.users || mongoose_1.default.model('users', Userschema);
exports.default = User;
//# sourceMappingURL=Users.js.map