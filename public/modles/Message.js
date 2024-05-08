"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageModel = new mongoose_1.default.Schema({
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users"
    },
    content: { type: String, trime: true },
    chat: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "chat"
    }
}, {
    timestamps: true
});
const Message = mongoose_1.default.model("message", messageModel);
exports.default = Message;
//# sourceMappingURL=Message.js.map