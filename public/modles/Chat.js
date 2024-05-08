"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatModle = new mongoose_1.default.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    members: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "users"
        }
    ],
    latestMessage: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "message",
        required: false
    },
    groupAdmin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users"
    },
    picture: {
        type: String,
    }
}, {
    timestamps: true,
});
const Chat = mongoose_1.default.models.chat || mongoose_1.default.model("chat", chatModle);
exports.default = Chat;
//# sourceMappingURL=Chat.js.map